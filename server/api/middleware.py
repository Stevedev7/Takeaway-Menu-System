from functools import wraps
from utils.auth import validate_token
from flask import request
from services.account_services import get_account_by_email
    

def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization', None)
        if token:
            data = validate_token(token.split(" ")[1])
            if data == False:
                return {"error": "Unauthorised"}, 401
            try:
                account = get_account_by_email(data['account']['email'])
                request.account = account
            except ValueError:
                return {'error': 'User Not found'}, 404
        else:
            return {'message': 'Token is missing'}, 401
        return func(*args, **kwargs)
    return wrapper