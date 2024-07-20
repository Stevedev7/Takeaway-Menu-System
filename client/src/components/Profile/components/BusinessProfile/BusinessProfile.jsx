/* eslint-disable react/prop-types */
import React, {
	useEffect, useState
} from 'react';
import EditIcon from '@mui/icons-material/Edit';
import PlaceIcon from '@mui/icons-material/Place';
import {
	Row, Col, Card
} from 'react-bootstrap';
import {
	GoogleMap, LoadScript, Marker
} from '@react-google-maps/api';
import {
	IconButton, Modal, Box, Typography, TextField
} from '@mui/material';
import {
	useUpdateBusinessMutation
} from '../../../../redux/apiSlices/businessApi';
import {
	useSelector
} from 'react-redux';
import profileImage from '../../../../assets/imgs/profile.png';
import locationImage from '../../../../assets/imgs/location.jpg';
import menuImage from '../../../../assets/imgs/menu.jpg';
import ordersImage from '../../../../assets/imgs/orders.jpg';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
	Loader
} from '@googlemaps/js-api-loader';
import {
	useNavigate
} from 'react-router-dom';
import './BusinessProfile.css';


const BusinessProfile = ({
	profile, setShow
}) => {
	const navigate = useNavigate();
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [postcode, setPostcode] = useState('');
	const [addresses, setAddresses] = useState([]);
	const [mapLoaded, setMapLoaded] = useState(false);
	const {
		token, user
	} = useSelector(state => state.auth);

	const [updateBusiness] = useUpdateBusinessMutation();

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setPostcode('');
		setAddresses([]);
		setIsModalOpen(false);
	};

	const handleAddressClick = async address => {
		await updateLocation(address);
		handleCloseModal();
	};

	const handlePostcodeChange = async e => {
		e.preventDefault();
		setPostcode(e.target.value);
		setAddresses([]);
		searchLocationByPostcode(e.target.value);
	};

	const searchLocationByPostcode = postcode => {
		let loader = new Loader({
			apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
			version: 'weekly',
			libraries: ['places']
		});

		loader.load().then(() => {
			// eslint-disable-next-line no-undef
			const geocoder = new google.maps.Geocoder();

			geocoder.geocode({
				address: postcode
			}, (results, status) => {
				if (status === 'OK') {
					setAddresses(extractAddresses(results));
				} else {
					console.log('Geocoder failed due to:', status);
				}
			});
		}).catch(e => console.log(e));
	};

	const extractAddresses = data => {
		return data.map(({
			address_components, geometry
		}) => {
			return address_components.reduce((addressComponents, component) => {
				component.types.forEach(type => {
					switch (type) {
						case 'street_number':
							addressComponents.streetNumber = component.long_name;
							break;
						case 'route':
							addressComponents.street = component.long_name;
							break;
						case 'postal_town':
							addressComponents.city = component.long_name;
							break;
						case 'postal_code':
							addressComponents.postcode = component.long_name;
							break;
						case 'country':
							addressComponents.country = component.long_name;
							break;
					}
				});
				return {
					...addressComponents,
					latitude: geometry.location.lat(),
					longitude: geometry.location.lng()
				};
			}, {});
		});
	};

	useEffect(() => {
		if (profile?.latitude && profile?.longitude) {
			setLatitude(profile.latitude);
			setLongitude(profile.longitude);
		}
	}, [profile]);

	useEffect(() => {
		if (latitude && longitude) {
			setMapLoaded(false);
			setTimeout(() => {
				setMapLoaded(true);
			}, 500);
		}
	}, [latitude, longitude]);

	const containerStyle = {
		width: '100%',
		height: '400px'
	};

	const updateLocation = async address => {
		try {
			const res = await updateBusiness({
				id: user.id,
				token: token,
				body: address
			});
			console.log(res);
			setLatitude(address.latitude);
			setLongitude(address.longitude);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<h1 className="text-center">Profile</h1>
			<Row>
				<Col className="d-flex flex-row justify-content-center align-items-center">
					<Card className="profile">
						<Card.Title>
							<IconButton
								style={{
									float: 'right',
									margin: '10px',
									border: '1px solid gray'
								}}
								onClick={() => setShow(true)}
							>
								<EditIcon />
							</IconButton>
						</Card.Title>
						<Card.Body>
							<div className="text-center">
								<img
									src={profileImage}
									alt="Profile"
									className="rounded-circle mb-3"
									width="250"
									height="250"
								/>
								<h4>{profile?.name || profile?.first_name + ' ' + profile?.last_name}</h4>
								<p>{profile?.email}</p>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card
						style={{
							width: '100%'
						}}
					>
						{latitude && longitude && (
							<Card.Title onClick={handleOpenModal} >
								Click to update
							</Card.Title>
						)}
						<Card.Body className="map-card-body">
							{latitude && longitude && mapLoaded && (
								<div className="map-container">
									<LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
										<GoogleMap
											mapContainerStyle={containerStyle}
											center={{
												lat: latitude,
												lng: longitude
											}}
											zoom={20}
										>
											{latitude && longitude && (
												<Marker
													position={{
														lat: latitude,
														lng: longitude
													}}
													draggable={false}
													icon={LocationOnIcon}
												/>
											)}
										</GoogleMap>
									</LoadScript>
								</div>
							)}
							{(!latitude || !longitude) && (
								<>
									<div onClick={handleOpenModal} style={{
										height: '100%'
									}} className="text-center">
										<img
											src={locationImage}
											alt="Add-Location"
											className="rounded-circle mb-3"
											width="250"
											height="250"
										/>
										<h5>Add location</h5>
									</div>
								</>
							)}
							<Modal
								open={isModalOpen}
								onClose={handleCloseModal}
							>
								<Box
									sx={{
										position: 'absolute',
										top: '50%',
										left: '50%',
										transform: 'translate(-50%, -50%)',
										bgcolor: 'background.paper',
										boxShadow: 24,
										p: 4,
										height: '50vh'
									}}
									className="location-search-modal"
								>
									<Typography id="modal-title" variant="h6" component="h2">
										Search Location by Postcode
									</Typography>
									<TextField
										label="Postcode"
										value={postcode}
										onChange={handlePostcodeChange}
										variant="outlined"
										margin="normal"
										className="postcode-search"
									/>
									{addresses.length > 0 &&
										addresses.map(item => (
											item?.postcode && (
												<div key={item.latitude}>
													<div className="address-list" onClick={() => handleAddressClick(item)}>
														<IconButton>
															<PlaceIcon />
														</IconButton>
														{item?.streetNumber && `${item.streetNumber}, `}
														{item?.postcode && `${item.postcode}, `}
														{item.street && `${item.street}, `}
														{item?.city && `${item.city}, `}
														{item?.country}
													</div>
													<hr />
												</div>
											)
										))}
								</Box>
							</Modal>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<Row className="mt-4">
				<Col md={6}>
					<Card onClick={() => navigate('/orders')}>
						<Card.Body className="text-center profile-card">
							<img
								src={ordersImage}
								alt="Order"
								className="rounded-circle mb-3"
								width="50"
								height="50"
							/>
							<h5>Orders</h5>
						</Card.Body>
					</Card>
				</Col>
				<Col md={6}>
					<Card onClick={() => navigate('/profile/menu')}>
						<Card.Body className="text-center profile-card">
							<img
								src={menuImage}
								alt="Favourites"
								className="rounded-circle mb-3"
								width="50"
								height="50"
							/>
							<h5>Menu</h5>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default BusinessProfile;