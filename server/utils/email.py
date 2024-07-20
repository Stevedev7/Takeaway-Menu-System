import smtplib, ssl
from email.message import EmailMessage
import os
import datetime

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def  send_email(html, email):
    try :

        email_message = EmailMessage()
        email_message['Subject'] = 'TMS'
        email_message['From'] = EMAIL_ADDRESS
        email_message['To'] = [email]
        email_message.set_content(html, subtype='html')
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL('smtp.gmail.com', '465', context=context) as server:
            server.login(user=EMAIL_ADDRESS, password=EMAIL_PASSWORD)
            server.send_message(email_message)
    except Exception as e:
        print(e)