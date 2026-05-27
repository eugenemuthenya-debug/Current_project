from flask import Flask, request, jsonify
# flask:webserver
# requsts:read data from react
# jsonify:send data to react as a json(common language in coding)
# cors:allows react on different ports/doamins to talk to flask
# bcyrpt:hashes passwords for security
# jwt manager:manages authentication of tokens(validating)
# jwt required locks routes so that only those logged in can access it
# create access token:creates a token when user logs in and can be used in various components and has our user id as well
# get jwt identity: extracts user id from the token
# timedelta:sets token expiry
from flask_cors import CORS
from flask_bcrypt import Bcrypt
# managing tokens
# jwt-->json web token(verification badge)
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
import pymysql
import os
# from datetime import timedelta
# to prevent brute force attacks,we can set a limit on how many times user can attempt to login within a certain time frame
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

# Load secret key from environment variable for jwt in order for us to use them
# but for now we are using localhost
app.config["JWT_SECRET_KEY"] = "super-secret-key"
# incase it is stolen it won't last forever
# app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

jwt     = JWTManager(app)
bcrypt  = Bcrypt(app)

# # we can configure our db and set all requrements necessary for the connection and store it under a variable
# # it is inform of key value pair (dictionry)
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

# dict cursor=false:makes the result come bck as key value pair instead of a list 
# 1.we definr our get db cred function and we can re use it in every route tht requires it
# dict_cursor=flase-->default meaning if we call it and pass nothing it will be automatically false
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
    # wiht .decode(utf-8):we deciode the encryted pass
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

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
            return jsonify({"error": "Email or Username already registered"}), 409

        sql = "INSERT INTO user_table(username, password, email, phone) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (username, hashed_password, email, phone))
        connection.commit()
        return jsonify({"message": "Thank you for joining"}), 201

    except Exception as e:
        print("Signup error:", str(e))   # we see it in logs, user doesn't
        return jsonify({"error": "Something went wrong. Please try again."}), 500

    finally:
        connection.close()


# -----------Login--------------------[success]
@app.route("/api/signin", methods=["POST"])
@limiter.limit("10 per minute")  # prevent password guessing
# we use json since its modern and handles complex data
# request-->gets everything sent from react 
# .get_json-->converts it into python dictionary for easy processing since our backend is python
def signin():
    data     = request.get_json()
    # data from react as a json

    email    = data.get("email")
    password = data.get("password")

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

        # user_id is baked into the token — every protected route uses this
        # to know whose data to fetch/save
        access_token = create_access_token(identity=str(user["user_id"]))

        return jsonify({
            "message": "Login successful",
            "token":   access_token,
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

    connection, cursor = get_db(dict_cursor=True)
    try:
        sql = '''
        SELECT 
            u.username,
            u.phone,
            e.amount,
            e.date,
            c.spending,
            b.amount_limit,
            b.month
        FROM expense_table e
        JOIN user_table u ON e.user_id = u.user_id
        JOIN category_table c ON e.category_id = c.category_id
        LEFT JOIN budget_table b ON b.user_id = u.user_id 
            AND DATE_FORMAT(b.month,'%%Y-%%m') = DATE_FORMAT(e.date,'%%Y-%%m')
        WHERE u.user_id = %s
        ORDER BY e.date DESC
        '''
        # LEFT JOIN on budget means expenses still show even if no budget
        # was set for that month
        # DATE_FORMAT extracts just year and month so they match correctly
        cursor.execute(sql, (user_id,))
        spent = cursor.fetchall()
        return jsonify(spent), 200

    except Exception as e:
        print("Get spendings error:", str(e))
        return jsonify({"error": "Something went wrong. Please try again."}), 500

    finally:
        connection.close()


# -------Upload Budget--------[success — with update functionality]
@app.route("/api/upload_budget", methods=["POST"])
@jwt_required()  # Protect route with JWT
def upload_budget():

    user_id = get_jwt_identity()  # Get user from token

    data         = request.get_json()
    amount_limit = data.get("amount_limit")
    month        = data.get("month")

    if not amount_limit or not month:
        return jsonify({"error": "amount_limit and month are required"}), 400

    connection, cursor = get_db(dict_cursor=True)
    try:
        # check first if there is already a budget for this user and month
        # we cant have a duplicate entry
        sql = "SELECT budget_id FROM budget_table WHERE user_id=%s AND month=%s"
        cursor.execute(sql, (user_id, month))
        existing = cursor.fetchone()

        if existing:
            # update it — upsert pattern (update if exists, insert if not)
            sql = "UPDATE budget_table SET amount_limit=%s WHERE user_id=%s AND month=%s"
            cursor.execute(sql, (amount_limit, user_id, month))
            connection.commit()
            return jsonify({"message": "Budget update successful"}), 200
        else:
            # create a new one
            sql = "INSERT INTO budget_table (amount_limit, user_id, month) VALUES (%s, %s, %s)"
            cursor.execute(sql, (amount_limit, user_id, month))
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

# if __name__ == "__main__":
#     app.run(debug=True)