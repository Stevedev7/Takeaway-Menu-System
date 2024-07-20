import os
import jwt
import datetime

from services.account_services import get_account_by_email

JWT_SECRET = os.getenv('JWT_SECRET', 'jwt-secret-key')

def generate_token(user):
    return jwt.encode(payload={"account": user, "exp": (datetime.datetime.utcnow() + datetime.timedelta(days=1))}, key=JWT_SECRET, algorithm="HS256")

def validate_token(token):
    try:

        payload = jwt.decode(jwt=token, key=JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        print("Token has expired")
    except jwt.InvalidTokenError:
        print("Invalid token")
    return False