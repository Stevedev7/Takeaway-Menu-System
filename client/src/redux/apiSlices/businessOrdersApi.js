import { apiSlice} from './api';


const BUSINESS_URL = `${import.meta.env.VITE_API_BASE_URL}/api/businesses`;
export const businessOrdersApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getAllOrders: builder.query({
			query: payload => ({
				url: `${BUSINESS_URL}/${payload.id}/orders`,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${payload.token}`
				}
			})
		}),
		getOrderById: builder.query({
			query: payload => ({
				url: `${BUSINESS_URL}/${payload.id}/orders/${payload.orderId}`,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${payload.token}`
				}
			})
		}),
		updateOrderStatus: builder.mutation({
			query: ({
				token, id, orderId, status
			}) => ({
				url: `${BUSINESS_URL}/${id}/orders/${orderId}`,
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',  
					'Authorization': `Bearer ${token}` 
				},
				body: {
					status
				}

			})
		})
	})
});

export const {
	useLazyGetAllOrdersQuery,
	useLazyGetOrderByIdQuery,
	useUpdateOrderStatusMutation
} = businessOrdersApi;