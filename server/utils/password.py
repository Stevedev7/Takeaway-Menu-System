from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def hash_password(password):
    return bcrypt.generate_password_hash(password=(f'{password}' * 10), rounds=10)

def compare_password(password_hash, password):
    return bcrypt.check_password_hash(pw_hash=password_hash, password=(f'{password}' * 10))