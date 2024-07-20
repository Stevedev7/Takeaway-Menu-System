import { apiSlice} from './api';


const MENU_URL = `${import.meta.env.VITE_API_BASE_URL}/api/menus`;
export const menuApi = apiSlice.injectEndpoints({
	endpoints: builder =>  ({
		getMenu: builder.query({
			query: id => ({
				url: `${MENU_URL}/${id}`,
				method: 'GET'
			})
		}),
		addItem: builder.mutation({
			query: payload => ({
				url: `${MENU_URL}/${payload.id}`,
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${payload.token}`
				},
				body: {
					item_name: payload.itemName,
					description: payload.description,
					price: payload.price,
					img: payload.img
				}
			})
		}),
		getItem: builder.query({
			query: payload => ({
				url: `${MENU_URL}/${payload.menuId}/items/${payload.itemId}`,
				method: 'GET'
			})
		}),
		deleteItem: builder.mutation({
			query: payload => ({
				url: `${MENU_URL}/${payload.menuId}/items/${payload.itemId}`,
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${payload.token}`
				}
			})
		}),
		updateItem: builder.mutation({
			query: payload => ({
				url: `${MENU_URL}/${payload.menuId}/items/${payload.itemId}`,
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${payload.token}`
				},
				body: {
					item_name: payload.itemName,
					description: payload.description,
					price: payload.price,
					img: payload.img
				}
			})
		}),
		searchMenus: builder.query({
			query: payload => ({
				url: `${MENU_URL}?search=${payload.searchTerm}`,
				method: 'GET'
			})
		})
	})
});

export const {
	useLazyGetMenuQuery,
	useGetMenuQuery,
	useAddItemMutation,
	useGetItemQuery,
	useDeleteItemMutation,
	useUpdateItemMutation,
	useSearchMenusQuery,
	useLazyGetItemQuery
} = menuApi;