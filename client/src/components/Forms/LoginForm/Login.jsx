// Login.jsx
// React imports
import React, {
	useEffect,
	useState
} from 'react';

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

// Redux imports
import {
	useDispatch,
	useSelector
} from 'react-redux';
import {
	setUserInfo
} from '../../../redux/slices/authSlice';
import {
	useLoginMutation,
	useLazyBusinessProfileQuery,
	useLazyCustomerProfileQuery
} from '../../../redux/apiSlices/usersApi';

// Custom hook import
import {
	useVerify
} from '../../../hooks/verify';

// React Toastify imports
import {
	toast,
	ToastContainer
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// CSS import
import './Login.css';


const Login = () => {
	// State variables for form inputs and authentication status
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [login] = useLoginMutation();
	const [getCustomerProfile] = useLazyCustomerProfileQuery();
	const [getBusinessProfile] = useLazyBusinessProfileQuery();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		token, user
	} = useSelector(state => state.auth);
	let isAuthenticated = useVerify(token);

	// Event handler for form submission
	const handleSubmit = e => {
		e.preventDefault();
		let payload = {
			token,
			userInfo: user
		};

		// Post request to login
		login({
			email,
			password
		})
			.then(res => res)
			.then(res => {
				if (res.error) throw res.error.data.error;
				// If no error proceed
				return res.data;
			})
			.then(({
				token, id, role
			}) => {
				payload.token = token;
				payload.userInfo = {
					id,
					role
				};
				return {
					id,
					role
				};
			})
			.then(({
				role, id
			}) => {
				if (role === 'CUSTOMER') {
					getCustomerProfile({
						id
					})
						.then(res => {
							if (res.error) throw res.error;
							return res.data;
						})
						.then(data => {
							payload.userInfo = {
								...payload.userInfo,
								firstName: data.first_name,
								lastName: data.last_name
							};
							navigate('/');
						})
						.catch(err => {
							// Redirect to Customer profile creation page
							if (err.status === 404) {
								navigate('/profile');
								return;
							}
							toast.error(err.data.error);
						});
				}
				if (role === 'BUSINESS') {
					getBusinessProfile({
						id
					})
						.then(res => {
							if (res.error) throw res.error;
							return;
						})
						.then(() => navigate('/profile'))
						.catch(err => {
							if (err.status === 404) {
								navigate('/profile');
								return;
							}
							toast.error(err.data.error);
						});
				}
				dispatch(setUserInfo(payload));
			})
			.catch(err => toast.error(err));
	};

	// useEffect hook to navigate based on authentication status
	useEffect(() => {
		if (isAuthenticated) {
			if (user?.role === 'BUSINESS') {
				navigate('/profile');
			}
			if (user?.role === 'CUSTOMER') {
				navigate('/');
			}
		}
	}, [token, isAuthenticated]);

	// Render the login form
	return (
		<Container className="form-container shadow" fluid>
			<h1 className="form-header">Login</h1>
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="email" className="mb-3">
					<Form.Control
						type="email"
						placeholder="Email"
						className="input-group"
						onChange={e => setEmail(e.target.value)}
					/>
				</Form.Group>
				<Form.Group controlId="password">
					<Form.Control
						type="password"
						placeholder="Password"
						className="input-group"
						onChange={e => setPassword(e.target.value)}
					/>
				</Form.Group>
				<Button type="submit" className="primary-button input-group">
					LOGIN
				</Button>
				<p className="text-center mt-2">
					New user? <Link to="/register">Sign up</Link>
				</p>
			</Form>
			<ToastContainer position="top-right" autoClose={3000} />
		</Container>
	);
};

export default Login;