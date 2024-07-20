import { apiSlice} from './api';


const BUSINESS_URL = `${import.meta.env.VITE_API_BASE_URL}/api/users/businesses`;
export const businessApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		createBusiness: builder.mutation({
			query: payload => ({
				url: `${BUSINESS_URL}/${payload.id}`,
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${payload.token}`
				},
				body: {
					name: payload.name,
					website: payload.website,
					description: payload.description,
					phone: payload.phone,
					img: payload.img
				}
			})
		}),
		updateBusiness: builder.mutation({
			query: payload => ({
				url: `${BUSINESS_URL}/${payload.id}`,
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${payload.token}`
				},
				body: {
					...payload.body
				}
			})
		}),
		deleteBusiness: builder.mutation({
			query: payload => ({
				url: `${BUSINESS_URL}/${payload.id}`,
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${payload.token}`
				}
			})
		})
	})
});

export const {
	useCreateBusinessMutation,
	useUpdateBusinessMutation, 
	useDeleteBusinessMutation
} = businessApi;