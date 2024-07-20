import { apiSlice} from './api';


const ORDER_URL = `${import.meta.env.VITE_API_BASE_URL}/api/orders/`;

export const orderApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		createOrder: builder.mutation({
			query: ({
				token,
				client_secret
			}) => ({
				url: ORDER_URL,
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				body: {
					client_secret
				}
			})
		})
	})
});

export const {useCreateOrderMutation} = orderApi;