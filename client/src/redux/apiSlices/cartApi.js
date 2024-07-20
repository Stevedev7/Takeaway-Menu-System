import { apiSlice} from './api';


const CART_URL = `${import.meta.env.VITE_API_BASE_URL}/api/carts/`;

export const cartApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		createCart: builder.mutation({
			query: ({
				customer_id, business_id, token
			}) => ({
				url: `${CART_URL}/${customer_id}/${business_id}`,
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
		}),
		getCurrentCart: builder.query({
			query: ({
				customer_id, business_id, token
			}) => ({
				url: `${CART_URL}/${customer_id}/${business_id}`,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
		})
	})
});

export const {
	useCreateCartMutation, 
	useGetCurrentCartQuery,
	useLazyGetCurrentCartQuery
} = cartApi;