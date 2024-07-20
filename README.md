# Takeaway Menu System
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Google Maps](https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=google-maps&logoColor=white)](https://developers.google.com/maps)
[![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

This project is a full-stack takeaway menu system that allows users to view and order food items from a menu, with features similar to Uber Eats. The system consists of a React Vite client, a Flask-Restful server, and a MySQL database. It also integrates with Stripe API for payment processing and Google Maps for location-based services.

### Prerequisites

Before setting up the application, ensure you have the following:

* A Google Maps API key for location-based services
* A Stripe API key for payment processing

### Client Setup

1. Clone the repository to your local machine.
2. Navigate to the client directory and run `npm install` to install the required dependencies.
3. Create a `.env` file in the client directory using the provided [client/example.env](https://github.com/Stevedev7/Takeaway-Menu-System/blob/master/client/example.env) file as a template. Update the variables accordingly:
   - `VITE_API_BASE_URL`: The base URL for the backend API
   - `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe public key
4. Run the client application by executing `npm run dev` in the client directory.
5. Open a web browser and navigate to `http://localhost:3000` to access the client application.

### Server Setup

1. Navigate to the server directory and run `pip install -r requirements.txt` to install the required dependencies.
2. Create a `.env` file in the server directory using the provided [server/example.env](https://github.com/Stevedev7/Takeaway-Menu-System/blob/master/server/example.env) file as a template. Update the variables accordingly:
   - `PORT`: The port number for the server to run
   - `JWT_SECRET`: A secret key for JWT
   - `DATABASE_URI`: The connection string for the database
   - `EMAIL_ADDRESS`: The email for SMTP server for email service
   - `EMAIL_PASSWORD`: The password for the above email
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `GOOGLE_MAPS_API_KEY`: Your Google Maps API key
3. Run the server application by executing `flask run --host=0.0.0.0 --port=4000 --reload` in the server directory.
4. The server will be available at `http://localhost:4000`.

### Database Setup

1. Create a MySQL database and update the `DATABASE_URI` variable in the server `.env` file accordingly.
2. Run the database migration scripts to create the required tables.

### Running the Application

1. Start the server by executing `flask run` in the server directory.
2. Start the client by executing `npm run dev` in the client directory.
3. Open a web browser and navigate to `http://localhost:3000` to access the application.

Note: This application assumes a local MySQL database setup. Please ensure you have a database server running and update the database connection settings in the server `.env` file accordingly.