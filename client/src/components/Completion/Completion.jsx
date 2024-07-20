import React, {
	useEffect, useState
} from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCreateOrderMutation } from '../../redux/apiSlices/orderApi';
import OrderInfo from './components/OrderInfo';
import { useLazyBusinessProfileQuery } from '../../redux/apiSlices/usersApi';


const Completion = () => {
	const {
		token, user
	} = useSelector(state => state.auth);
	const [clientSecret, setClientSecret] = useState('');
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const [createOrder] = useCreateOrderMutation();
	const [order, setOrder] = useState(null);
	const [business, setBusiness] = useState(null);
	const [getBusiness] = useLazyBusinessProfileQuery();
	useEffect(() => {
		const cs = searchParams.get('cs');
		setClientSecret(cs);
		if (clientSecret !== '') {
			createOrder({
				client_secret: clientSecret,
				token

			}).then(res => {
				if (res.error) {
					throw new Error(res.error);
				}
				setOrder(res.data.order);
				return res.data.order;
			}).then(ord => {
				getBusiness({
					id: ord.business_id
				}).then(res => {
					if (res.error) {
						throw res.error.data.error;
					}
					setBusiness(res.data);
					return res.data;
				}).then(data => {
					console.log(data);
				}).catch(e => alert(e));
			}).catch(e => console.log(JSON.stringify(e)));
		}
	}, [clientSecret]);


	return (
		<div>
			{order && business ? <h1 className="text-center">Thank you for ordering, {order && order.customer.first_name}</h1> : <p>Loading...</p>}

			{
				order && business && <OrderInfo order={order} business={business} />
			}
		</div>
	);
};

export default Completion;