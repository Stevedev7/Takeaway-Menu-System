import json
from flask_restful import Resource
from flask import request, Response

from services.account_services import get_account_by_email
from utils.password import compare_password
from utils.auth import generate_token
from schemas import AccountSchema

class LoginApi(Resource):
    def post(self):
        body = json.loads(request.data)
        email = body["email"]
        password = body["password"]

        try:
            account = get_account_by_email(email)
            if compare_password(account.password, password):
                return {**AccountSchema().dump(account), "token": generate_token(AccountSchema().dump(account))}, 200
            return {"error":"Incorrect credentials"},401
        
        except ValueError as e:
            return { "error": "Email not found" }, 401