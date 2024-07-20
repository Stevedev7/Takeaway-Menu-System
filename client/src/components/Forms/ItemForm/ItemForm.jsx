/* eslint-disable react/prop-types */
import React, {
	useEffect, useState
} from 'react';
import {
	Button, Form, Row
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
	useAddItemMutation, useUpdateItemMutation
} from '../../../redux/apiSlices/menuApi';
import { useNavigate } from 'react-router-dom';


const ItemForm = ({ item }) => {


	const {
		token, user
	} = useSelector(state => state.auth);

	const [itemName, setItemName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(null);
	const [img, setImg] = useState(null);
	const [addItem] = useAddItemMutation();
	const [updateItem] = useUpdateItemMutation();
	const navigate = useNavigate();
	const [update, setUpdate] = useState(false);


	const handleSubmit = e => {
		e.preventDefault();

		if (user && token) {
			const payload = {
				token,
				id: user.id,
				itemName,
				description,
				price,
				img
			};
			if (update) {
				const updatePayload = {
					itemName,
					description,
					price,
					img,
					token,
					menuId: item.business_id,
					itemId: item.id
				};
				console.log(payload);
				updateItem(updatePayload).then(res => {
					if (res.error) throw new Error(res.error);
					window.location.reload();
				}).catch(e => alert(JSON.stringify(e)));
			} else {
				console.log(payload);
				addItem(payload)
					.then(res => {
						if (res.error) throw new Error(res.error);
						navigate(`/profile/menu/${res.data.id}`);
					})
					.catch(err => alert(err));
			}
		}
	};

	useEffect(() => {
		if (item) {
			setUpdate(true);
			setItemName(item.item_name);
			setDescription(item.description);
			setPrice(item.price);
			setImg(item.img);
		}
	}, [item]);


	return (

		<Form onSubmit={handleSubmit}>
			<Row>
				<div className=" flex d-flex justify-content-between align-items-center">
					<h1 className="m-3 form-header">Menu Item</h1>
					<Button type="submit" className="primary-button input-group submit-button mb-3">{false ? 'Update' : 'Submit'}</Button>
				</div>
			</Row>
			<Row>
				<Form.Group>
					<Form.Control
						type="text"
						className="input-group"
						placeholder="Item Name"
						onChange={e => setItemName(e.target.value)}
						value={itemName}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Control
						type="text"
						className="input-group"
						placeholder="Description"
						onChange={e => setDescription(e.target.value)}
						value={description}
						as={'textarea'}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Control
						type="text"
						className="input-group"
						placeholder="Image URL"
						onChange={e => setImg(e.target.value)}
						value={img}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Control
						type="float"
						className="input-group"
						onChange={e => setPrice(isNaN(parseFloat(e.target.value)) ? null : parseFloat(e.target.value))}
						placeholder="Price in £"
						value={price}
					/>
				</Form.Group>
			</Row>
		</Form>


	);
};

export default ItemForm;