// resend api key "re_EecoiZrb_2BtCmVNUgrXmnbXaj4qrVfLB"
// import axios from "axios";
// const API= axios.create({baseURL:"https://financial-backend-ps2l.onrender.com/api",});
//   export default API;
//  try:
//          msg = Message("Verify Your Email",
//                       recipients=[email]
//                       )
//         msg.body =  f"""
//         Hello {username},

//         Your verification code is:

//         {otp}

//         This code expires in 5 minutes.

//         Pesa Wazi Team
//         """
//         mail.send(msg)

//         return jsonify({"message": "Account creaated.Check your email for the verification code."}), 201


// this was all the tests we ran to see where the problem was,we nolonger user smtp.gmail.com since it has issues.
// we move to resend

// mail = Mail(app)
// # mail server app configuration
// # we tell our app which outgoing gmail server to use
// app.config['MAIL_SERVER']=os.environ.get("MAIL_SERVER")
// # now we give it gmail's secure port
// app.config['MAIL_PORT']= int(os.environ.get('MAIL_PORT',587))
// # we encrypt our connection to the gmail port and server using tls,without it our connection to the server can easily be intercepted
// app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'true').strip().lower() in ['true', '1', 'yes']
// # now we give it the gmail of our website tht sends the mail,the users will see its from our website 
// app.config['MAIL_USERNAME'] =os.environ.get('MAIL_USERNAME')
// # our password
// app.config['MAIL_PASSWORD']=os.environ.get('MAIL_PASSWORD')

// # this is to check if the credentials are being passed and we found out that they aren't
// print("MAIL_SERVER:",app.config['MAIL_SERVER'])
// print("MAIL_PORT:", app.config['MAIL_PORT'])
// print("MAIL_USE_TLS:", app.config['MAIL_USE_TLS'])
// print("MAIL_USERNAME:", app.config['MAIL_USERNAME'])
// print("MAIL_PASSWORD:", "SET" if app.config['MAIL_PASSWORD'] else "NOT SET")

// # email verification code
// # 1. we import the library by using pip install flask-mail
// from flask_mail import Mail
// # now this sends the otp email
// from flask_mail import Message


// # create the message
//         msg = Message("Verify your Email",
//                       recipients=[email]
//                       )
//         msg.body= f"""
//           Hello {username},

//           Your verification code is;

//           {otp}

//           This code expires in 5 minutes.

//           Pesa Wazi Team 
//         """
//         try:
            
//             mail.send(msg)
           
//             return jsonify({"message":"Account cretaed check your email for the verificatin code"})
        
//         except Exception as e:
         
//          import traceback
//          print(traceback.format_exc())

//          return jsonify({"error":"Account cretaed but verification email could not be sent"}),500


// # --------------test gmail route---------------
// @app.route("/smtp-test")
// def smtp_test():

//     import socket
//     import time

//     start = time.time()

//     try:

//         sock = socket.create_connection(
//             ("smtp.gmail.com", 587),
//             timeout=10
//         )

//         sock.close()

//         return jsonify({
//             "success": True,
//             "host": "smtp.gmail.com",
//             "port": 587,
//             "time_taken": round(time.time() - start, 2)
//         })

//     except Exception as e:

//         return jsonify({
//             "success": False,
//             "error": repr(e),
//             "time_taken": round(time.time() - start, 2)
//         }), 500
    
// # ---------login test-----------
// @app.route("/smtp-login-test")
// def smtp_login_test():

//     import smtplib

//     try:

//         server = smtplib.SMTP(
//             "smtp.gmail.com",
//             587,
//             timeout=10
//         )

//         server.starttls()

//         server.login(
//             app.config["MAIL_USERNAME"],
//             app.config["MAIL_PASSWORD"]
//         )

//         server.quit()

//         return jsonify({
//             "success": True,
//             "message": "Login successful"
//         })

//     except Exception as e:

//         return jsonify({
//             "success": False,
//             "error": repr(e)
//         }), 500    
    

// # --------internet tets-------------
// @app.route("/internet-test")
// def internet_test():

//     import requests

//     try:

//         r = requests.get(
//             "https://www.google.com",
//             timeout=10
//         )

//         return {
//             "success": True,
//             "status": r.status_code
//         }

//     except Exception as e:

//         return {
//             "success": False,
//             "error": repr(e)
//         }
