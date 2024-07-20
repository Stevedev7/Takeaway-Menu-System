# from utils.email import send_email

# send_email()

order = {
  "id": 74,
  "customer_id": 185,
  "business_id": 1,
  "points": 0,
  "total_amount": 70,
  "status": "PENDING",
  "created_at": "2024-05-05T18:38:09",
  "updated_at": None,
  "order_items": [
    {
      "id": 58,
      "order_id": 74,
      "menu_item_id": 1,
      "quantity": 7,
      "price": 70,
      "created_at": "2024-05-05T18:38:09",
      "updated_at": None,
      "menu_item": {
        "id": 1,
        "business_id": 1,
        "item_name": "Bangude Tava fry",
        "description": "Shallow fried Mackerels marinated in indian spices",
        "price": 10
      }
    }
  ],
  "client_secret": "pi_3PD90JP4Z6YNbbCS1ouobtkP_secret_ycWLzPoVjVBJrJAffH0zn3rvO",
  "business": {
    "id": 1,
    "name": "Biryani 9"
  },
  "customer": {
    "id": 185,
    "first_name": "Yashas",
    "last_name": "bedre",
    "account": {
      "email": "yashas@gmail.com"
    }
  }
}

email_metadata = {
	"order_id": order["id"],
	"business_name": order["business"]["name"],
	"items": [],
	"total": order["total_amount"]
}

for oi in order["order_items"]:
	i = {
		"name": oi["menu_item"]["item_name"],
		"quantity": oi["quantity"],
		"price": oi["menu_item"]["price"]
	}
	email_metadata["items"].append(i)

print("Email Metadata")
print(email_metadata)