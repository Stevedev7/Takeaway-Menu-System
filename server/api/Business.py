from flask import request
from flask_restful import Resource
import json

from utils.database import db
from api.middleware import login_required
from services.business_services import get_business_by_id
from services.account_services import delete_account_by_id
from models.Account import Role
from schemas import BusinessSchema, AccountSchema
from utils.Exceptions import NotFound
class Business(Resource):

    method_decorators = {
        'post': [login_required],
        'put': [login_required],
        'delete': [login_required],
    }

    def get(self, id):
        
        try:
            existing_business = get_business_by_id(id)
            return {**BusinessSchema().dump(existing_business), **AccountSchema().dump(existing_business.account)}, 200
        except NotFound:
            return {"error" :  "Profile Not Found"}, 404

    def post(self, id):
        account = request.account
        if (account.role != Role.ADMIN and int(id) != account.id) or (account.role == Role.CUSTOMER):
            return {"message":"Forbidden"},403
        try:
            existing_business = get_business_by_id(id)
            return {"error": "Already exists", "profile": {**BusinessSchema().dump(existing_business), **AccountSchema().dump(existing_business.account)}}, 409
        except NotFound:
            try:
                body = json.loads(request.data)
                business_data = {
                    "name": body["name"],
                    "description": body["description"],
                    "id": account.id,
                    "website": body["website"],
                    "phone": body["phone"],
                    "img": body["img"]
                }
            
                try:
                    profile = BusinessSchema().load(business_data)
                    db.session.add(profile)
                    db.session.commit()
                except Exception as e:
                    print(e) 
                    return { "error": str(e)}, 500
            except Exception:
                return {"error": "internal server error"}, 500
        return  {"message": "Business created successfully!","business": business_data }, 201
        
    def put(self, id):
        account = request.account
        if account.role != Role.ADMIN and int(id) != account.id:
            return {"message":"Forbidden"},403
        try:
            existing_business = get_business_by_id(id)
            try:
                body = json.loads(request.data)
                print(BusinessSchema().dump(existing_business))
                existing_business.name = body.get("name", existing_business.name)
                existing_business.description = body.get("description", existing_business.description)
                existing_business.website = body.get("website", existing_business.website)
                existing_business.phone = body.get("phone", existing_business.phone)
                existing_business.street_number = body.get("streetNumber", existing_business.street_number)
                existing_business.latitude = body.get("latitude", existing_business.latitude)
                existing_business.longitude = body.get("longitude", existing_business.longitude)
                existing_business.street = body.get("street", existing_business.street)
                existing_business.city = body.get("city", existing_business.city)
                existing_business.country = body.get("country", existing_business.country)
                existing_business.postcode = body.get("postcode", existing_business.postcode)
                existing_business.img = body.get("img", existing_business.img)
                db.session.commit()

                print(existing_business.__dict__)
            except KeyError as e:
                    return {"error": f"Missing field '{str(e)}'."},
            except  Exception as e:
                return {"error": str(e)}, 500
        except ValueError:
            return {"error" :  "Business Not Found"}, 404
        return None,204
    
    def delete(self, id):
        account = request.account
        if (account.role != Role.ADMIN and int(id) != account.id) or (account.role == Role.CUSTOMER):
            return {"message":"Forbidden"},403
        deleted_customer = delete_account_by_id(int(id))
        if not deleted_customer:
            return {"message": "Account not found"}, 404
        return None, 204