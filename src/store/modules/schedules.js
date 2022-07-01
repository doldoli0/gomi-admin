import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiController from "../../lib/ApiController";
import moment from "moment";

const initialState = {isLoaded:false, isLoading:false, data:[], calendars:[], showModal:false, inputErrors:{}}// 초기 상태 정의


export const requestGetSchedules = createAsyncThunk(
    "schedules/requestGetSchedules",
    async (_, {rejectWithValue}) => {
        try {
            const response = await ApiController.get(`/schedules`);
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

export const requestCreateSchedule = createAsyncThunk(
    "schedules/requestCreateSchedule",
    async (postData, {rejectWithValue}) => {
        try {
            const response = await ApiController.post(`/schedule`, postData);
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

export const requestUpdateSchedule = createAsyncThunk(
    "schedules/requestUpdateSchedule",
    async (postData, {rejectWithValue}) => {
        try {
            const response = await ApiController.post(`/update/schedule`, postData);
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

export const requestDeleteSchedule = createAsyncThunk(
    "schedules/requestDeleteSchedule",
    async (postData, {rejectWithValue}) => {
        try {
            const response = await ApiController.post(`/delete/schedule`, postData);
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


const schedulesSlice = createSlice({
    name: 'schedules',
    initialState: initialState,
    reducers: {
        setShowModal: (state, action) => {
            state.showModal = action.payload;
        },
        removeSchedule: (state, {payload}) => {
            if (state.isLoaded) {
                const index = state.data.findIndex(schedule => schedule.id === payload.id);
                if (index >= 0) {
                    state.data.splice(index, 1);
                }
            }
        },
        clearInputErrors: (state, action) => {
            state.inputErrors = initialState.inputErrors;
        },
        createSchedule: (state, {payload}) => {
            if (state.isLoaded) {
                const start = moment(payload.schedule.start_at);
                const index = state.data.findIndex(item => moment(item.start_at).isAfter(start));
                if (index >= 0) {
                    state.data.splice(index, 0, payload.schedule)
                }
                else {
                    state.data.push(payload.schedule)
                }
            }
        },
        updateSchedule: (state, {payload}) => {
            if (state.isLoaded) {
                const index = state.data.findIndex(schedule => schedule.id === payload.schedule.id);
                if (index >= 0) {
                    state.data[index] = payload.schedule;
                    state.data.sort((a,b) => {
                        const startA = moment(a.start_at);
                        const startB = moment(b.start_at);
                        if (startA.isAfter(startB)) {
                            return 1;
                        }
                        else if (startB.isAfter(startA)) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    })
                }
            }
        },
    },
    extraReducers: builder => {
        builder.addCase(requestGetSchedules.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(requestGetSchedules.fulfilled, (state, { payload }) => {
            state.calendars = payload.calendars;
            state.data = payload.schedules;
            state.isLoading = false;
            state.isLoaded = true;
        });
        builder.addCase(requestGetSchedules.rejected, (state, {payload}) => {
            state.isLoading = false;
        });

        builder.addCase(requestCreateSchedule.pending, (state) =>{
            state.isLoading = true;
            state.inputErrors = initialState.inputErrors;
        });
        builder.addCase(requestCreateSchedule.fulfilled, (state, { payload }) => {
            const start = moment(payload.schedule.start_at);
            const index = state.data.findIndex(item => moment(item.start_at).isAfter(start));
            if (index >= 0) {
                state.data.splice(index, 0, payload.schedule)
            }
            else {
                state.data.push(payload.schedule)
            }

            state.showModal = false;
            state.isLoading = false;
        });
        builder.addCase(requestCreateSchedule.rejected, (state, {payload}) => {
            for (let index in payload.errors) {
                state.inputErrors[index] = payload.errors[index][0]
            }
            state.isLoading = false;
        });

        builder.addCase(requestUpdateSchedule.pending, (state) =>{
            state.isLoading = true;
            state.inputErrors = initialState.inputErrors;
        });
        builder.addCase(requestUpdateSchedule.fulfilled, (state, { payload }) => {
            const index = state.data.findIndex(schedule => schedule.id === payload.schedule.id);
            if (index >= 0) {
                state.data[index] = payload.schedule;
            }
            state.data.sort((a,b) => {
                const startA = moment(a.start_at);
                const startB = moment(b.start_at);
                if (startA.isAfter(startB)) {
                    return 1;
                }
                else if (startB.isAfter(startA)) {
                    return -1;
                }
                else {
                    return 0;
                }
            })
            state.showModal = false;
            state.isLoading = false;
        });
        builder.addCase(requestUpdateSchedule.rejected, (state, {payload}) => {
            for (let index in payload.errors) {
                state.inputErrors[index] = payload.errors[index][0]
            }
            state.isLoading = false;
        });

        builder.addCase(requestDeleteSchedule.pending, (state) =>{
        });
        builder.addCase(requestDeleteSchedule.fulfilled, (state, { payload }) => {
            const index = state.data.findIndex(schedule => schedule.id === payload.schedule.id);
            if (index >= 0) {
                state.data.splice(index, 1);
            }
        });
        builder.addCase(requestDeleteSchedule.rejected, (state, {payload}) => {
        });
    }
});

export const { setShowModal, removeSchedule, clearInputErrors, updateSchedule, createSchedule } = schedulesSlice.actions; // 액션 생성함수
export default schedulesSlice.reducer; // 리듀서