import { apiSlice} from './api';


const PAYMENT_URL = `${import.meta.env.VITE_API_BASE_URL}/api/pay/`;

export const paymentApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		makePayment: builder.mutation({
			query: payload => ({
				url: PAYMENT_URL,
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${payload.token}`
				},
				body: payload
			})
		}),
		cancelPayment: builder.mutation({
			query: ({
				token,
				client_secret
			}) => ({
				url : `${import.meta.env.VITE_API_BASE_URL}/api/cancle-pay`,
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				body:{
					client_secret
				}
			})
		})
	})
});

export const {
	useMakePaymentMutation,
	useCancelPaymentMutation
} = paymentApi;