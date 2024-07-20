/**
 * The main `App` component of the application.
 * Uses the `useSearchMenusQuery` hook from Redux to fetch data based on a search term.
 * Renders a search input field and a grid of restaurant cards.
 * Navigates to the restaurant details page when a card is clicked.
 */

import React, { useState } from 'react';
import {
	Box,
	TextField,
	InputAdornment,
	Card,
	CardContent,
	CardMedia,
	Typography,
	Container,
	Grid
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSearchMenusQuery } from './redux/apiSlices/menuApi';
import './App.css';
import img from './assets/imgs/restaurant-placeholder.jpg';


function App() {
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();
	const {
		data, isLoading
	} = useSearchMenusQuery({
		searchTerm
	});

	// Navigate to the restaurant details page when a card is clicked
	const onClick = id => {
		navigate(`restaurants/${id}`);
	};

	if (isLoading) return <div>Loading...</div>;

	return (
		<>
			<h1 className="text-center jumbotron mt-5">Home</h1>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				mt={4}
				mb={4}
			>
				<TextField
					variant="outlined"
					placeholder="Search..."
					fullWidth
					sx={{
						maxWidth: 600
					}}
					onChange={e => setSearchTerm(e.target.value)}
					value={searchTerm}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<Search />
							</InputAdornment>
						)
					}}
				/>
			</Box>
			<Container>
				<Grid container spacing={3}>
					{data.length === 0 && (
						<h3 className="text-center">
							No Restaurants {searchTerm !== '' && 'found...'}
						</h3>
					)}
					{data &&
						data.map(data => (
							<Grid data xs={12} sm={6} md={4} key={data.id}>
								<Card className="card" onClick={() => onClick(data.id)}>
									<CardMedia
										className="media"
										image={data.img || img}
										title={data.name}
									/>
									<CardContent>
										<Typography variant="h5" component="h2">
											{data.name}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
				</Grid>
			</Container>
		</>
	);
}

export default App;