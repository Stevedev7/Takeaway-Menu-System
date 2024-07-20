import { createSlice} from '@reduxjs/toolkit';


const initialState = {
	latitude: null, 
	longitude: null,
	error: null,
	address: null
};

const locationSlice = createSlice({
	name: 'location',
	initialState,
	reducers: {
		setLocation: (state, action) => {
			state.latitude = action.payload.latitude;
			state.longitude = action.payload.longitude;
		},
		setAddress:(state, action) => {
			state.address = action.payload;
		},
		clearLocation: state => {
			state.latitude = null;
			state.longitude = null;
		},
		setError: (state, action) => {
			state.error = action.payload;
		}
	}
});

export const {
	setLocation,
	clearLocation,
	setError,
	setAddress
} = locationSlice.actions;

export default locationSlice.reducer;