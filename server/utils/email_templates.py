def generate_accepted(order_id, date, customer_name, business_name):
	return f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Accepted</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }}
        h1 {{
            color: #333333;
        }}
        p {{
            color: #666666;
            line-height: 1.5;
        }}
        .accepted {{
            color: #008000;
            font-weight: bold;
        }}
        .order-details {{
            margin-top: 20px;
        }}
        .order-details table {{
            width: 100%;
            border-collapse: collapse;
        }}
        .order-details th, .order-details td {{
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #dddddd;
        }}
        .order-details th {{
            background-color: #f5f5f5;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Order Accepted</h1>
        <p>Dear {customer_name},</p>
        <p>Thank you for placing an order with {business_name}. We are pleased to inform you that your order has been accepted and is being prepared.</p>
        <p>Details of your order:</p>
        <ul>
            <li><strong>Order ID:</strong> {order_id}</li>
            <li><strong>Order Date:</strong> {date}</li>
        </ul>
        <p class="accepted">Your order is currently being prepared by our kitchen staff. We will notify you once the order is ready for pickup.</p>
        <p>If you need to make any changes to your order or have any questions, please contact our restaurant staff.</p>
        <p>Thank you for choosing {business_name}. We appreciate your business and look forward to serving you!</p>
        <p>Best regards,<br>TMS</p>
    </div>
</body>
</html>
'''





def generate_cancelled(order_id, date, customer_name):
    return f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Cancelled</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }}
        h1 {{
            color: #333333;
        }}
        p {{
            color: #666666;
            line-height: 1.5;
        }}
        .cancelled {{
            color: #ff0000;
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Order Cancelled</h1>
        <p>Dear {customer_name},</p>
        <p>We regret to inform you that your order with ID {order_id} has been cancelled.</p>
        <p>Details of the cancelled order:</p>
        <ul>
            <li><strong>Order ID:</strong> {order_id}</li>
            <li><strong>Order Date:</strong> {date}</li>
        </ul>
        <p class="cancelled">Please note that any payment made for this order will be refunded to your original payment method within the next few business days.</p>
        <p>If you have any questions or concerns regarding the cancellation, please don't hesitate to contact our customer support.</p>
        <p>We apologize for any inconvenience caused.</p>
        <p>Best regards,<br>TMS</p>
    </div>
</body>
</html>'''



def generate_order_placed_email(email_metadata):
    items_html = ""
    for item in email_metadata["items"]:
        items_html += f"""
            <tr>
                <td>{item['name']}</td>
                <td>{item['quantity']}</td>
                <td>£{item['price']:.2f}</td>
                <td>£{item['quantity'] * item['price']:.2f}</td>
            </tr>
        """

    points_used = email_metadata.get("points", 0)
    points_html = f"<p>Points Used: {points_used}</p>" if points_used > 0 else ""

    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Placed</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }}
            h1 {{
                color: #333333;
            }}
            p {{
                color: #666666;
                line-height: 1.5;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }}
            th, td {{
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid #dddddd;
            }}
            th {{
                background-color: #f2f2f2;
            }}
            .total {{
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Order Placed</h1>
            <p>Dear Customer,</p>
            <p>Thank you for placing an order with {email_metadata['business_name']}. Your order has been successfully placed.</p>
            <p>Order ID: {email_metadata['order_id']}</p>
            {points_html}
            <h2>Order Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {items_html}
                    <tr>
                        <td colspan="3" class="total">Total:</td>
                        <td class="total">£{email_metadata['total']:.2f}</td>
                    </tr>
                </tbody>
            </table>
            <p>We will process your order and keep you updated on its status.</p>
            <p>If you have any questions or need further assistance, please feel free to contact us.</p>
            <p>Thank you for your business!</p>
            <p>Best regards,<br>{email_metadata['business_name']}</p>
        </div>
    </body>
    </html>
    """
    return html


def generate_order_ready_email(order_id, date, customer_name, business_name):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Ready for Pickup</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }}
        h1 {{
            color: #333333;
        }}
        p {{
            color: #666666;
            line-height: 1.5;
        }}
        .ready {{
            color: #008000;
            font-weight: bold;
        }}
        .order-details {{
            margin-top: 20px;
        }}
        .order-details table {{
            width: 100%;
            border-collapse: collapse;
        }}
        .order-details th, .order-details td {{
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #dddddd;
        }}
        .order-details th {{
            background-color: #f5f5f5;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Order Ready for Pickup</h1>
        <p>Dear {customer_name},</p>
        <p>Great news! Your order from {business_name} is now ready for pickup.</p>
        <p>Details of your order:</p>
        <ul>
            <li><strong>Order ID:</strong> {order_id}</li>
            <li><strong>Order Date:</strong> {date}</li>
        </ul>
        <p class="ready">Please come to {business_name} to pick up your order. Our staff will have your order ready for you at the pickup counter.</p>
        <p>If you have any questions or need assistance, please don't hesitate to contact our restaurant staff.</p>
        <p>Thank you for choosing TMS. We hope you enjoy your meal!</p>
        <p>Best regards,<br>TMS</p>
    </div>
</body>
</html>'''

def generate_complete(order_id, date, customer_name, business_name):
     return f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Collected</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }}
        h1 {{
            color: #333333;
        }}
        p {{
            color: #666666;
            line-height: 1.5;
        }}
        .collected {{
            color: #008000;
            font-weight: bold;
        }}
        .order-details {{
            margin-top: 20px;
        }}
        .order-details table {{
            width: 100%;
            border-collapse: collapse;
        }}
        .order-details th, .order-details td {{
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #dddddd;
        }}
        .order-details th {{
            background-color: #f5f5f5;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Order Collected</h1>
        <p>Dear {customer_name},</p>
        <p>Thank you for collecting your order from {business_name}. We appreciate your business and hope you enjoy your meal!</p>
        <p>Details of your collected order:</p>
        <ul>
            <li><strong>Order ID:</strong> {order_id}</li>
            <li><strong>Order Date:</strong> {date}</li>
        </ul>
        <p class="collected">We hope you had a pleasant experience with {business_name}. If you have any feedback or suggestions, please don't hesitate to let us know.</p>
        <p>We look forward to serving you again soon!</p>
        <p>Best regards,<br>TMS</p>
    </div>
</body>
</html>
'''