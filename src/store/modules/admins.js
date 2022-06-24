import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import ApiController from "../../lib/ApiController";


const initialState = {isLoaded:false, isLoading:false, data:[]}

export const requestGetAdmins = createAsyncThunk(
    "admins/requestGetAdmins",
    async (_, {rejectWithValue}) => {
        try {
            const response = await ApiController.get(`/admins`);
            return response.data;
        }
        catch (err) {
            if (!err.response) {
                throw err
            }

            return rejectWithValue(err.response.data)
        }
    },
);



const adminsSlice = createSlice({
    name: 'admins',
    initialState,
    reducers: {
        setItem: (state, action) => {
            const index = state.data.findIndex(company => company.id === action.payload.id)
            if (index >= 0) {
                state.data[index] = action.payload;
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(requestGetAdmins.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(requestGetAdmins.fulfilled, (state, { payload }) => {
            state.data = payload
            state.isLoading = false;
        });
        builder.addCase(requestGetAdmins.rejected, (state, {payload}) => {
            state.isLoading = false;
        });
    }
});

export const { setItem } = adminsSlice.actions; // 액션 생성함수
export default adminsSlice.reducer; // 리듀서