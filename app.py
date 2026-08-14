from flask import Flask, request, jsonify
# flask:webserver
# requests:read data from react
# jsonify:send data to react as a json(common language in coding)
# cors:allows react on different ports/domains to talk to flask
# bycrypt:hashes passwords for security
# jwt manager:manages authentication of tokens(validating)
# jwt required locks routes so that only those logged in can access it
# create access token:creates a token when user logs in and can be used in various components and has our user id as well
# get jwt identity: extracts user id from the token
# timedelta:sets token expiry

import sib_api_v3_sdk 
from sib_api_v3_sdk.rest import ApiException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
# managing tokens
# jwt-->json web token(verification badge)
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    create_refresh_token
)
import pymysql
# for generating otp
import random
import re
import traceback
# re-->regular expression
import os
import resend
from datetime import timedelta , datetime ,date
from calendar import monthrange
# to prevent brute force attacks,we can set a limit on how many times user can attempt to login within a certain time frame
# from dotenv import load_dotenv
# load_dotenv()
# we first need to install flask-limiter via pip install flask-limiter
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


# ── App setup ─────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

# to prevent brute force attacks
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day"]
)




# in case it is stolen it won't last forever
app.config["JWT_SECRET_KEY"]=os.environ.get("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
resend.api_key=os.environ.get("RESEND_API_KEY")
configuration=sib_api_v3_sdk.Configuration()
configuration.api_key["api-key"]=os.environ.get("BREVO_API_KEY")

api_instance=sib_api_v3_sdk.TransactionalEmailsApi(
    sib_api_v3_sdk.ApiClient(configuration)
)


jwt     = JWTManager(app)
bcrypt  = Bcrypt(app)

# # we can configure our db and set all requirements necessary for the connection and store it under a variable
# # it is inform of key value pair (dictionary)
# DB_CONFIG ={
#     "host":"localhost",
#     "user":"root",
#     "password":"",
#     "database":"mindgame_financial_system"}
    


# Single DB config using environment variables — no hardcoding
# now tht always data doesn't work,we use render but the db lives inside alwaysdata
DB_CONFIG = {
    "host":     os.environ.get("DB_HOST"),
    "user":     os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD"),
    "database": os.environ.get("DB_NAME")
}

# DB_CONFIG = {
#     "host": os.getenv("DB_HOST"),
#     "user": os.getenv("DB_USER"),
#     "password": os.getenv("DB_PASSWORD"),
#     "database": os.getenv("DB_NAME") 
# }

# print("DB_HOST:", os.getenv("DB_HOST"))

# dict cursor=false:makes the result come bck as key value pair instead of a list 
# 1.we define our get db cred function and we can re use it in every route tht requires it
# dict_cursor=false-->default meaning if we call it and pass nothing it will be automatically false
def get_db(dict_cursor=False):
    """Helper to get a DB connection."""
    # conn=creates our actual db connection
    # pymysql.connect()-->needs host,pss,name,user
    # **DB_config-->this unpacks the dictionary from db config
    # we return conn->our connection and conn.cursor->our cursor which we use 
    conn = pymysql.connect(**DB_CONFIG)
    if dict_cursor:
        return conn, conn.cursor(pymysql.cursors.DictCursor)
    return conn, conn.cursor()


# -----------Register--------------------[success]
@app.route("/api/signup", methods=["POST"])
@limiter.limit("5 per minute")
def signup():

    data = request.get_json()
    # reads the json sent from react

    # we use get method to avoid key error if any of the fields are missing
    # and we also strip whitespace from the inputs
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    email    = data.get("email",    "").strip().lower()
    phone    = data.get("phone",    "").strip()

    # 1. check empty form fields first
    if not all([username, password, email, phone]):
        return jsonify({"error": "All fields are required"}), 400
    
    # to make sure the email is written in full
    email_pattern=r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_pattern,email):
        return jsonify({"error":"Invalid email address"}),400
      
    #  to ensure only allowed domains are accepted
    
    allowed_domains=["gmail.com", "yahoo.com", "outlook.com"]
    domain=email.split("@")[1]
    if domain not in allowed_domains :
        return jsonify({"error": "Unsupported email provider"}), 400


    # 2. validate lengths — industry standard limits
    if len(username) > 30:
        return jsonify({"error": "Username must be 30 characters or less"}), 400
    if len(email) > 254:
        return jsonify({"error": "Email is too long"}), 400
    if len(password) > 72:
        # bcrypt silently ignores anything past 72 characters — cap it here
        return jsonify({"error": "Password must be 72 characters or less"}), 400
    if len(phone) > 15:
        return jsonify({"error": "Invalid phone number"}), 400

    # 3. validate email format on the backend too this will be used l
    # (frontend checks it but anyone can call the API directly)
    
    # Hash password before storing
    # bcrypt scrambles the password so we never store the real one
    # with .decode(utf-8):we decide the encrypted pass
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    # our container holding our otp
    # this generates a random otp btw the range given and it needs to be a string
    otp=str(random.randint(100000,999999))
    # datetime.now-->generates the current date and time and the otp is given 5 minutes to be alive
    expiry=datetime.now() + timedelta(minutes=5)
    connection, cursor = get_db()
    try:
        # Check if record already exists
        # we use OR so we catch if either email or username is already taken
        cursor.execute(
            "SELECT user_id FROM user_table WHERE email=%s OR username=%s",
            (email, username)
        )
        if cursor.fetchone():
            # we don't say which field is taken — prevents attackers from giving them a clue
            # figuring out which emails/usernames are registered
            return jsonify({"error": "Email or Username already registered",
                            "email":email}), 409

        sql = "INSERT INTO user_table(username, password, email, phone,is_verified,verification_code,verification_expiry) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (username, hashed_password, email, phone,False,otp,expiry))
        connection.commit()

        try:
            send_verification_email(
                email=email,
                otp=otp,
                username=username
            )

            return({"message":"Verification code sent to your email.",
                    "email":email}),201
        except Exception as e:
            print("Resend error",repr(e))
            return({"error":"Account created but verification email could not be sent"}),500

        
    except Exception as e:

        print("Signup error:", repr(e))   # we see it in logs, user doesn't
        return jsonify({"error": "Something went wrong. Please try again."}), 500
    
    finally:
        connection.close()



