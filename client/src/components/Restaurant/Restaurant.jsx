import React, {
	useEffect, useState
} from 'react';
import { useParams } from 'react-router-dom';
import {
	Form, Button, Modal
} from 'react-bootstrap';
import {
	Container,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	IconButton,
	Badge,
	Drawer
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useVerify } from '../../hooks/verify';
import { useSelector } from 'react-redux';
import banner from '../../assets/imgs/restaurant-placeholder.jpg';
import img from '../../assets/imgs/item-placeholder.webp';
import CartItem from './components/CartItem';
import Checkout from '../Checkout';
import RestaurantInfo from './components/RestaurantInfo';

import {
	useCreateCartMutation, useLazyGetCurrentCartQuery
} from '../../redux/apiSlices/cartApi';
import { useGetMenuQuery } from '../../redux/apiSlices/menuApi';
import {
	useAddItemToCartMutation,
	useUpdateCartItemMutation
} from '../../redux/apiSlices/cartItemApi';
import { useLazyCustomerProfileQuery } from '../../redux/apiSlices/usersApi';
import {
	useLazyGetFavoritesQuery,
	useAddToFavoritesMutation,
	useRemoveFromFavoritesMutation
} from '../../redux/apiSlices/favoritesApi';


import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


import './Restaurant.css';


const StyledBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		right: -3,
		top: 13,
		border: `2px solid ${theme.palette.background.paper}`,
		padding: '0 4px'
	}
}));

