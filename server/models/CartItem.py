from utils.database import BaseModel, db

class CartItem(BaseModel):
    __tablename__ = "cart_item"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    price = db.Column(db.Float)
    
    cart = db.relationship('Cart', back_populates='cart_items')
    menu_item = db.relationship('Menu')
    def __repr__(self):
        return f'<CartItem {self.id}>'