from models import Customer
from utils.database import db

def get_customer_by_id(id):
    customer = Customer.query.get(id)
    if customer is None:
        raise ValueError("Customer not found.")
    return customer

def delete_customer_by_id(id):
    customer = Customer.query.get(id)
    if not customer:
        return None
    db.session.delete(customer)
    db.session.commit()
    return customer