/* eslint-disable react/prop-types */
import React, {
	useEffect, useState
} from 'react';
import {
	Dialog,
	Slide,
	IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CardInput from './components/CardInput';
import {
	useCancelPaymentMutation, useMakePaymentMutation
} from '../../redux/apiSlices/paymentApi';


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const Checkout = ({
	open, setOpen, token, cartId, usePoints, points, repeatOrder = null, setRepeatOrder = null, instructions = ''
}) => {
	const [getClientSecret] = useMakePaymentMutation();
	const [canclePayment] = useCancelPaymentMutation();
	const [clientSecret, setClientSecret] = useState('');
	const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

	const handleClose = () => {
		canclePayment({
			token,
			client_secret: clientSecret
		}).then(res => {
			if (res.error) {
				throw new Error(`Error cancelling payment: ${res.error.error}`);
			}
		}).catch(err => console.log(err));
		setOpen(false);
	};

	useEffect(() => {
		if (token && repeatOrder) {
			let payload = {
				token,
				client_secret: repeatOrder.client_secret
			};
			getClientSecret(payload).then(res => {
				if (res.error) {
					throw new Error(res.error);
				}
				setClientSecret(res.data.clientSecret);
				setRepeatOrder(null);
			}).catch(e => alert(JSON.stringify(e)));
		}
		if (token && cartId) {
			let payload = {
				token,
				cart_id: cartId,
				points: 0,
				instructions
			};

			if (usePoints) {
				payload = {
					...payload,
					points
				};
			}

			getClientSecret(payload).then(res => {
				if (res.error) {
					throw new Error(res.error);
				}
				setClientSecret(res.data.clientSecret);
			}).catch(e => alert(JSON.stringify(e)));
		}
	}, [token, cartId]);
	return (
		<Dialog
			fullScreen
			open={open}
			onClose={handleClose}
			TransitionComponent={Transition}
		>
			<IconButton
				edge="start"
				color="inherit"
				onClick={handleClose}
				aria-label="close"
			>
				<CloseIcon />
			</IconButton>
			<h1>Checkout</h1>
			{clientSecret && (

				<Elements stripe={stripePromise} options={{
					clientSecret
				}} >
					<CardInput clientSecret={clientSecret} />
				</Elements>
			)}
		</Dialog>
	);
};

export default Checkout;