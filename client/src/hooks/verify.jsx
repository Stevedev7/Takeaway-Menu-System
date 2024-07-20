import {
	useEffect,
	useState
} from 'react';
import { useLazyVerifyQuery } from '../redux/apiSlices/usersApi';
import { clearUserInfo } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';


export const useVerify = token => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [verify] = useLazyVerifyQuery();
	const dispatch = useDispatch();
	useEffect(() => {
		verify({
			token
		})
			.then(res => res)
			.then(data => {
				if (data.error) {
					setIsAuthenticated(false);
					dispatch(clearUserInfo());
				} else {
					setIsAuthenticated(true);
				}
			})
			.catch(error => alert(JSON.stringify(error)));
	}, [token]);
	return isAuthenticated;
};