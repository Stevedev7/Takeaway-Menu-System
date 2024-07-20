from utils.database import BaseModel, db


class Menu(BaseModel):
    __tablename__ = "menu"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, default=0)
    business_id = db.Column(db.Integer, db.ForeignKey('business.id', ondelete='CASCADE', onupdate='CASCADE'))
    item_name = db.Column(db.String(255))
    description = db.Column(db.Text())
    price = db.Column(db.Float)
    img = db.Column(db.Text(), default=None)

    business = db.relationship('Business', back_populates='menu')
    order_items = db.relationship('OrderItem', back_populates='menu_item')
    favorite = db.relationship('Favorite', back_populates='menu_item', lazy='dynamic')
    def __repr__(self) -> str:
        return f'<Menu {self.id}>'