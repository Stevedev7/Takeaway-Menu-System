import React from 'react';

import {
	Card, CardContent, Typography, CardMedia
} from '@mui/material';
import './ItemCard.css';
import img from '../../../../assets/imgs/item-placeholder.webp';
import { useNavigate } from 'react-router-dom';


const ItemCard = ({
	title, description, price, imageUrl, id
}) => {
	const navigate = useNavigate();

	const limitedDescription = description.length > 50 ? description.substring(0, 50) + '...' : description;
	const handleOnclick = e => {
		e.preventDefault();
		navigate(`/profile/menu/${id}`);
	};

	return (
		<Card className="card" onClick={handleOnclick}>
			<CardMedia className="media" image={imageUrl || img} title={title} />
			<CardContent>
				<Typography variant="h5" component="h2">
					{title}
				</Typography>
				<Typography variant="body2" component="p">
					{limitedDescription}
				</Typography>
				<Typography variant="h6" component="p">
					Price: £{price}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default ItemCard;