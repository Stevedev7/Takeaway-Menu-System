/* eslint-disable react/prop-types */
import React from 'react';
import {
	Button, Modal
} from 'react-bootstrap';
import {
	GoogleMap, LoadScript, Marker
} from '@react-google-maps/api';
import img from '../../../../assets/imgs/restaurant-placeholder.jpg';


const RestaurantInfo = ({
	show, onHide, restaurant
}) => {
	const containerStyle = {
		width: '100%',
		height: '400px'
	};

	return (
		<Modal show={show} onHide={onHide} size="lg">
			<Modal.Header closeButton>
				<Modal.Title>{restaurant.name}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="restaurant-details">
					<div className="restaurant-image">
						<img style={{
							width: '100%',
							height: '500px',
							objectFit: 'cover'
						}} src={restaurant.img || img} alt="Restaurant" />
					</div>
					<div className="restaurant-info">
						<p>{restaurant.description}</p>
						<p>Website: <a href={restaurant.website} target="_blank" rel="noopener noreferrer">{restaurant.website}</a></p>
						<p>Phone: {restaurant.phone}</p>
						{(restaurant?.street_number || restaurant?.street || restaurant?.city || restaurant?.country || restaurant?.postcode) && (
							<p>
								Address:{' '}
								{restaurant?.street_number}
								{restaurant?.street && `, ${restaurant?.street}`}
								{restaurant?.city && `, ${restaurant?.city}`}
								{restaurant?.country && `, ${restaurant?.country}`}
								{restaurant?.postcode && `, ${restaurant?.postcode}`}
							</p>
						)}
					</div>
					<div className="restaurant-map">
						{
							restaurant.latitude && restaurant.longitude && <>
								<LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
									<GoogleMap
										mapContainerStyle={containerStyle}
										center={{
											lat: restaurant.latitude,
											lng: restaurant.longitude
										}}
										zoom={15}
									>
										<Marker position={{
											lat: restaurant.latitude,
											lng: restaurant.longitude
										}} />
									</GoogleMap>
								</LoadScript>
								<a target="_blank" href={`http://maps.google.com/?q=${restaurant.latitude},${restaurant.longitude}`} rel="noreferrer">Open in Maps</a>
							</>
						}

					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default RestaurantInfo;

