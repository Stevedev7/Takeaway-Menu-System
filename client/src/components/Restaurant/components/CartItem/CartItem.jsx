/* eslint-disable react/prop-types */
import React, {
	useEffect, useState
} from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MinusIcon from '@mui/icons-material/Remove';


import { useDeleteCartItemMutation } from '../../../../redux/apiSlices/cartItemApi';
import './CartItem.css';


import img from '../../../../assets/imgs/item-placeholder.webp';


const CartItem = ({
	item, cart, setCart, addToCart
}) => {
	const {
		token, user
	} = useSelector(state => state.auth);

	const [quatity, setQuantity] = useState(item.quantity);

	const [deleteItem] = useDeleteCartItemMutation();

	// eslint-disable-next-line no-unused-vars
	const increaseQuantity = e => {
		if (quatity === 10) return;
		const updatedQuantity = quatity + 1;
		setQuantity(updatedQuantity);
		addToCart({
			quantity: updatedQuantity,
			item_id: item.id
		});
	};

	// eslint-disable-next-line no-unused-vars
	const decreaseQuantity = e => {
		if (quatity === 1) return;
		const updatedQuantity = quatity - 1;
		setQuantity(updatedQuantity);
		addToCart({
			quantity: updatedQuantity,
			item_id: item.id
		});

	};

	// eslint-disable-next-line no-unused-vars
	const onDleteItem = e => {
		deleteItem({
			token,
			cartId: item.cart_id,
			item_id: item.id
		}).then(res => {
			if (res.error) {
				throw res.error;
			}
			setCart({
				...cart,
				cart_items: cart.cart_items.filter(i => i.id !== item.id)
			});

		}).catch(e => console.log(e));
	};

	return (
		<div className="cart-item">
			<img className="cart-item-image" src={item.menu_item.img || img} alt={item.menu_item.item_name} />
			<div className="cart-item-title">
				<h2 className="cart-item-name">{item.menu_item.item_name}</h2>
				<span className="cart-item-price"> £{item.menu_item.price * quatity}</span>
			</div>
			<div className="cart-item-modify" >
				<div className="cart-item-quantity">
					<IconButton className="decrease" onClick={decreaseQuantity}>
						<MinusIcon />
					</IconButton>
					{quatity}
					<IconButton className="increase" onClick={increaseQuantity}>
						<AddIcon />
					</IconButton>
				</div>
				<button className="cart-item-delete" type="button" onClick={onDleteItem}>Remove</button>
			</div>
		</div>
	);
};

export default CartItem;