import React, { useState } from 'react';
import {
	Grid, Container, Modal, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ItemCard from './ItemCard/ItemCard';
import { useGetMenuQuery } from '../../../redux/apiSlices/menuApi';
import { useNavigate } from 'react-router-dom';
import ItemModal from './ItemModal';


const Items = ({ id }) => {
	const [isModalShow, setIsModalShow] = useState(false);

	const handleOpenModal = () => {
		setIsModalShow(true);
	};


	const {
		isLoading, data, isError
	} = useGetMenuQuery(id);
	const navigate = useNavigate();

	if (isError) {
		navigate('/profile');
	}

	if (isLoading) {
		return <>Loading...</>;
	}

	return (
		<Container>
			<IconButton onClick={handleOpenModal}>
				<AddIcon color="action" />
			</IconButton>
			<Grid container spacing={3}>
				{data.menu.map(item => (
					<Grid item xs={12} sm={6} md={4} key={item.id}>
						<ItemCard imageUrl={item.img} title={item.item_name} description={item.description} price={item.price} id={item.id} key={item.id} />
					</Grid>
				))}
			</Grid>
			<ItemModal show={isModalShow} setShow={setIsModalShow} />
		</Container>
	);
};

export default Items;