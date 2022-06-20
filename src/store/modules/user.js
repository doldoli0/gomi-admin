import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiController from "../../lib/ApiController";
import {toast} from "react-toastify";
import {requestCreateCompany} from "./companies";
import {isSet} from "immutable";

const initialState = {
    isAuth: false,
    data: {},
    isLoading: false,
    isLoaded: false,
    inputErrors: {},
}; // 초기 상태 정의


export const requestLogout = createAsyncThunk(
    "user/requestLogout",
    async (postData, {rejectWithValue}) => {
        try {
            const response = await ApiController.post(`/logout`, postData);
            sessionStorage.removeItem('token')
            return response.data;
        }
        catch (err) {
            if (!err.response) {
                throw err
            }

            return rejectWithValue(err.response.data)
        }
    },
)

export const requestLogin = createAsyncThunk(
    "user/requestLogin",
    async (postData, {rejectWithValue}) => {
        try {
            const response = await ApiController.post(`/login`, postData);
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

export const requestUser = createAsyncThunk(
    "user/requestUser",
    async (_, {rejectWithValue}) => {
        try {
            console.log('requestUser');
            const response = await ApiController.get(`/user`);
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


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.isAuth = false;
        },
        setIsLoaded: (state, action) => {
            state.isLoaded = action.payload;
        },
        setData: (state, action) => {

        }
    },
    extraReducers: builder => {
        builder.addCase(requestLogin.pending, (state) =>{
            state.inputErrors = initialState.inputErrors;
            state.isLoading = true;
        });
        builder.addCase(requestLogin.fulfilled, (state, { payload }) => {
            //로그인 성공
            sessionStorage.setItem('token', payload.token);
            state.data = payload.user;
            state.isAuth = true;
            state.isLoading = false;
        });
        builder.addCase(requestLogin.rejected, (state, {payload}) => {
            try {
                for (let index in payload.errors) {
                    state.inputErrors[index] = payload.errors[index][0]
                }
            }catch (e){}

            state.isAuth = false;
            state.isLoading = false;
            sessionStorage.removeItem('token');
        });


        builder.addCase(requestUser.pending, (state) =>{});
        builder.addCase(requestUser.fulfilled, (state, { payload }) => {
            // sessionStorage.setItem('token', payload.token);
            state.data = payload.user;
            state.isAuth = true;
            state.isLoading = false;
            state.isLoaded = true;
        });
        builder.addCase(requestUser.rejected, (state, {payload}) => {
            sessionStorage.removeItem('token');
            state.isAuth = false;
            state.isLoading = false;
            state.isLoaded = true;
        });




        builder.addCase(requestLogout.pending, (state) =>{
            state.data = initialState.data;
            state.isAuth = false;
            state.isLoading = false;
        });
        builder.addCase(requestLogout.fulfilled, (state, { payload }) => {});
        builder.addCase(requestLogout.rejected, (state, {payload}) => {});
    }
});

export const { setAuth, setData, setIsLoaded } = userSlice.actions; // 액션 생성함수
export default userSlice.reducer; // 리듀서