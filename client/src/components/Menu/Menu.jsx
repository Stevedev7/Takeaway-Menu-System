import React, {
	useEffect, useState
} from 'react';
import { useLazyBusinessProfileQuery } from '../../redux/apiSlices/usersApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Items from './Items';


const Menu = () => {
	const {
		token, user
	} = useSelector(state => state.auth);
	const [menu, setMenu] = useState([]);
	const [business, setBusiness] = useState(null);
	const navigate = useNavigate();

	const [businessProfile] = useLazyBusinessProfileQuery();
	useEffect(() => {
		if (user === null) {
			navigate('/login');
		}
		if (user?.role !== 'BUSINESS') {
			navigate('/');
		} else {
			businessProfile({
				id: user.id
			}).then(res => {
				if (res.error) throw new Error('Failed to load business profile');
				setBusiness(res.data);
				setMenu(res.data.menu);
			}).catch(e => alert(e));
		}

	}, [user, navigate, business, token]);

	return (
		<>
			<h1 className="text-center mt-5">{business?.name}</h1>
			{menu && <Items id={user?.id} />}
		</>
	);

};

export default Menu;