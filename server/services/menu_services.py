from models import Menu
from utils.Exceptions import NotFound
from utils.database import db
def add_item(id, menu_item):
	pass

def get_item_by_id(id):

	item = Menu.query.get(id)
	if item is None:
		raise NotFound(message="Item not found.")
	return item

def delete_item_by_id(id):
    try:
        item = get_item_by_id(id)
        db.session.delete(item)
        db.session.commit()
        return item
    except Exception as e:
        print(e)
        return None