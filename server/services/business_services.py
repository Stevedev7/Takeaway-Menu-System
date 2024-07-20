from models import Business
from utils.Exceptions import NotFound

def get_business_by_id(id):
    business = Business.query.get(id)
    if business is None:
        raise NotFound(message="Profile not found.")
    return business