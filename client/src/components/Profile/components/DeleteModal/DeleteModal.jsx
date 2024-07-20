/* eslint-disable react/prop-types */
import React from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from '@mui/material';
import {
	useSelector
} from 'react-redux';
import {
	useDeleteCustomerMutation
} from '../../../../redux/apiSlices/customerApi';
import {
	useNavigate
} from 'react-router-dom';
import {
	useDeleteBusinessMutation
} from '../../../../redux/apiSlices/businessApi';

/**
 * DeleteModal component displays a confirmation dialog for deleting a user account.
 * It receives the following props:
 * - show: boolean indicating whether to show the modal or not
 * - setShow: function to update the show state
 * - message: string containing the confirmation message
 */
const DeleteModal = ({
	show, setShow, message
}) => {
	const {
		token, user
	} = useSelector(state => state.auth);
	const [deleteCustomer] = useDeleteCustomerMutation();
	const [deleteBusiness] = useDeleteBusinessMutation();
	const navigate = useNavigate();

	/**
	 * Handles the close event of the modal.
	 * @param {Event} e - The event object.
	 */
	const handleClose = e => {
		e.preventDefault();
		setShow(false);
	};

	/**
	 * Handles the delete event when the user confirms the deletion.
	 * @param {Event} e - The event object.
	 */
	const handleDelete = e => {
		e.preventDefault();
		const deleteUser = user.role === 'CUSTOMER' ? deleteCustomer : deleteBusiness;
		deleteUser({
			id: user.id,
			token
		})
			.then(res => console.log(res))
			.then(() => navigate('/'))
			.catch(e => console.log(e));
	};

	return (
		<Dialog open={show} onClose={handleClose}>
			<DialogTitle id="alert-dialog-title">
				{`Delete ${user?.role === 'BUSINESS' ? 'Business' : 'Customer'} Account`}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{message}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleDelete} color="error">
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteModal;