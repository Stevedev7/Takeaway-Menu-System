from flask import request
from flask_restful import Resource
import json

from utils.database import db
from api.middleware import login_required
from services.customer_services import get_customer_by_id
from services.account_services import get_account_by_id, delete_account_by_id
from models.Account import Role
from schemas import CustomerSchema, AccountSchema
from utils.Exceptions import NotFound

class Customer(Resource):

    method_decorators = {
        'post': [login_required],
        'put': [login_required],
        'delete': [login_required]
    }

    def get(self, id):
        try:
            existing_customer = get_customer_by_id(int(id))
            return {**CustomerSchema().dump(existing_customer), **AccountSchema().dump(existing_customer.account)}, 200
        except ValueError as e:
            return {"error" :  "Customer Not Found", "e": str(e)}, 404

    def post(self, id):
        account = request.account
        if (account.role != Role.ADMIN and int(id) != account.id) or (account.role == Role.BUSINESS):
            return {"message":"Forbidden"},403
        try:
            existing_customer = get_customer_by_id(id)
            return {"error": "Already exists", "customer": {**CustomerSchema().dump(existing_customer), **AccountSchema().dump(existing_customer.account)}}, 409
        except ValueError:
            try:
                body = json.loads(request.data)
                cust_data = {
                    "first_name": body["first_name"],
                    "last_name": body["last_name"],
                    "phone": body["phone"],
                    "id": account.id
                }
            
                try:
                    customer = CustomerSchema().load(cust_data)
                    db.session.add(customer)
                    db.session.commit()
                except Exception as e:
                    return { "error": str(e)}, 500
            except Exception:
                return {"error": "internal server error"}, 500
        return  {"message": "Customer created successfully!","customer": cust_data }, 201
        
    def put(self, id):
        account = request.account
        if (account.role != Role.ADMIN and int(id) != account.id) or (account.role == Role.BUSINESS):
            return {"message":"Forbidden"},403
        try:
            existing_customer = get_customer_by_id(id)
            try:
                body = json.loads(request.data)
                existing_customer.first_name = body["first_name"] or existing_customer.first_name
                existing_customer.last_name = body["last_name"] or existing_customer.last_name
                existing_customer.phone = body["phone"] or existing_customer.phone
                db.session.commit()
            except KeyError as e:
                    return {"error": f"Missing field '{str(e)}'."},
            except  Exception as e:
                return {"error": str(e)}, 500
        except NotFound:
            return {"error" :  "Customer Not Found"}, 404
        return None,204
    
    def delete(self, id):
        account = request.account
        if (account.role != Role.ADMIN and int(id) != account.id) or (account.role == Role.BUSINESS):
            return {"message":"Forbidden"},403
        deleted_customer = delete_account_by_id(int(id))
        if not deleted_customer:
            return {"message": "Customer not found"}, 404
        return None, 204
