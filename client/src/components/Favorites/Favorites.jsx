import React, {
	useEffect, useState
} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	Container, Row, Col, Card
} from 'react-bootstrap';
import { useLazyGetFavoritesQuery } from '../../redux/apiSlices/favoritesApi';
import { useLazyBusinessProfileQuery } from '../../redux/apiSlices/usersApi';
import img from '../../assets/imgs/favorites.jpg';
import itemImage from '../../assets/imgs/item-placeholder.webp';


const Favorites = () => {
	const {
		user, token
	} = useSelector(state => state.auth);
	const [favorites, setFavorites] = useState(null);
	const [businessAddresses, setBusinessAddresses] = useState({});

	const navigate = useNavigate();
	const [getFavorites] = useLazyGetFavoritesQuery();
	const [business] = useLazyBusinessProfileQuery();

	useEffect(() => {
		if (user === null) navigate('/login');
		if (user.role !== 'CUSTOMER') navigate('/');

		getFavorites({
			token
		})
			.then(res => {
				console.log(JSON.stringify(res.data.data, null, 2));
				setFavorites(res.data.data);
			})
			.catch(e => console.log(e));
	}, [user, token]);

	useEffect(() => {
		if (favorites) {
			const fetchBusinessAddresses = async () => {
				const addresses = {};
				for (const businessId of Object.keys(favorites)) {
					try {
						const profile = await business({
							id: businessId
						});
						addresses[businessId] = profile.data;
					} catch (error) {
						console.log(error);
					}
				}
				setBusinessAddresses(addresses);
			};

			fetchBusinessAddresses();
		}
	}, [favorites]);

	if (!favorites) {
		return <div>Loading...</div>;
	}

	const renderFavoriteItems = items => {
		return items.map(item => (
			<Row key={item.id}
				style={{
					width: 600,
					display: 'flex',
					marginBottom: 30
				}}
			>
				<Col md={8} style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'flex-start',
					flexDirection: 'column'
				}}>
					<p style={{
						marginBottom: 0,
						fontSize: 25
					}}><img src={img}
						style={{
							width: '10%',
							marginRight: 10
						}}
						alt="Favorite"
						/> {item.menu_item.item_name}
					</p>
					<p style={{
						paddingLeft: '14%',
						marginBottom: 0
					}}>{item.menu_item.description}</p>
					<p style={{
						paddingLeft: '14%',
						marginBottom: 0
					}}>Price: £{item.menu_item.price}</p>
				</Col>
				<Col style={{
					width: '10%',
					height: '70px'
				}}>
					<img style={{
						float: 'right',
						objectFit: 'cover',
						width: '70%',
						height: '90px'
					}} src={item.menu_item.img || itemImage} />
				</Col>
			</Row>
		));
	};

	const renderAddress = address => {
		if (
			address &&
			(address.street_number ||
				address.street ||
				address.city ||
				address.country ||
				address.postcode)
		) {
			return (
				<h5>
					{address.street_number && `${address.street_number}, `}
					{address.street && `${address.street}, `}
					{address.city && `${address.city}, `}
					{address.country && `${address.country}, `}
					{address.postcode}
				</h5>
			);
		}
		return null;
	};

	return (
		<div style={{
			paddingLeft: '30px'
		}}>
			<h1 className="flex">
				<img src={img} style={{
					width: '4%',
					marginRight: 6
				}} alt="Favorite" />
				Favorites
			</h1>
			<hr
				style={{
					border: '2px solid',
					color: '#000000',
					backgroundColor: '#000000',
					borderColor: '#000000'
				}}
			/>
			{Object.keys(favorites).length === 0 ? (
				<p>No favorites found.</p>
			) : (
				Object.entries(favorites).map(([businessId, items]) => (
					<Row key={businessId}>
						<Col>
							<a style={{
								all: 'unset',
								cursor: 'pointer'
							}} href={`/restaurants/${businessId}`} ><h2>{businessAddresses[businessId]?.name}</h2></a>
							{/* {businessAddresses[businessId].name} */}
							{renderAddress(businessAddresses[businessId])}
							<hr
								width={600}
								style={{
									border: '2px solid',
									color: '#000000',
									backgroundColor: '#000000',
									borderColor: '#000000'
								}}
							/>
							{renderFavoriteItems(items)}
							<hr
								style={{
									border: '2px solid',
									color: '#000000',
									backgroundColor: '#000000',
									borderColor: '#000000'
								}}
							/>
						</Col>
					</Row>
				))
			)}
		</div>
	);
};

export default Favorites;