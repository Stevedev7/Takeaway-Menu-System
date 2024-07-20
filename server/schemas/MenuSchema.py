from marshmallow import Schema, fields, post_load
from models.Account import Role
from models import Menu

class MenuSchema(Schema):

    id = fields.Integer()
    business_id = fields.Integer()
    item_name = fields.String()
    description = fields.String()
    price = fields.Float()
    img = fields.String()

    @post_load
    def make_account(self, data, **kwargs):
        return Menu(**data)