from marshmallow import Schema, fields, post_load
from models.Favorite import Favorite
from schemas import MenuSchema
class FavoriteSchema(Schema):
    id = fields.Int(dump_only=True)
    customer_id = fields.Int(required=True)
    menu_item_id = fields.Int(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    menu_item = fields.Nested(MenuSchema, dump_only=True)
    
    @post_load
    def make_favorite_item(self, data, **kwargs):
        return Favorite(**data)