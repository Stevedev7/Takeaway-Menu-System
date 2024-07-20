from utils.database import BaseModel, db
from sqlalchemy import UniqueConstraint

class Favorite(BaseModel):
    __tablename__ = "favorite"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    customer = db.relationship('Customer', back_populates='favorites')
    menu_item = db.relationship('Menu', back_populates='favorite')

    __table_args__ = (
        UniqueConstraint('customer_id', 'menu_item_id', name='unique_favorite'),
    )

    def __repr__(self):
        return f'<Favorite {self.id}>'