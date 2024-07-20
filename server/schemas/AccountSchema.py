from marshmallow import Schema, fields, post_load
from models.Account import Role
from models import Account

class AccountSchema(Schema):

    id = fields.Integer()
    email = fields.String(allow_none=False)
    password = fields.String(allow_none=False, load_only=True)
    role = fields.Enum(Role)


    @post_load
    def make_account(self, data, **kwargs):
        return Account(**data)