# -------------------resend verification----------------------
@app.route("/api/resend-verification",methods=["POST"])
@limiter.limit("3 per minute")
def resendVerification():

 data=request.get_json()
 connection,cursor=get_db(dict_cursor=True)

 email=data.get("email")
   
 try:
       cursor.execute(
         """
        SELECT * 
        FROM user_table
        WHERE email=%s
         """,(email)
       )

       user=cursor.fetchone()

       if not user:
           return jsonify({"error":"User not found"}),404

       if user["is_verified"]: 
           return jsonify({"error":"Account already verified"}) ,400  
       otp=str(random.randint(100000,999999))
       expiry=datetime.now() + timedelta(minutes=3)
       
       cursor.execute(
           """"
           UPDATE user_table 
           SET verification_code=%s and
           verification_expiry=%s
           WHERE email = %s
           """,
           (otp,expiry,email)
       )

       connection.commit()
       send_verification_email(
           email=email,
           otp=otp,
           username=user["username"]
       )
       return jsonify({"message":"A new verification code has been sent. If you don't see the   verification email within a minute, please check your Spam/Junk folder "}),200
 finally:
     connection.close()



        



# -------our gmail message using resend-------------
def send_verification_email(email,otp,username):
    send_smtp_email=sib_api_v3_sdk.SendSmtpEmail(
        sender={
            "name": "Pesa Wazi",
            "email": "pesawazi@gmail.com"
        },

        to=[
            {
                "email": email,
                "name": username
            }
        ],

        subject="Verify Your Email",

        text_content=f"""
        Greetings from, {username} Team,

        Your verification code is:

        {otp}

       This code expires in 3 minutes.

        Pesa Wazi Team
       """
     )

    try:
        api_instance.send_transac_email(send_smtp_email)

    except ApiException as e:
        print("Brevo Error:", e)
        raise
    
    

# --------test email------------

# @app.route("/test_email")
# def test_email():

