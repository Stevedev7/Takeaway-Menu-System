import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ItemForm from '../../../Forms/ItemForm';



const ItemModal = ({
	show,
	setShow
}) => {

	const {
		token, user
	} = useSelector(state => state.auth);
	const navigate = useNavigate();

	const handleClose = e => {
		e.preventDefault();
		setShow(false);
	};

	return (
		<Dialog open={show} onClose={handleClose}>
			<DialogTitle id="alert-dialog-title">
				{'Add Item'}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					<ItemForm />
				</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};

export default ItemModal;