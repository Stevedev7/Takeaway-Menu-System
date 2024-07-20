// Material-UI imports
import {
	Button,
	Drawer,
	List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// React imports
import React, {
	useState
} from 'react';

// Component imports
import DeleteModal from '../DeleteModal';


const AdvancedOptions = () => {
	// State variables for controlling the drawer and modal
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isModalShow, setIsModalShow] = useState(false);

	// Event handlers for opening and closing the drawer
	const handleDrawerOpen = () => {
		setIsDrawerOpen(true);
	};

	const handleDrawerClose = () => {
		setIsDrawerOpen(false);
	};

	// Event handler for deleting the account
	const handleDeleteAccount = () => {
		// Your delete account logic here
		setIsModalShow(true);
	};

	// Render the advanced options button, drawer, and delete modal
	return (
		<div>
			<Button
				startIcon={<ExpandMoreIcon />}
				onClick={handleDrawerOpen}
			>
				Advanced Options
			</Button>
			<Drawer anchor="bottom" open={isDrawerOpen} onClose={handleDrawerClose}>
				<List>
					<ListItem button onClick={handleDeleteAccount}>
						<ListItemIcon>
							<DeleteIcon color="error" />
						</ListItemIcon>
						<ListItemText primary="Delete account" />
					</ListItem>
				</List>
			</Drawer>
			<DeleteModal show={isModalShow} setShow={setIsModalShow} message={'Are you sure you want to delete your account? This action cannot be undone.'} />
		</div>
	);
};

export default AdvancedOptions;