#     try:
#         resend.Emails.send({
#             "from":"onboarding@resend.dev",
#             "to":["eleazermum@gmail.com",
#                   "givensmehta97@gmail.com",
#                   "pesawazi@gmail.com",
#                   "muringemuthenya@gmail.com"],
#             "subject":"Pesa Wazi Test",
#             "text":"Resend is working."

            
#         })

#         return{
#             "success":True
#         }
#     except Exception as e:
#         return{
#             "success":False,
#             "error":repr(e)
#         }






# -----------Verification Endpoint--------------------[success]
@app.route('/api/verify-email', methods=['POST'])
def verify_email():
    data = request.get_json()

    email = data.get("email")
    code = data.get("code")

    connection, cursor = get_db(dict_cursor=True)

    try:
         cursor.execute(
         """
         SELECT *
        FROM user_table
        WHERE email=%s
        """,(email,)
    )
         
         user = cursor.fetchone()

         if not user:
             return jsonify ({"error":"User not found"}),404
         
         if user["verification_code"] != code :
             return jsonify({"error":"Invalid code"}),400

         cursor.execute(
             
              """
            UPDATE user_table
            SET is_verified=TRUE,
                verification_code=NULL,
                verification_expiry=NULL
            WHERE email=%s
            """,
            (email,)
             
         ) 
         connection.commit()
         return jsonify({
             "message":"Account created.Redirecting to log in .",
             
         }),201
    
    finally:
        connection.close()





# -----------Login--------------------[success]
@app.route("/api/signin", methods=["POST"])
@limiter.limit("5 per minute")  # prevent password guessing
# we use json since its modern and handles complex data
# request-->gets everything sent from react 
# .get_json-->converts it into python dictionary for easy processing since our backend is python
def signin():
    data     = request.get_json()
    # data from react as a json

    email    = data.get("email","").strip().lower()
    password = data.get("password","")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    connection, cursor = get_db(dict_cursor=True)
    try:
        cursor.execute("SELECT * FROM user_table WHERE email=%s", (email,))
        user = cursor.fetchone()

        # Verify hashed password
        # both wrong email and wrong password return the same error
        # so attackers can't tell which one is wrong
        if not user or not bcrypt.check_password_hash(user["password"], password):
            return jsonify({"error": "Invalid credentials"}), 401
        
        if not user["is_verified"]:
            return jsonify({"error":"Please verify email before log in"}),403

        # user_id is baked into the token — every protected route uses this
        # to know whose data to fetch/save
        access_token = create_access_token(identity=str(user["user_id"]))

        refresh_token=create_refresh_token(identity=str(user["user_id"]))

        return jsonify({
            "message": "Login successful",
            "access_token":   access_token,
            "refresh_token": refresh_token,
            "user": {
                "user_id":  user["user_id"],
                "username": user["username"],
                "email":    user["email"],
                "phone":    user["phone"]
            }
        }), 200

    except Exception as e:
        print("Signin error:", str(e))
        return jsonify({"error": "Something went wrong. Please try again."}), 500

    finally:
        connection.close()



# --------------refresh endpoint------------------
@app.route("/api/refresh",methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id=get_jwt_identity()

    new_access_token= create_access_token(
        identity=user_id,
        expires_delta=timedelta(minutes=15)
    )

    return jsonify({
        "access_token":new_access_token    }),200


# ----------Add Expense---------------[success]
@app.route("/api/add_expenses", methods=["POST"])
@jwt_required()
def add_expenses():
    # get_jwt_identity extracts the user_id baked into the token at login
    # so we always know whose data to save without trusting what the frontend sends
    user_id = get_jwt_identity()

    data        = request.get_json()
    amount      = data.get("amount")
    description = data.get("description")
    spending    = data.get("category_name")

    if not all([amount, description, spending]):
        return jsonify({"error": "amount, description and spending are required"}), 400

    connection, cursor = get_db(dict_cursor=True)
    try:
        # 1. Check if category exists for this user
        cursor.execute(
            "SELECT category_id FROM category_table WHERE spending=%s AND user_id=%s",
            (spending, user_id)
        )
        result = cursor.fetchone()

        if not result:
            # 2. Create the category if it doesn't exist
            # this means users never have to manually create categories
            cursor.execute(
                "INSERT INTO category_table (spending, user_id) VALUES (%s, %s)",
                (spending, user_id)
            )
            connection.commit()
            category_id = cursor.lastrowid  # gets the ID of the row just inserted
        else:
            category_id = result["category_id"]

        # 3. Add the expense using the category_id
        cursor.execute(
            "INSERT INTO expense_table (amount, description, category_id, user_id) VALUES (%s, %s, %s, %s)",
            (amount, description, category_id, user_id)
        )
        connection.commit()
        return jsonify({"message": "Expense Added successfully"}), 201

    except Exception as e:
        print("Add expense error:", str(e))
        return jsonify({"error": "Something went wrong. Please try again."}), 500

    finally:
        connection.close()


# -----Get Spendings-----
@app.route("/api/get_spendings", methods=["GET"])
@jwt_required()  # Protect route with JWT
def get_spendings():

    user_id = get_jwt_identity()  # Get user from token
    # this checks whether the url,has a parameter called month and if it does store=selected_month
    selected_month=request.args.get("month")
    
    connection, cursor = get_db(dict_cursor=True)
    try:
        if selected_month:
         sql = '''
         SELECT 
            u.username,
            u.phone,
            e.amount,
            e.description,
            e.date,
            c.spending
            FROM expense_table e
            JOIN user_table u
            ON e.user_id = u.user_id
            JOIN category_table c 
            ON e.category_id = c.category_id
            WHERE u.user_id = %s
            AND DATE_FORMAT(e.date,'%%Y-%%m')=%s
            ORDER BY e.date DESC
            '''
         cursor.execute(sql, (user_id,selected_month))
            # LEFT JOIN on budget means expenses still show even if no budget
            # was set for that month
            # DATE_FORMAT extracts just year and month so they match correctly
         

        else : 
            sql = '''
         SELECT
            u.username,
            u.phone,
            e.amount,
            e.description,
            e.date,
            c.spending
            FROM expense_table e
            JOIN user_table u
            ON e.user_id = u.user_id
            JOIN category_table c
            ON e.category_id = c.category_id
            WHERE u.user_id = %s
            ORDER BY e.date DESC
            '''
            cursor.execute(sql, (user_id,))
    
        spent = cursor.fetchall()
        return jsonify(spent), 200

    except Exception as e:
        print("Get spendings error:", str(e))
        return jsonify({"error": "Something went wrong. Please try again."}), 500

    finally:
        connection.close()



# ----------get budget------------
@app.route("/api/get_budget",methods=["GET"])
@jwt_required()
def get_budget():
    user_id=get_jwt_identity()


    # selected_month=request.args.get("month")
    # month_start=datetime.strptime(selected_month,"%Y-%m")
    # last_day=monthrange(month_start.year,month_start.month)[1]
    # month_end=month_start.replace(day=last_day)
    today=date.today()


    connection,cursor=get_db(dict_cursor=True)
    # automatic budget expiry
    expire_sql="""
     UPDATE budget_table
     SET status = 'EXPIRED'
     WHERE user_id = %s
     AND status = 'ACTIVE'
     AND end_date < %s """
    cursor.execute(expire_sql,(user_id,today))
    connection.commit()

    try:
        sql="""SELECT
         amount_limit,start_date,end_date,status
         FROM budget_table
         WHERE user_id=%s
         AND status = 'ACTIVE'
         AND start_date <= %s
         AND end_date >= %s
         LIMIT 1
         """
        # cursor.execute(sql,(user_id,month_end,month_start))
        cursor.execute(sql,(user_id,today,today))
        budget=cursor.fetchone()

        if not budget:
            return jsonify({"message":"No budget found"}),404
        
        return jsonify(budget),200
    
    except Exception as e:
        print("Get budget error:",str(e))
        return jsonify({"error":"something went wrong"}),500
    
    finally:
        connection.close()


# ------------get_budget_summary----------
@app.route("/api/get_budget_summary", methods=["GET"])
@jwt_required()
def get_budget_summary():

    user_id=get_jwt_identity()

    selected_month=request.args.get("month")
    month_start=datetime.strptime(selected_month, "%Y-%m").date()
    last_day=monthrange(month_start.year,month_start.month)[1]
    month_end=month_start.replace(day=last_day)

    connection,cursor=get_db(dict_cursor=True)
    

    try:
        sql = """
        SELECT
        budget_id,
        amount_limit,
        start_date,
        end_date
        FROM budget_table
        WHERE user_id = %s
        AND  start_date <=%s AND end_date >=%s
        LIMIT 1
        """

        cursor.execute(sql,(user_id,month_end,month_start))
        budget=cursor.fetchone()

        if not budget:
            return jsonify({"message":"No active budget"}),404
        
        sql = """
        SELECT COALESCE(SUM(amount), 0) AS total_spent
        FROM expense_table
        WHERE user_id = %s
        AND date BETWEEN %s AND %s
        """

        cursor.execute(
        sql,
    (
        user_id,
        budget["start_date"],
        budget["end_date"],
    ),
    )
        spent=cursor.fetchone()

        total_spent=float(spent["total_spent"])

        remaining=float(budget["amount_limit"])-total_spent

        return jsonify({
            "amount_limit": float(budget["amount_limit"]),
            "total_spent": total_spent,
            "remaining": remaining,
            "start_date": budget["start_date"],
            "end_date": budget["end_date"],
        }), 200
    
    except Exception as e:
        traceback.print_exc()
        print("Budget summary error:",str(e))
        return jsonify({"error":str(e)}),500
        # return jsonify({"error":"Something went wrong"}),500
    finally:
        connection.close()



# ------------All time summary --------------------------
@app.route("/api/get_all_time_summary", methods=["GET"])
@jwt_required()
def get_all_time_summary():
    # connect to the database and we will need a dictionary so dict_cursor=true

    user_id=get_jwt_identity()

    connection,cursor= get_db(dict_cursor=True)
    try:
        # COALESCE means if we can't get what we need or there is no data return 0
        # 1.total spent
        sql='''
        SELECT COALESCE(SUM(amount),0) AS all_time_spent
        FROM expense_table
        WHERE user_id = %s'''
        cursor.execute(sql,(user_id,))
        spent= cursor.fetchone()

        # we will store the data in the spent variable
        # now we assign it to an actual variable that we will render
        
        total_spent=float(spent["all_time_spent"])


        # 2. total transactions
        sql = '''
        SELECT COUNT(expense_id) AS transaction_count
        FROM expense_table
        WHERE user_id = %s '''

        cursor.execute(sql,(user_id,))
        transactions=cursor.fetchone()

        transaction_count = transactions["transaction_count"]

        # 3.largest expense
        # to get the largest expense, we sort all expenses in descending order and get the on at the top
        sql= '''
        SELECT amount,description,date 
        FROM expense_table 
        WHERE user_id = %s
        ORDER BY amount DESC, date DESC
        LIMIT 1'''
        cursor.execute(sql,(user_id,))
        largest_expense = cursor.fetchone()

        # 4. average expense
        if transaction_count == 0:
            average_expense = 0
        else:
            average_expense = total_spent/transaction_count

        # 5.Most frequent category
        sql = '''
        SELECT c.spending, COUNT(*) AS count
        FROM expense_table e
        JOIN category_table c
        ON e.category_id = c.category_id
        WHERE e.user_id = %s
        GROUP BY c.spending
        ORDER BY count DESC
        LIMIT 1'''
        cursor.execute(sql,(user_id))
        frequent_cat = cursor.fetchone()

        return jsonify({
            "total_spent":total_spent,
            "total_transactions":transaction_count,
            "largest_expense":largest_expense,
            "average_expense":average_expense,
            "frequent_category":frequent_cat
        }),200

    except Exception as e:
        # traceback.print_exc()
        # return jsonify({"error":str({e})}),500
        return jsonify({"error":"Something isn't right"}),500
    finally:
        connection.close()
        cursor.close()


# ---------get monthly spending history---------------
@app.route("/api/get_monthly_spending", methods=["GET"])
@jwt_required()
def get_monthly_spending():
    user_id = get_jwt_identity()

    connection,cursor = get_db(dict_cursor=True)

    try:
        sql='''
        SELECT DATE_FORMAT(date, '%%b %%Y') AS month,
        COALESCE(SUM(amount),0) AS total_spent
        FROM expense_table
        WHERE user_id = %s
        GROUP BY DATE_FORMAT(date,'%%b %%Y' )
        ORDER BY YEAR(date), MONTH(date)
        '''
        cursor.execute(sql,(user_id,))
        spent = cursor.fetchall()
        return jsonify(spent),200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error":str({e})}),500
        # return jsonify({"error":"Something went wrong .Please try again"}),500
    finally:
        connection.close()
        cursor.close()


    


# -------Upload Budget--------[success — with update functionality]
@app.route("/api/upload_budget", methods=["POST"])
@jwt_required()  # Protect route with JWT
def upload_budget():

    user_id = get_jwt_identity()  # Get user from token

    data         = request.get_json()
    amount_limit = data.get("amount_limit")
    # month        = data.get("month")
    start_date   =data.get("start_date")
    end_date     =data.get("end_date")

    # month = datetime.strptime(month, "%Y-%m-%d").date()
    # month = month.replace(day=1)
  
    if not amount_limit or not start_date or not end_date:
        return jsonify({"error": "Amount, start date and end date  are required"}), 400
    
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")

    if end < start:
     return jsonify({
        "error":"End date cannot be before the start date."
    }),400

    connection, cursor = get_db(dict_cursor=True)
    try:
        # check first if there is already a budget for this user and month
        # we cant have a duplicate entry
        sql = "SELECT budget_id FROM budget_table WHERE user_id=%s AND start_date <=%s AND end_date>=%s"
        cursor.execute(sql, (user_id, start_date,end_date))
        existing = cursor.fetchone()

        if existing:
            # update it — upsert pattern (update if exists, insert if not)
            # sql = "UPDATE budget_table SET amount_limit=%s WHERE user_id=%s AND start_date=%s AND end_date=%s"
            # cursor.execute(sql, (amount_limit,user_id,end_date,start_date ))
            # connection.commit()
            return jsonify({"error": "This budget overlaps with an existing one"}), 200
        else:
            # create a new one
            sql = "INSERT INTO budget_table (amount_limit, user_id, start_date,end_date,status) VALUES (%s, %s, %s,%s,%s)"
            cursor.execute(sql, (amount_limit, user_id, start_date,end_date,"ACTIVE"))
            connection.commit()
            return jsonify({"message": "Budget uploaded successfully"}), 201

    except Exception as e:
        print("Upload budget error:", str(e))
        return jsonify({"error": "Something went wrong. Please try again."}), 500

    finally:
        connection.close()


# # -------Add Category------[skip]
# @app.route("/api/add_category", methods=["POST"])
# @jwt_required()  # Protect route with JWT
# def add_category():
#     user_id       = get_jwt_identity()  # Get user from token
#     category_name = request.form.get("spending")

#     if not category_name:
#         return jsonify({"error": "spending (category name) is required"}), 400

#     connection, cursor = get_db()
#     try:
#         # Prevent duplicate categories for same user
#         cursor.execute(
#             "SELECT category_id FROM category_table WHERE spending=%s AND user_id=%s",
#             (category_name, user_id)
#         )
#         if cursor.fetchone():
#             return jsonify({"error": "Category already exists"}), 409

#         sql = "INSERT INTO category_table (spending, user_id) VALUES (%s, %s)"
#         cursor.execute(sql, (category_name, user_id))
#         connection.commit()
#         return jsonify({"message": "Category added successfully"}), 201

#     except Exception as e:
#         print("Add category error:", str(e))
#         return jsonify({"error": "Something went wrong. Please try again."}), 500

#     finally:
#         connection.close()


# # -------Get Categories (bonus utility route)--------
# @app.route("/api/get_categories", methods=["GET"])
# @jwt_required()
# def get_categories():
#     user_id = get_jwt_identity()
#     connection, cursor = get_db(dict_cursor=True)
#     try:
#         cursor.execute(
#             "SELECT category_id, spending FROM category_table WHERE user_id=%s",
#             (user_id,)
#         )
#         categories = cursor.fetchall()
#         return jsonify(categories), 200

#     except Exception as e:
#         print("Get categories error:", str(e))
#         return jsonify({"error": "Something went wrong. Please try again."}), 500

#     finally:
#         connection.close()

if __name__ == "__main__":
    app.run(debug=True)