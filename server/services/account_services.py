from models  import Account
from utils.database import db
def get_account_by_email(email):
    account = Account.query.filter_by(email=email).first()
    if account is None:
        raise ValueError("Account not found.")
    return account

def get_account_by_id(id):
    account = Account.query.get(int(id))
    if account is None:
        raise ValueError("Account not found.")
    return account

def delete_account_by_id(id):
    try:
        account = get_account_by_id(id)
        db.session.delete(account)
        db.session.commit()
        return account
    except Exception as e:
        print(e)
        return None