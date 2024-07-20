from marshmallow import Schema, fields, post_load
from models.Account import Role
from models import Customer
from schemas import AccountSchema

class CustomerSchema(Schema):

    id = fields.Integer()
    first_name = fields.String(allow_none=False)
    last_name = fields.String(allow_none=False)
    account = fields.Nested(AccountSchema)
    phone = fields.String()
    points = fields.Integer(default=0)
    @post_load
    def make_customer(self, data, **kwargs):
        return Customer(**data)