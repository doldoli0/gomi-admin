import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiController from "../../lib/ApiController";
import {toast} from "react-toastify";

const initialState = {
    data: [],
    check_before_fee:0,
    check_after_fee:0,
    status1:0,
    status2:0,
    isLoaded: false,
    isLoading: false,
    createModal: false,
    removeModal: false,
    inputs: {
        name: '',
        sales: '',
        before_fee: '',
        after_fee: '',
    },
    inputErrors: {

    },
}; // 초기 상태 정의

export const requestCreateCompany = createAsyncThunk(
    "companies/requestCreateCompany",
    async (postData, {rejectWithValue}) => {
        try {
            const response = await ApiController.post(`/company`, postData);
            toast.success('추가 되었습니다.');
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

export const requestGetCompanies = createAsyncThunk(
    "companies/requestGetCompanies",
    async (_, {rejectWithValue}) => {
        try {
            const response = await ApiController.get(`/companies`);
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err
            }

            return rejectWithValue(err.response.data)
        }

    },
);

export const requestUpdateCompany = createAsyncThunk(
    "companies/requestUpdateCompany",
    async (postData, {rejectWithValue}) => {
        try {
            const response = await ApiController.post(`/update/company`, postData);
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err
            }

            return rejectWithValue(err.response.data)
        }

    },
);

export const requestDeleteCompany = createAsyncThunk(
    "companies/requestDeleteCompany",
    async (postData, {rejectWithValue}) => {
        try {
            const response = await ApiController.post(`/delete/company`, postData);
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err
            }


            return rejectWithValue(err.response.data)
        }

    },
);

const companiesSlice = createSlice({
    name: 'companies',
    initialState,
    reducers: {
        changeInput: (state, action) => {
            state.inputs[action.payload.name] = action.payload.value
        },
        clearInputError: (state) => {
            state.inputs_error = initialState.inputErrors;
        },
        setCreateModal: (state, action) => {
            state.createModal = action.payload;
        },
        setRemoveModal: (state, action) => {
            state.removeModal = action.payload;
        },
        setIsLoaded: (state, action) => {
            state.isLoaded = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(requestCreateCompany.pending, (state) =>{
            state.isLoading = true;
            state.inputErrors = initialState.inputErrors;
        });
        builder.addCase(requestCreateCompany.fulfilled, (state, { payload }) => {
            state.data.unshift(payload.company);
            state.inputs = initialState.inputs;
            state.isLoading = false;
            state.createModal = false;
            state.inputErrors = initialState.inputErrors;
        });
        builder.addCase(requestCreateCompany.rejected, (state, {payload}) => {
            state.isLoading = false;
            for (let index in payload.errors) {
                state.inputErrors[index] = payload.errors[index][0]
            }
            // state.inputErrors = action.payload.errors;
        });

        builder.addCase(requestGetCompanies.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(requestGetCompanies.fulfilled, (state, { payload }) => {
            state.data = payload.companies.data;
            state.check_before_fee = payload.check_before_fee;
            state.check_after_fee = payload.check_after_fee;
            state.status1 = payload.status1;
            state.status2 = payload.status2;
            state.isLoading = false;
            state.isLoaded = true;
        });
        builder.addCase(requestGetCompanies.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(requestUpdateCompany.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(requestUpdateCompany.fulfilled, (state, { payload }) => {
            const index = state.data.findIndex((company) => company.id === payload.company.id);
            if (index >= 0) {
                state.data[index] = payload.company;
                toast.success('수정 되었습니다.');
            }
            state.isLoading = false;
        });
        builder.addCase(requestUpdateCompany.rejected, (state, { payload }) => {
            for (let index in payload.errors) {
                state.inputErrors[index] = payload.errors[index][0]
            }
            state.isLoading = false;
        });

        builder.addCase(requestDeleteCompany.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(requestDeleteCompany.fulfilled, (state, { payload }) => {
            state.data = state.data.filter((company) => company.id !== payload.company.id);
            // toast.error('삭제 되었습니다.');
            state.isLoading = false;
        });
        builder.addCase(requestDeleteCompany.rejected, (state, action) => {
            state.isLoading = false;
        });
    }
});

export const { changeInput, clearInputError, setCreateModal, setRemoveModal, setIsLoaded } = companiesSlice.actions; // 액션 생성함수
export default companiesSlice.reducer; // 리듀서