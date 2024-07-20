from marshmallow import Schema, fields, post_load
from models.Account import Role
from models import Business
from schemas import AccountSchema
from schemas.MenuSchema import MenuSchema


class BusinessSchema(Schema):

    id = fields.Integer()
    name = fields.String()
    description = fields.String()
    website = fields.String()
    menu = fields.Nested(MenuSchema, many=True)
    account = fields.Nested(AccountSchema)
    phone = fields.String()
    street_number = fields.String()
    latitude = fields.Float()
    longitude = fields.Float()
    street = fields.String()
    city = fields.String()
    country = fields.String()
    postcode = fields.String()
    img = fields.String(default=None)


    @post_load
    def make_business(self, data, **kwargs):
        return Business(**data)