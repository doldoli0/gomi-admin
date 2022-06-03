import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiController from "../../utils/ApiController";

const initialState = {
    data: [],
    isLoaded: false,
    isLoading: false,
    createModal: false,
    removeModal: false,
    inputs: {
        name: '',
        sales: '',
        before_fee: '',
        after_fee: '',
        memo: '',
    },
    input_errors: {

    },
}; // 초기 상태 정의

export const requestCreateCompany = createAsyncThunk(
    "companies/requestCreateCompany",
    async (postData, {rejectWithValue}) => {
        try {
            const response = await ApiController.post(`/company`, postData);
            // toast.success('추가 되었습니다.');
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
            state.inputs_error = initialState.input_errors;
        },
        setCreateModal: (state, action) => {
            state.createModal = action.payload;
        },
        setRemoveModal: (state, action) => {
            state.removeModal = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(requestCreateCompany.pending, (state) =>{
            state.isLoading = true;
            state.input_errors = initialState.input_errors;
        });
        builder.addCase(requestCreateCompany.fulfilled, (state, { payload }) => {
            state.data.unshift(payload.company);
            state.inputs = initialState.inputs;
            state.isLoading = false;
            state.createModal = false;
            state.input_errors = initialState.input_errors;
        });
        builder.addCase(requestCreateCompany.rejected, (state, {payload}) => {
            state.isLoading = false;
            for (let index in payload.errors) {
                state.input_errors[index] = payload.errors[index][0]
            }
            // state.input_errors = action.payload.errors;
        });

        builder.addCase(requestGetCompanies.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(requestGetCompanies.fulfilled, (state, { payload }) => {
            state.data = payload.data;
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
                // toast.success('수정 되었습니다.');
            }
            state.isLoading = false;
        });
        builder.addCase(requestUpdateCompany.rejected, (state, { payload }) => {
            for (let index in payload.errors) {
                state.input_errors[index] = payload.errors[index][0]
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

export const { changeInput, clearInputError, setCreateModal, setRemoveModal } = companiesSlice.actions; // 액션 생성함수
export default companiesSlice.reducer; // 리듀서