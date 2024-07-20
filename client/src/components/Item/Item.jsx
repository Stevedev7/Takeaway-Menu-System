import React, { useState } from 'react';
import {
	useParams, useNavigate
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
	Container, Typography, Button, Grid, IconButton, CardMedia
} from '@mui/material';
import './Item.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	useGetItemQuery, useDeleteItemMutation
} from '../../redux/apiSlices/menuApi';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import img from '../../assets/imgs/item-placeholder.webp';
import ItemForm from '../Forms/ItemForm';


const Item = () => {
	const { id } = useParams();
	const {
		token, user
	} = useSelector(state => state.auth);
	const [show, setShow] = useState(false);
	const navigate = useNavigate();
	const [showDelete, setShowDelete] = useState(false);
	const [deleteItem] = useDeleteItemMutation();
	const {
		data: item, isLoading
	} = useGetItemQuery({
		menuId: user.id,
		itemId: id
	});

	const handleClose = e => {
		e.preventDefault();
		setShow(false);
	};

	const handleCloseDelete = e => {
		e.preventDefault();
		setShowDelete(false);
	};

	const handleEdit = () => {
		setShow(true);
	};
	const handleDelete = () => {
		setShowDelete(true);
	};

	const onDelete = e => {
		e.preventDefault();
		deleteItem({
			token,
			itemId: item.id,
			menuId: user.id
		}).then(res => {
			if (res.error) throw new Error(res.error);
			navigate('/profile/menu');
		}).catch(e => alert(JSON.stringify(e)));
	};

	if (isLoading) return <div>loading...</div>;
	return (


		<Container>
			<CardMedia
				component="img"
				height="300"
				image={item.img || img}
				alt={item.title}
			/>
			<Typography variant="h4" gutterBottom>
				{item.item_name}
			</Typography>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant="body1">
						Description: {item.description}
					</Typography>
					<Typography variant="body1">
						Price: £{item.price}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<IconButton onClick={handleEdit}>
						<EditIcon color="primary" />
					</IconButton>
					<IconButton onClick={handleDelete}>
						<DeleteIcon color="error" />
					</IconButton>
				</Grid>
			</Grid>

			<Dialog open={show} onClose={handleClose}>
				<DialogTitle id="alert-dialog-title">
					{'Edit Item'}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						<ItemForm item={item} />
					</DialogContentText>
				</DialogContent>
				<DialogActions>
				</DialogActions>
			</Dialog>

			<Dialog open={showDelete} onClose={handleCloseDelete}>
				<DialogTitle id="alert-dialog-title">
					{`Delete ${user.role == 'BUSINESS' ? 'Business' : null} Account`}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to delete this item?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDelete}>Cancel</Button>
					<Button onClick={onDelete} color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default Item;
