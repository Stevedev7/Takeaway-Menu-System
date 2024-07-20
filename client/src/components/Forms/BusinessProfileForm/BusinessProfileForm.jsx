import React, {
	useEffect, useState
} from 'react';
import {
	Button, Form, Row
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
	useCreateBusinessMutation, useUpdateBusinessMutation
} from '../../../redux/apiSlices/businessApi';
import { useBusinessProfileQuery } from '../../../redux/apiSlices/usersApi';


const BusinessProfileForm = () => {
	const {
		token, user
	} = useSelector(state => state.auth);
	const {
		isError: profileError, isLoading: profileLoading, data: profileData
	} = useBusinessProfileQuery({
		id: user.id
	});

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [website, setWebsite] = useState('');
	const [img, setImg] = useState(null);
	const [phone, setPhone] = useState('');
	const [isUpdate, setIsUpdate] = useState(false);
	const [websiteError, setWebsiteError] = useState('');
	const [phoneError, setPhoneError] = useState('');

	const [createBusiness] = useCreateBusinessMutation();
	const [updateBusiness] = useUpdateBusinessMutation();

	const handleSubmit = e => {
		e.preventDefault();

		// Validate website URL
		const websiteRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
		if (!websiteRegex.test(website)) {
			setWebsiteError('Please enter a valid website URL');
			return;
		}

		// Validate phone number
		if (phone.length === 0) {
			setPhoneError('Please enter a phone number');
			return;
		}

		if (phone.length > 11 || phone.length < 10) {
			setPhoneError('Please enter a valid phone number (10 digits)');
			return;
		}

		if (isUpdate) {
			updateBusiness({
				id: user.id,
				body: {
					description,
					website,
					name,
					phone,
					img
				},
				token
			})
				.then(res => window.location.reload(false))
				.catch(e => console.log(`Error: ${JSON.stringify(e)}`));
			return;
		}

		createBusiness({
			id: user.id,
			description,
			website,
			name,
			phone,
			img,
			token
		})
			.then(res => window.location.reload(false))
			.catch(e => console.log(`Error: ${JSON.stringify(e)}`));
	};

	useEffect(() => {
		if (profileError) return;

		// Set profile
		if (profileData) {
			setName(profileData.name);
			setDescription(profileData.description);
			setWebsite(profileData.website);
			setPhone(profileData.phone || '');
			setImg(profileData.img);
			setIsUpdate(true);
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
					<h1 className="m-3 form-header">Business Account</h1>
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
						placeholder="Business Name"
						onChange={e => setName(e.target.value)}
						value={name}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Control
						type="text"
						className="input-group"
						placeholder="Website"
						onChange={e => {
							setWebsite(e.target.value);
							setWebsiteError('');
						}}
						value={website}
					/>
					{websiteError && <Form.Text className="text-danger">{websiteError}</Form.Text>}
				</Form.Group>
				<Form.Group>
					<Form.Control
						required={true}
						type="text"
						className="input-group"
						placeholder="Banner Image"
						onChange={e => {
							setImg(e.target.value);
						}}
						value={img}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Control
						type="text"
						className="input-group"
						placeholder="Description"
						onChange={e => setDescription(e.target.value)}
						value={description}
						as="textarea"
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

export default BusinessProfileForm;