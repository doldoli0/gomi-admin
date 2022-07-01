import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiController from "../../lib/ApiController";
import moment from "moment";

const initialState = {isLoaded: false, isLoading:false, data:[]}// 초기 상태 정의


export const requestCheckMessage = createAsyncThunk(
    "messages/requestCheckMessage",
    async (postData, {rejectWithValue}) => {
        try {
            const response = await ApiController.post(`/update/user/message`, postData);
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


export const requestGetMessages = createAsyncThunk(
    "messages/requestMessages",
    async (_, {rejectWithValue}) => {
        try {
            const response = await ApiController.get(`/alert/messages`);
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


const messagesSlice = createSlice({
    name: 'messages',
    initialState: initialState,
    reducers: {
        removeMessage: (state, action) => {
            if (state.isLoaded) {
                const index = state.data.findIndex(message => message.id === action.payload.id);
                if (index >= 0) {
                    state.data.splice(index, 1);
                }
            }
        },
        createMessage: (state, {payload}) => {
            if (state.isLoaded) {
                state.data.push(payload.message);
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(requestGetMessages.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(requestGetMessages.fulfilled, (state, { payload }) => {
            state.data = payload;
            state.isLoading = false;
            state.isLoaded = true;
        });
        builder.addCase(requestGetMessages.rejected, (state, {payload}) => {
            state.isLoading = false;
        });
    }
});

export const { removeMessage, createMessage } = messagesSlice.actions; // 액션 생성함수
export default messagesSlice.reducer; // 리듀서