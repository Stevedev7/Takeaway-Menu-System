import React, { useState } from 'react';
import {
	PaymentElement,
	useStripe,
	useElements
} from '@stripe/react-stripe-js';
import './CardInput.css';


const CardInput = ({ clientSecret }) => {

	const [message, setMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const stripe = useStripe();
	const elements = useElements();

	const handleSubmit = async e => {
		e.preventDefault();
		if (!stripe || !elements)
			return;

		setIsLoading(true);

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/completion?cs=${clientSecret}`
			}
		});

		if (error.type === 'card_error' || error.type === 'validation_error') {
			setMessage(error.message);
		} else {
			setMessage('An unexpected error occured.');
		}

		setIsLoading(false);
	};
	return (
		<form id="payment-form" onSubmit={handleSubmit}>
			<PaymentElement id="payment-element" />
			<button disabled={isLoading || !stripe || !elements} id="submit">
				<span id="button-text">
					{isLoading ? 'Processing ... ' : 'Pay now'}
				</span>
			</button>
			{message && <div id="payment-message">{message}</div>}
		</form>
	);
};

export default CardInput;