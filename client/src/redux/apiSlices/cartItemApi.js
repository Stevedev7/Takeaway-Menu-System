import { apiSlice} from './api';


const CART_ITEM_URL = `${import.meta.env.VITE_API_BASE_URL}/api/cart`;

export const cartItemApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		addItemToCart: builder.mutation({
			query: ({
				cartId, token, body
			}) => ({
				url: `${CART_ITEM_URL}/${cartId}`,
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				body
			})
		}),
		updateCartItem: builder.mutation({
			query: ({
				cartId, token, body, item_id
			}) => ({
				url: `${CART_ITEM_URL}/${cartId}/${item_id}`,
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				body
			})
		}),
		deleteCartItem: builder.mutation({
			query: ({
				cartId, token, item_id
			}) => ({
				url: `${CART_ITEM_URL}/${cartId}/${item_id}`,
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
		})
	})
});

export const {
	useAddItemToCartMutation,
	useUpdateCartItemMutation,
	useDeleteCartItemMutation
} = cartItemApi;