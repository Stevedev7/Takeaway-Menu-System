/**
 * The main entry point of the React application.
 * Sets up the routing using React Router and creates the main router with different routes and their corresponding components.
 * The `Provider` component from Redux is used to wrap the entire application, making the Redux store available to all components.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	createBrowserRouter,
	Outlet,
	RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap/dist/react-bootstrap.js';
import './index.css';
import store from './redux/store';

// Import components
import App from './App.jsx';
import Header from './components/Header';
import {
	LoginForm,
	RegisterForm
} from './components/Forms';
import Profile from './components/Profile';
import Menu from './components/Menu';
import Item from './components/Item';
import Restaurant from './components/Restaurant';
import Carts from './components/Carts';
import Completion from './components/Completion';
import Orders from './components/Orders';
import Favorites from './components/Favorites';

// Create the main router with different routes and their corresponding components
const router = createBrowserRouter([
	{
		path: '/', // Root route
		element: (
			<>
				<Header />
				<Outlet />
			</>
		),
		children: [
			{
				index: true,
				element: <App />
			}, // Default route - Renders the App component
			{
				path: 'login',
				element: <LoginForm />
			}, // Route for user login
			{
				path: 'register',
				element: <RegisterForm />
			}, // Route for user registration
			{
				path: 'profile', // Route for user profile
				children: [
					{
						index: true,
						element: <Profile />
					}, // Default route for profile
					{
						path: 'menu', // Route for restaurant menu
						children: [
							{
								index: true,
								element: <Menu />
							}, // Default route for menu
							{
								path: ':id',
								element: <Item />
							} // Route for a specific menu item
						]
					}
				]
			},
			{
				path: 'restaurants/:id',
				element: <Restaurant />
			}, // Route for a specific restaurant
			{
				path: 'carts',
				element: <Carts />
			}, // Route for user carts
			{
				path: 'completion',
				element: <Completion />
			}, // Route for order completion
			{
				path: 'orders',
				element: <Orders />
			}, // Route for user orders
			{
				path: 'favorites',
				element: <Favorites />
			} // Route for user favorites
		]
	}
]);

// Render the application with the Redux store and the router
ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>
);