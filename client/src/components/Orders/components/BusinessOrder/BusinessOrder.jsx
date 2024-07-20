/* eslint-disable react/prop-types */
import React, {
	useEffect, useState
} from 'react';
import { useSelector } from 'react-redux';
import './BusinessOrder.css';
import { useUpdateOrderStatusMutation } from '../../../../redux/apiSlices/businessOrdersApi';


const BusinessOrder = ({ order: _order }) => {
	const [totalItems, setTotalItems] = useState(0);
	const [showItems, setShowItems] = useState(false);
	const [order, setOrder] = useState(_order);
	const {
		token,
		user
	} = useSelector(state => state.auth);

	const [updateOrder] = useUpdateOrderStatusMutation();


	const handleUpdate = status => {
		updateOrder({
			token,
			id: user.id,
			orderId: order.id,
			status
		}).then(res => {
			if (res.error) {
				throw new Error(JSON.stringify(res.error));
			}
			setOrder(res.data);
		}).catch(e => alert(e));
	};

	useEffect(() => {
		if (order) {
			setTotalItems(order.order_items.reduce((total, item) => total + item.quantity, 0));
		}
	}, [order]);
	return (
		<>
			{
				order && <div
					className="order"
				>
					<div className="order-details">
						<div className="order-header">
							<h2>Order ID: {order.id}</h2>
							<button className="show-items-button" onClick={() => setShowItems(!showItems)}>{!showItems ? 'Show Items' : 'Show less'}</button>
						</div>
						{
							order.instructions && order.instructions !== '' && <p><strong>Instructions : {order.instructions}</strong></p>
						}
						<p>
							Status: {order.status}{' '}
							{order.status === 'PENDING' && (
								<>
									<button onClick={() => handleUpdate('PROCESSING')}>ACCEPT</button>{' '}
									<button onClick={() => handleUpdate('CANCELLED')}>REJECT</button>
								</>
							)}
							{order.status === 'PROCESSING' && (
								<>
									<button onClick={() => handleUpdate('CANCELLED')}>CANCEL</button>{' '}
									<button onClick={() => handleUpdate('READY')}>READY</button>
								</>
							)}
							{order.status === 'READY' && (
								<>
									<button onClick={() => handleUpdate('COMPLETED')}>COMPLETE</button>{' '}
									<button onClick={() => handleUpdate('CANCELLED')}>CANCEL</button>
								</>
							)}
							{order.status !== 'CANCELLED' && order.status !== 'PENDING' && order.status !== 'PROCESSING' && order.status !== 'COMPLETED' && (
								<button onClick={() => handleUpdate('PROCESSING')}>PROCESSING</button>
							)}
						</p>
						<p>Number of Items: {totalItems}</p>
						{
							order.order_items.map((item, index) => (
								<div key={index} style={{
									display: showItems ? 'flex' : 'none',
									justifyContent: 'space-between',
									alignItems: 'center',
									padding: '10px 0',
									borderBottom: '1px solid #ccc'
								}}>
									<span style={{
										fontWeight: 'bold'
									}}>{item.menu_item.item_name}</span>
									<span style={{
										color: '#666666'
									}}>{`${item.quantity} * £${item.price}`}</span>
								</div>
							))
						}

						<p>Total Amount: £<span>{order.total_amount}</span></p>
					</div>
				</div>
			}
		</>
	);
};

export default BusinessOrder;