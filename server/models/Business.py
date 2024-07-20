from utils.database import BaseModel, db


class Business(BaseModel):
    __tablename__ = "business"

    id = db.Column(db.Integer, db.ForeignKey('account.id', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text())
    phone = db.Column(db.String(11))
    website = db.Column(db.String(100), unique=True)
    street_number = db.Column(db.String(10))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    street = db.Column(db.String(100))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    postcode = db.Column(db.String(10))
    img = db.Column(db.Text(), default=None)
    account = db.relationship('Account', back_populates='business', uselist=False)
    menu = db.relationship('Menu', back_populates='business')
    carts = db.relationship('Cart', back_populates='business', cascade='all, delete-orphan')
    orders = db.relationship('Order', back_populates='business')
    
    def __repr__(self) -> str:
        return f'<Business {self.name}>'