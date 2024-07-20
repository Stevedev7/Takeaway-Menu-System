/* eslint-disable react/prop-types */
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import {
	Row,
	Col,
	Card
} from 'react-bootstrap';
import { IconButton } from '@mui/material';
import profileImage from '../../../../assets/imgs/profile.png';
import favoritesImage from '../../../../assets/imgs/favorites.jpg';
import pointsImage from '../../../../assets/imgs/points.jpg';
import ordersImage from '../../../../assets/imgs/orders.jpg';
import { useNavigate } from 'react-router-dom';


const CustomerProfile = ({
	profile, setShow
}) => {

	const navigate = useNavigate();

	return (
		<>
			<h1 className="text-center">Profile</h1>
			<Row>
				<Col md={12} className="d-flex flex-row justify-content-center align-items-center">
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
			</Row>
			<Row className="mt-4">
				<Col md={4}>
					<Card onClick={() => navigate('/orders')} >
						<Card.Body className="text-center profile-card">
							<img
								src={ordersImage}
								alt="Your Orders"
								className="rounded-circle mb-3"
								width="50"
								height="50"
							/>
							<h5>Your Orders</h5>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card onClick={() => navigate('/favorites')}>
						<Card.Body className="text-center profile-card">
							<img
								src={favoritesImage}
								alt="Favourites"
								className="rounded-circle mb-3"
								width="50"
								height="50"
							/>
							<h5>Favourites</h5>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card>
						<Card.Body className="text-center profile-card">
							<img
								src={pointsImage}
								alt="My Points"
								className="rounded-circle mb-3"
								width="50"
								height="50"
							/>
							<h5>My Points</h5>
							<p>{profile.points || 0}</p>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default CustomerProfile;