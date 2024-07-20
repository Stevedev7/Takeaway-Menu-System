/* eslint-disable react/prop-types */
import React from 'react';
import locationIcon from '../../../../assets/imgs/location.jpg';
import './OrderInfo.css';


const OrderInfo = ({
	order, business
}) => {
	return (
		<div className="order-container">
			<h1 style={{
				backgroundColor: 'black',
				color: 'white'
			}}> Order Number {order.id}</h1>
			<div className="order-items-container">
				<h5>{order.business.name}</h5>
				<p><img className="rounded-circle" style={{
					width: 20
				}} src={locationIcon} /><span>{`${business?.street_number} ${business?.street} ${business?.postcode}`}</span></p>

				{
					order.order_items.map(item => (
						<p key={item.id}>
							<span>{item.quantity} X {item.menu_item.item_name}</span>
							<span className="price">
								£{item.price}
							</span>
						</p>
					))
				}
				{
					order.points > 0 && <p><span><strong>Discount</strong></span><span className="price"><strong>£{(-order.points / 100)}</strong></span></p>
				}

				<p><span><strong>Total</strong></span><span className="price"><strong>£{order.total_amount}</strong></span></p>
				{
					order.instructions && order.instructions !== '' && <p><strong>Instructions: {order.instructions}</strong></p>
				}
			</div>
		</div>
	);
};

export default OrderInfo;