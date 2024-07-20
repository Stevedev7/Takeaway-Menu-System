import { apiSlice} from './api';


const CUSTOMER_URL = `${import.meta.env.VITE_API_BASE_URL}/api/users/customers`;
export const customerApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		createCustomer: builder.mutation({
			query: payload => ({
				url: `${CUSTOMER_URL}/${payload.id}`,
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${payload.token}`
				},
				body: {
					first_name: payload.firstName,
					last_name: payload.lastName,
					phone: payload.phone
				}
			})
		}),
		updateCustomer: builder.mutation({
			query: payload => ({
				url: `${CUSTOMER_URL}/${payload.id}`,
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${payload.token}`
				},
				body: {
					first_name: payload.firstName,
					last_name: payload.lastName,
					phone: payload.phone
				}
			})
		}),
		deleteCustomer: builder.mutation({
			query: payload => ({
				url: `${CUSTOMER_URL}/${payload.id}`,
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${payload.token}`
				}
			})
		})
	})
});

export const {
	useCreateCustomerMutation,
	useUpdateCustomerMutation,
	useDeleteCustomerMutation
} = customerApi;