const Restaurant = () => {
	const { id } = useParams();

	const [show, setShow] = useState(false);
	const [checkOutShow, setCheckOutShow] = useState(false);
	const [item, setItem] = useState({});
	const [qty, setQty] = useState(1);
	const [cart, setCart] = useState(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [profile, setProfile] = useState(null);
	const [usePoints, setUsePoints] = useState(false);
	const [favorites, setFavorites] = useState([]);
	const [instructions, setInstructions] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [restaurant, setRestaurant] = useState(null);

	const {
		token, user
	} = useSelector(state => state.auth);

	const [createCart] = useCreateCartMutation();
	const [getCustomer] = useLazyCustomerProfileQuery();
	const [getCart] = useLazyGetCurrentCartQuery();
	const [addItem] = useAddItemToCartMutation();
	const [updateItem] = useUpdateCartItemMutation();
	const [getFavorites] = useLazyGetFavoritesQuery();
	const [addToFavorites] = useAddToFavoritesMutation();
	const [removeFromFavorites] = useRemoveFromFavoritesMutation();

	let isAuthenticated = useVerify(token);

	const handleClose = () => {
		setItem({});
		setQty(1);
		setShow(false);
	};

	const onClick = item => {
		setItem(item);
		setShow(true);
	};

	const {
		data, error
	} = useGetMenuQuery(id);


	const updateCartItem = payload => {
		updateItem({
			token,
			cartId: cart.id,
			item_id: payload.item_id,
			body: payload
		}).then(res => setCart(res.data)).catch(e => console.log(e));

	};

	const findFavorites = itemId => {
		return favorites.find(item => item.menu_item_id === itemId);
	};

	const addToCart = (payload, update) => {

		if (update) {
			updateItem({
				token,
				cartId: cart.id,
				item_id: payload.item_id,
				body: payload
			}).then(res => setCart(res.data)).catch(e => console.log(e));
			console.log(cart.cart_items.find(i => i.menu_item_id === payload.item_id));
		} else {

			addItem({
				token,
				cartId: cart.id,
				body: payload
			}).then(res => setCart(res.data)).catch(e => console.log(e));
		}

		handleClose();
	};

	const toggleDrawer = open => event => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}
		setIsDrawerOpen(open);
	};

	const handleAddToFavorites = item => {
		addToFavorites({
			item_id: item.id,
			token
		}).then(res => {
			if (res.error) {
				throw new Error(res.error);
			}
			setFavorites([...favorites, res.data]);
		}).catch(e => console.log(e.error));
	};
	const handleRemoveFromFavorites = item => {
		const removableItem = favorites.find(i => i.menu_item.id === item.id);
		removeFromFavorites({
			id: removableItem.id,
			token
		}).then(res => {
			if (res.error) {
				throw new Error(res.error);
			}
			let newFavorites = favorites.filter(i => i.id !== removableItem.id);
			setFavorites(newFavorites);
		}).catch(e => console.log(e.error));
	};
	useEffect(() => {
		if (user?.role === 'CUSTOMER') {
			getCustomer({
				id: user.id
			}).then(res => {
				if (res.error) {
					if (res.error.status == 404) {
						setShow(true);
						return;
					}
					throw new Error(res.error);
				}
				if (res.data) {
					setProfile(res.data);
				}
			}).catch(e => console.log(JSON.stringify(e)));

			getFavorites({
				token
			}).then(res => {
				if (res.error) {
					throw new Error(res.error);
				}
				return res.data.data;
			}).then(data => {
				if (data[`${id}`]) {
					setFavorites(data[`${id}`]);
				}
			}).catch(e => console.log(e));
		}
		if (user) {
			getCart({
				token,
				customer_id: user.id,
				business_id: Number(id)
			}).then(res => {
				if (res.error && res.error.status === 404) {
					createCart({
						token,
						customer_id: user.id,
						business_id: Number(id)
					}).then(res => setCart(res.data)).catch(e => console.log(e));
				}
				setCart(res.data);
				return res.data.cart_items;
			}).then(items => console.log(items?.id)).catch(e => console.error(e));
		}
	}, [user, token, data, cart, favorites]);
	return (
		<>
			<div className="restaurant-header banner" style={{
				backgroundImage: `url(${data?.img || banner})`
			}}>

				<h1 id="restaurant-title" className={`${(isAuthenticated && user?.role === 'CUSTOMER') && 'p-l-20 '} text-center`}>
					{
						<IconButton
							style={{
								float: 'left'
							}}
							aria-label="restaurant info"
							onClick={() => setShowModal(true)}
						>
							<InfoOutlinedIcon style={{
								fill: '#ffffff'
							}} />
						</IconButton>
					}
					{data?.name}
					{(isAuthenticated && user?.role === 'CUSTOMER') &&
						<IconButton aria-label="cart" className="cart-button" onClick={toggleDrawer(true)}>
							<StyledBadge badgeContent={cart ? cart?.cart_items.length : 0} className="cart-badge" color="error">
								<ShoppingCartIcon style={{
									fill: '#ffffff'
								}} />
							</StyledBadge>
						</IconButton>
					}
				</h1>
			</div>
			<Container className="items">

				{error && (error.status === 404 ? <p>{'Restaurant not found'}</p> : <p>Something went wrong...</p>)}
				{data && (
					data.menu.length !== 0 ? (
						<div className="d-flex flex-column menu">
							{data.menu.map(item => (<>
								<div key={item.id} className="item-container" >

									{
										(isAuthenticated && user?.role === 'CUSTOMER') && <div className="favorite-icon">
											{findFavorites(item.id) ?
												<IconButton onClick={() => handleRemoveFromFavorites(item)}><BookmarkRemoveIcon /></IconButton>
												: <IconButton onClick={() => handleAddToFavorites(item)}><BookmarkAddIcon /></IconButton>

											}

										</div>
									}
									<div key={item.id} className="item" >
										<h2>{item.item_name}</h2>
										<div > £{item.price}</div>
										<div className="item-description">
											{item.description}
										</div>
										<hr />
										<IconButton
											onClick={() => onClick(item)}
											style={{
												float: 'right',
												position: 'relative',
												top: '-100px'
											}}
										>
											<AddIcon />
										</IconButton>
									</div>
								</div>

							</>
							))}
						</div>
					) : (
						<p>No items yet...</p>
					)
				)}
			</Container>

			<Dialog open={show} onClose={handleClose}>
				<img className="item-image" src={item.img || img} alt="Item Image" />
				<DialogTitle id="alert-dialog-title">{item.item_name}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{item.description}
						{!isAuthenticated && <p className="danger">Please <a href="/login">login</a> to add item to the cart.</p>}
						{user?.role == 'BUSINESS' && (
							<p className="danger">You are logged in as business account. Please log in with regular account to order food.</p>
						)}
					</DialogContentText>
					{user?.role === 'CUSTOMER' && (
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center'
							}}
						>
							<Form.Group>
								<Form.Control
									type="number"
									className="input-group item-quantity-input"
									placeholder="quantity"
									min={1}
									max={10}
									value={qty}
									onChange={e => {
										setQty(e.target.value);
									}}
								/>
							</Form.Group>
							<span style={{}}> Price: £ {`${qty * item.price}`}</span>
						</div>
					)}
				</DialogContent>
				{(isAuthenticated && user?.role === 'CUSTOMER') && (
					<DialogActions>
						<Button onClick={handleClose} color="error">Cancel</Button>
						<Button onClick={() => {
							const cartItemId = cart && cart.cart_items.find(i => i.menu_item_id === item.id)?.id;
							addToCart({
								quantity: qty,
								item_id: cartItemId || item.id
							}, cart && cart.cart_items.find(i => i.menu_item_id === item.id) ? true : false);
						}} color="primary">

							{cart && cart.cart_items.find(i => i.menu_item_id === item.id) ? 'Update cart' : 'Add to cart'}
						</Button>
					</DialogActions>
				)}
			</Dialog>

			{cart && (
				<Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
					<div className="cart">
						<div className="cart-header">
							<IconButton className="close-button" onClick={toggleDrawer(false)}>
								<CloseIcon />
							</IconButton>
							<h2 className="text-center">Your Cart</h2>
						</div>
						<div className="cart-items">
							{cart.cart_items.map(item => (
								<CartItem key={item.id} item={item} cart={cart} setCart={setCart} addToCart={updateCartItem} />
							))}
						</div>
					</div>
					<div className="points-info">

						<h4> <InfoOutlinedIcon /> Earn as you order</h4>
						<p>Enjoy more of what you love with our Rewards Program! For every pound you spend on our website, you earn 1 loyalty point.</p>
						<p>Accumulate 100 points and you'll receive a £1 voucher for your next order. Start ordering today and watch your points grow - your next meal could be on us!</p>
					</div>
					{profile && profile.points && profile.points > 100 &&
						<>
							<p
								onClick={() => setUsePoints(!usePoints)} style={{
									cursor: 'pointer',
									color: usePoints ? 'green' : 'red'
								}}>{usePoints ? 'Don\'t ' : ''}Use Points? <span><strong>{profile.points}</strong> at your disposal.</span></p>

						</>
					}
					<div className="cart-subtotal">
						<p>Subtotal: £{usePoints ? (cart.cart_items.reduce((total, item) => total + item.menu_item.price * item.quantity, 0)) - (profile?.points / 100) : cart.cart_items.reduce((total, item) => total + item.menu_item.price * item.quantity, 0)}</p>
					</div>
					{
						(usePoints ? (cart.cart_items.reduce((total, item) => total + item.menu_item.price * item.quantity, 0)) - (profile.points / 100) : (cart.cart_items.reduce((total, item) => total + item.menu_item.price * item.quantity, 0))) < 10 &&
						<p style={{
							color: 'red',
							textShadow: '1px 2px 2px red',
							textTransform: 'uppercase',
							paddingLeft: 15
						}}>Place minimum order of £10</p>
					}
					{
						<Form.Control
							className="instructions-input"
							type="text"
							placeholder="Instructions"
							onChange={e => setInstructions(e.target.value)}
							value={instructions}
						/>
					}
					<Button
						disabled={usePoints ? (cart.cart_items.reduce((total, item) => total + item.menu_item.price * item.quantity, 0) - (profile?.points / 100)) < 10 : cart.cart_items.reduce((total, item) => total + item.menu_item.price * item.quantity, 0) < 10}
						className="checkout-button primary-button"
						type="button"
						onClick={() => setCheckOutShow(true)}
					>
						Checkout
					</Button>
				</Drawer>
			)}
			{
				checkOutShow && <Checkout usePoints={usePoints} token={token} cartId={cart?.id} open={checkOutShow} setOpen={setCheckOutShow} points={profile.points || 0} instructions={instructions} />
			}
			{data && <RestaurantInfo
				show={showModal}
				onHide={() => setShowModal(false)}
				restaurant={data}
			/>}
		</>
	);
};

export default Restaurant;