import React, {
	useEffect, useState
} from 'react';
import {
	Button, Form, Row
} from 'react-bootstrap';
import './CustomerProfileForm.css';
import { useSelector } from 'react-redux';
import {
	useCreateCustomerMutation, useUpdateCustomerMutation
} from '../../../redux/apiSlices/customerApi';
import { useCustomerProfileQuery } from '../../../redux/apiSlices/usersApi';
import { useNavigate } from 'react-router-dom';


const CustomerProfileForm = () => {
	const {
		token, user
	} = useSelector(state => state.auth);
	const {
		isError: profileError, isLoading: profileLoading, data: profileData
	} = useCustomerProfileQuery({
		id: user.id
	});

	const [firstName, setFirstName] = useState(user.firstName || '');
	const [lastName, setLastName] = useState(user.lastName || '');
	const [phone, setPhone] = useState('');
	const [isUpdate, setIsUpdate] = useState(false);
	const [phoneError, setPhoneError] = useState('');

	const [createCustomer] = useCreateCustomerMutation();
	const [updateCustomer] = useUpdateCustomerMutation();

	const navigate = useNavigate();

	const handleSubmit = e => {
		e.preventDefault();

		// Validate phone number
		const phoneRegex = /^\d{10,11}$/;
		if (!phoneRegex.test(phone)) {
			setPhoneError('Please enter a valid phone number (10 digits)');
			return;
		}

		if (isUpdate) {
			updateCustomer({
				id: user.id,
				firstName,
				lastName,
				phone,
				token
			})
				.then(res => window.location.reload(false))
				.catch(e => alert(`Error: ${JSON.stringify(e)}`));
			return;
		}

		createCustomer({
			id: user.id,
			firstName,
			lastName,
			phone,
			token
		})
			.then(res => window.location.reload(false))
			.catch(e => alert(`Error: ${JSON.stringify(e)}`));
	};

	useEffect(() => {
		if (profileError) console.error;

		// Set profile
		if (profileData) {
			setFirstName(profileData.first_name);
			setLastName(profileData.last_name);
			setIsUpdate(true);
			setPhone(profileData.phone);
		}
	}, [profileError, profileLoading, profileData]);

	const handlePhoneChange = e => {
		const value = e.target.value;
		const numericValue = value.replace(/\D/g, '');
		if (value.length === 11) {
			return;
		}
		setPhone(numericValue);
		setPhoneError('');
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Row>
				<div className="flex d-flex justify-content-between align-items-center">
					<h1 className="m-3 form-header">Account</h1>
					<Button type="submit" className="primary-button input-group submit-button mb-3">
						{isUpdate ? 'Update' : 'Submit'}
					</Button>
				</div>
			</Row>
			<Row>
				<Form.Group>
					<Form.Control
						type="text"
						className="input-group"
						placeholder="First Name"
						onChange={e => setFirstName(e.target.value)}
						value={firstName}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Control
						type="text"
						className="input-group"
						placeholder="Last Name"
						onChange={e => setLastName(e.target.value)}
						value={lastName}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Control
						type="text"
						className="input-group"
						placeholder="Phone number"
						onChange={handlePhoneChange}
						value={phone}
					/>
					{phoneError && <Form.Text className="text-danger">{phoneError}</Form.Text>}
				</Form.Group>
			</Row>
		</Form>
	);
};

export default CustomerProfileForm;