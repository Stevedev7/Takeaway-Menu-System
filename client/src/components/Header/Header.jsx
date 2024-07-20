/**
 * The `Header` component represents the navigation bar of the application.
 * Uses React Bootstrap's `Navbar` component and Redux to manage the authentication state.
 * Conditionally renders sign-in/sign-up links or a logout link based on the authentication status.
 * Conditionally renders different navigation links based on the user's role (BUSINESS or CUSTOMER).
 */

import React from 'react';
import {
	Navbar, Nav, Container
} from 'react-bootstrap';
import {
	Link, useNavigate
} from 'react-router-dom';
import { useVerify } from '../../hooks/verify';
import {
	useDispatch, useSelector
} from 'react-redux';
import { clearUserInfo } from '../../redux/slices/authSlice';
import './Header.css';


const Header = () => {
	const {
		token, user
	} = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isAuthenticated = useVerify(token);

	// Handle user logout
	const onLogout = () => {
		dispatch(clearUserInfo());
		navigate('/');
	};

	// Conditionally render authentication links based on the authentication status
	const AuthLinks = () => {
		if (!isAuthenticated) {
			return (
				<>
					<Link className="nav-link" to="/login">
						Sign in
					</Link>
					<Link className="nav-link" to="/register">
						Sign Up
					</Link>
				</>
			);
		}
		return (
			<Link className="nav-link" onClick={onLogout}>
				Log out
			</Link>
		);
	};

	// Conditionally render navigation links based on user role
	const renderNavLinks = () => {
		if (user && user.role === 'BUSINESS') {
			return (
				<>
					<Nav.Link href="/profile">Profile</Nav.Link>
					<Nav.Link href="/profile/menu">Menu</Nav.Link>
					<Nav.Link href="/orders">Orders</Nav.Link>
				</>
			);
		} else if (user && user.role === 'CUSTOMER') {
			return (
				<>
					<Nav.Link href="/profile">Profile</Nav.Link>
					<Nav.Link href="/favorites">Favorites</Nav.Link>
				</>
			);
		}
		return null;
	};

	return (
		<Navbar style={{
			zIndex: 1
		}} bg="light" variant="light" expand="lg">
			<Container>
				<Link className="navbar-brand" to="/">
					TMS
				</Link>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">{renderNavLinks()}</Nav>
					<Nav>{AuthLinks()}</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;