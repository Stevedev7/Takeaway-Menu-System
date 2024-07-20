import { apiSlice} from './api';


const CUSTOMER_URL = `${import.meta.env.VITE_API_BASE_URL}/api/customers`;
export const customerOrderApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getAllCustomerOrders: builder.query({
			query: payload => ({
				url: `${CUSTOMER_URL}/${payload.id}/orders`,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${payload.token}`
				}
			})
		})
	})
});

export const {useLazyGetAllCustomerOrdersQuery} = customerOrderApi;