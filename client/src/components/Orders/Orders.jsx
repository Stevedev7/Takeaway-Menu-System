import React, {
	useEffect, useState
} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLazyGetAllOrdersQuery } from '../../redux/apiSlices/businessOrdersApi';
import { useLazyGetAllCustomerOrdersQuery } from '../../redux/apiSlices/customerOrdersApi';
import BusinessOrder from './components/BusinessOrder';
import CustomerOrder from './components/CustomerOrder';
import Checkout from '../Checkout';
import {
	Box,
	Modal,
	Typography,
	TableContainer,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Paper,
	Table
} from '@mui/material';
import { Button } from 'react-bootstrap';


const modalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 700,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4
};

const Orders = () => {
	const [pageType, setPageType] = useState(null);
	const [orders, setOrders] = useState([]);
	const [checkOutShow, setCheckOutShow] = useState(false);
	const [repeatOrder, setRepeatOrder] = useState(null);
	const [openOrderModal, setOpenOrderModal] = useState(false);
	const {
		token, user
	} = useSelector(state => state.auth);

	const navigate = useNavigate();

	const [getBusinessOrders] = useLazyGetAllOrdersQuery();
	const [getCustomerOrders] = useLazyGetAllCustomerOrdersQuery();

	useEffect(() => {
		if (user === null) {
			navigate('/login');
		}
		if (user.role === 'CUSTOMER') {
			setPageType('customer');
			getCustomerOrders({
				id: user.id,
				token
			}).then(res => {
				if (res.error) {
					throw new Error(res.error);
				}
				setOrders(sortOrders(res.data.orders));
			}).catch(e => console.log(e));

			console.log('get customer orders');

		} else if (user.role === 'BUSINESS') {
			setPageType('business');
			getBusinessOrders({
				id: user.id,
				token
			}).then(res => {
				if (res.error) {
					throw new Error(res.error);
				}
				setOrders(sortOrders(res.data.orders));
			}).catch(e => console.log(e));
		}
	}, [user, token, pageType]);

	useEffect(() => {
		if (repeatOrder) {
			setOpenOrderModal(true);
		}
	}, [repeatOrder]);

	const sortOrders = _orders => {
		const pendingOrders = _orders.filter(order => order.status === 'PENDING').sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
		const processingOrders = _orders.filter(order => order.status === 'PROCESSING').sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
		const readyOrders = _orders.filter(order => order.status === 'READY');
		const completedOrders = _orders.filter(order => order.status === 'COMPLETED');
		const cancelledOrders = _orders.filter(order => order.status === 'CANCELLED');

		return [...pendingOrders, ...processingOrders, ...readyOrders, ...completedOrders, ...cancelledOrders];
	};

	return (
		<>
			<h1>Orders</h1>


			{
				pageType === 'business' && orders.map(order => (
					<>
						<BusinessOrder order={order} />
					</>
				))
			}
			{
				pageType === 'customer' && orders.map(order => <><CustomerOrder order={order} setRepeatOrder={setRepeatOrder} /></>)
			}
			{
				pageType === 'customer' && checkOutShow && <Checkout usePoints={false} token={token} cartId={null} open={checkOutShow} setOpen={setCheckOutShow} points={0} repeatOrder={repeatOrder} setRepeatOrder={setRepeatOrder} />
			}
			{
				pageType === 'customer' && repeatOrder && <Modal
					open={openOrderModal}
					onClose={() => setOpenOrderModal(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={modalStyle}>
						<Typography id="modal-modal-title" variant="h6" component="h2">
							Order again?
						</Typography>
						<Typography id="modal-modal-description" sx={{
							mt: 2
						}}>
							<h2>{repeatOrder.business.name}</h2>
						</Typography>
						<TableContainer component={Paper} >
							<Table sx={{
								width: 600
							}}>

								<TableHead>
									<TableCell><strong>Item</strong></TableCell>
									<TableCell align="right"><strong>Quantity</strong></TableCell>
									<TableCell align="right"><strong>Price</strong></TableCell>
									<TableCell align="right"><strong>Subtotal</strong></TableCell>
								</TableHead>
								<TableBody>
									{repeatOrder.order_items.map(item => <TableRow key={item.id}>

										<TableCell>{item.menu_item.item_name}</TableCell>
										<TableCell align="right">{item.quantity}</TableCell>
										<TableCell align="right">{item.menu_item.price}</TableCell>
										<TableCell align="right">{item.price}</TableCell>
									</TableRow>)}
									{
										repeatOrder.points > 0 && <TableRow>
											<TableCell colSpan={3}>Discount</TableCell>
											<TableCell align="right">{`- ${repeatOrder.points / 100}`}</TableCell>
										</TableRow>
									}
									<TableRow>
										<TableCell align="right" colSpan={3}><strong>Total</strong></TableCell>
										<TableCell align="right">£ {repeatOrder.total_amount}</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
						<Button onClick={() => setCheckOutShow(true)}>Place order £ {repeatOrder.total_amount + (repeatOrder.points / 100)}</Button>
					</Box>
				</Modal>
			}

		</>
	);
};

export default Orders;