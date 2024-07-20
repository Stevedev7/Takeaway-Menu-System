/* eslint-disable react/prop-types */
import React, {
	useEffect, useState
} from 'react';
import moment from 'moment';


const CustomerOrder = ({
	order, setRepeatOrder
}) => {
	const [totalItems, setTotalItems] = useState(0);
	const [showItems, setShowItems] = useState(false);

	useEffect(() => {
		if (order) {
			setTotalItems(order.order_items.reduce((total, item) => total + item.quantity, 0));
		}
	}, [order]);

	const repeatOrder = () => {
		setRepeatOrder({
			...order
		});
	};
	return (
		<>
			{
				order && <div
					className="order"
				>
					<div className="order-details">
						<div className="order-header">
							<h2>{order.business.name}</h2>
							<button className="show-items-button" onClick={() => setShowItems(!showItems)}>{!showItems ? 'Show Items' : 'Show less'}</button>
						</div>
						<p>Ordered on <strong>{`${moment(order.created_at).format('DD/MM/YYYY')}`}</strong></p>

						<p>
							Status: {order.status}
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
						<button onClick={repeatOrder} >Repeat Order</button>
					</div>
				</div>
			}
		</>
	);
};

export default CustomerOrder;