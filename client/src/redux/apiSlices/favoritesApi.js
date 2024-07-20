import { apiSlice } from './api';


const FAVORITES_URL = `${import.meta.env.VITE_API_BASE_URL}/api/users/customers/favorites/`;

export const favoritesApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getFavorites: builder.query({
			query: ({token}) => ({
				url: `${FAVORITES_URL}`,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
		}),
		addToFavorites: builder.mutation({
			query: ({
				token,
				item_id
			}) => ({
				url: FAVORITES_URL,
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				body: {
					item_id
				}
			})
		}),
		removeFromFavorites: builder.mutation({
			query: ({
				token,
				id
			}) => ({
				url: `${FAVORITES_URL}/${id}`,
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
		})
	})
});

export const {
	useAddToFavoritesMutation,
	useGetFavoritesQuery,
	useLazyGetFavoritesQuery,
	useRemoveFromFavoritesMutation
} = favoritesApi;