// Register.jsx
// React imports
import React, { useState } from 'react';

// React Router imports
import {
	Link,
	useNavigate
} from 'react-router-dom';

// React Bootstrap imports
import {
	Container,
	Form,
	Button
} from 'react-bootstrap';

// Material-UI imports
import {
	Switch,
	FormControlLabel
} from '@mui/material';

// Redux imports
import { useRegisterMutation } from '../../../redux/apiSlices/usersApi';

// React Toastify imports
import {
	toast,
	ToastContainer
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// CSS import
import './Register.css';

/**
 * The Register component handles user registration functionality.
 * It uses React Bootstrap for form styling and layout.
 * The component allows users to register as either a customer or a business partner.
 * It performs form validation and displays error messages using react-toastify.
 * Upon successful registration, it navigates the user to the login page.
 */
const Register = () => {
	const [isBusiness, setIsBusiness] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const navigate = useNavigate();
	const [register] = useRegisterMutation();

	/**
   * Event handler for form submission.
   * Performs form validation and user registration.
   * Displays success or error messages using react-toastify.
   * Navigates the user to the login page upon successful registration.
   *
   * @param {Event} e - The form submission event.
   */
	const handleSubmit = async e => {
		e.preventDefault();

		// Validate email format
		if (!isValidEmail(email)) {
			toast.error('Please enter a valid email address');
			return;
		}

		// Validate password length and match
		if (password.length < 6) {
			toast.error('Password must be at least 6 characters long');
			return;
		}
		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		try {
			// Perform registration mutation and handle errors
			const res = await register({
				email,
				password,
				role: isBusiness ? 'BUSINESS' : 'CUSTOMER'
			});
			if (res.error) throw res.error.data.error;
			// Display success message and navigate to the login page
			toast.success('Registration successful. Please login.');

		} catch (err) {
			// Display error message if registration fails
			toast.error(err);
		}
	};

	/**
   * Validates the format of an email address.
   *
   * @param {string} email - The email address to validate.
   * @returns {boolean} - True if the email is valid, false otherwise.
   */
	const isValidEmail = email => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	return (
		<Container fluid className="form-container shadow">
			<h1 className="form-header">Register</h1>
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="email" className="mb-3">
					<Form.Control
						type="email"
						placeholder="Email"
						className="input-group"
						required
						onChange={e => setEmail(e.target.value)}
					/>
				</Form.Group>
				<Form.Group controlId="password" className="mb-3">
					<Form.Control
						type="password"
						placeholder="Password"
						className="input-group"
						required
						onChange={e => setPassword(e.target.value)}
					/>
				</Form.Group>
				<Form.Group controlId="confirmPassword" className="mb-3">
					<Form.Control
						type="password"
						placeholder="Confirm Password"
						className="input-group"
						required
						onChange={e => setConfirmPassword(e.target.value)}
					/>
				</Form.Group>
				<Form.Group controlId="type" className="d-flex align-items-center mb-3">
					<FormControlLabel
						control={<Switch checked={isBusiness} onChange={e => setIsBusiness(e.target.checked)} />}
						label="Become a Partner"
					/>
				</Form.Group>
				<Button type="submit" className="primary-button input-group">
					Register
				</Button>
				<p className="mt-3 text-center">
					Already have an account? <Link to="/login">Sign in</Link>
				</p>
			</Form>
			<ToastContainer position="top-right" autoClose={3000} />
		</Container>
	);
};

export default Register;