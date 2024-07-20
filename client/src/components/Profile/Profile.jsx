import React, {
	useEffect, useState
} from 'react';
import {
	Container
} from 'react-bootstrap';
import {
	useSelector
} from 'react-redux';
import {
	CustomerProfileForm, BusinessProfileForm
} from '../Forms';
import {
	useLazyBusinessProfileQuery,
	useLazyCustomerProfileQuery,
	useVerifyQuery
} from '../../redux/apiSlices/usersApi';
import {
	useNavigate
} from 'react-router-dom';
import {
	Dialog, DialogTitle
} from '@mui/material';
import AdvancedOptions from './components/AdvancedOptions';
import CustomerProfile from './components/CustomerProfile';
import BusinessProfile from './components/BusinessProfile';
import './Profile.css';

/**
 * Profile component displays the user's profile information based on their role.
 * It fetches the profile data using the appropriate API query based on the user's role.
 * If the profile data is not available, it shows a form to create the profile.
 */
const Profile = () => {
	const {
		token, user
	} = useSelector(state => state.auth);
	const [show, setShow] = useState(false);
	const [getBusiness] = useLazyBusinessProfileQuery();
	const [getCustomer] = useLazyCustomerProfileQuery();
	const [profile, setProfile] = useState(null);
	const {
		isLoading, isError, data
	} = useVerifyQuery({
		token
	});
	const navigate = useNavigate();

	/**
	 * Handles the close event of the dialog.
	 * @param {Event} e - The event object.
	 */
	const handleClose = e => {
		e.preventDefault();
		setShow(false);
	};

	/**
	 * Fetches the profile data based on the user's role.
	 * If the profile data is not available, it shows the profile creation form.
	 */
	useEffect(() => {
		if (isError || user === null || data === null) {
			navigate('/login');
			return;
		}

		const fetchProfile = async () => {
			try {
				const getProfile = user.role === 'CUSTOMER' ? getCustomer : getBusiness;
				const res = await getProfile({
					id: user.id
				});
				if (res.error) {
					if (res.error.status === 404) {
						setShow(true);
						return;
					}
					throw new Error(res.error);
				}
				if (res.data) {
					setProfile(res.data);
				}
			} catch (e) {
				console.log(JSON.stringify(e));
			}
		};

		fetchProfile();
	}, [token, isError, isLoading, data, profile]);

	return (
		<Container className="profile-container">
			{profile && user && user.role === 'CUSTOMER' && (
				<CustomerProfile profile={profile} setShow={setShow} />
			)}
			{profile && user && user.role === 'BUSINESS' && (
				<BusinessProfile profile={profile} setShow={setShow} />
			)}
			<Dialog open={show} onClose={handleClose}>
				<DialogTitle>
					{user && user.role === 'CUSTOMER' ? (
						<CustomerProfileForm />
					) : user && user.role === 'BUSINESS' ? (
						<BusinessProfileForm />
					) : (
						navigate('/')
					)}
				</DialogTitle>
			</Dialog>
			<AdvancedOptions />
		</Container>
	);
};

export default Profile;