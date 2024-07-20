import { createSlice} from '@reduxjs/toolkit';


const initialState = {
	user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
	token: localStorage.getItem('token') ? localStorage.getItem('token') : null
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUserInfo: (state, action) => {
			state.user = action.payload.userInfo;
			localStorage.setItem('user', JSON.stringify(action.payload.userInfo));
			state.token = action.payload.token; 
			localStorage.setItem('token', action.payload.token );
		}, 
		clearUserInfo: state => {
			state.user = null;
			localStorage.removeItem('user');
			state.token = null;
			localStorage.removeItem('token');
		}
	}
});

export const {
	setUserInfo,
	clearUserInfo
} = authSlice.actions;

export default authSlice.reducer;