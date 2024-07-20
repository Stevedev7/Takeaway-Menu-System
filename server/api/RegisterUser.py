from flask_restful import Resource
import json
from flask import request, Response
from email_validator import validate_email, EmailNotValidError

from models import Account
from models.Account import Role

from utils.database  import db
from utils.password import hash_password, compare_password

class RegisterUserApi(Resource):

    def post(self):
        """
        file: /api/docs/paths/register-user.yaml
        """
        body = json.loads(request.data)
        email = body["email"]
        password = body["password"]
        role = body.get("role", "CUSTOMER")

        try:
            emailinfo = validate_email(email)
            existing_account = Account.query.filter_by(email=emailinfo.normalized).first()

            if existing_account:
                return Response(content_type='application/json', response=json.dumps({'error': 'Email address already exists.'}), status=400)
            
            password_hash = hash_password(password)
            account = Account(email=emailinfo.normalized, password=password_hash, role=role)
            db.session.add(account)
            db.session.commit()
            return { 'email': email, 'password': password}, 201
        except EmailNotValidError as e:
            return Response(content_type='application/json', response=json.dumps({'error': 'Pleaase enter a valid email address.'}), status=400)
        except Exception as e:
            print(e)
            return Response(content_type='application/json', response=json.dumps({'error': 'Something went wrong.'}), status=500)
