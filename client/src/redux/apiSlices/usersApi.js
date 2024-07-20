import { apiSlice} from './api';


const USERS_URL = `${import.meta.env.VITE_API_BASE_URL}/api/users`;
export const userApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation({
			query: payload => ({
				url: `${USERS_URL}/login`,
				method: 'POST',
				body: payload
			})
		}),
		register:  builder.mutation({
			query: payload => ({
				url: `${USERS_URL}/register`,
				method: 'POST',
				body: payload
			})
		}),
		customerProfile: builder.query({
			query: ({id}) => ({
				url: `${USERS_URL}/customers/${id}`
			})
		}),
		businessProfile: builder.query({
			query: ({id})=> ({ 
				url:`${USERS_URL}/businesses/${id}`
			})
		}),
		verify: builder.query({
			query : payload => {
				return ({
					url: `${USERS_URL}/verify`,
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${payload.token}`
					}
				});
			}
		})
	})
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useLazyBusinessProfileQuery,
	useLazyCustomerProfileQuery,
	useLazyVerifyQuery,
	useVerifyQuery,
	useCustomerProfileQuery,
	useBusinessProfileQuery
} = userApi;