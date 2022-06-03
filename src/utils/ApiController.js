import axios from "axios";

const url = process.env.NEXT_PUBLIC_END_POINT;
const instance = axios.create({
    withCredentials: true,
    baseURL: url + '/api',
    timeout: 10000,
    headers: {"Access-Control-Allow-Origin": "*"}
});

/*
    1. 요청 인터셉터를 작성합니다.
    2개의 콜백 함수를 받습니다.

    1) 요청 바로 직전 - 인자값: axios config
    2) 요청 에러 - 인자값: error
*/
instance.interceptors.request.use(
    function (config) {
        // 요청 바로 직전
        // axios 설정값에 대해 작성합니다.
        // console.log(localStorage.getItem('token'))
        if (sessionStorage.getItem('token')) {
            config.headers = { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        }
        return config;
    },
    function (error) {
        // 요청 에러 처리를 작성합니다.
        return Promise.reject(error);
    }
);



/*
    2. 응답 인터셉터를 작성합니다.
    2개의 콜백 함수를 받습니다.

    1) 응답 정성 - 인자값: http response
    2) 응답 에러 - 인자값: http error
*/
instance.interceptors.response.use(response => response, async err => {
    // console.log('res', err.response?.status);
    const status = err.response?.status;

    if (status === 419) {
        // Refresh our session token
        await instance.get(url + '/sanctum/csrf-cookie')

        // Return a new request using the original request's configuration
        return instance(err.response.config)
    }
    else if (status === 401) {
        return Promise.reject(err);
    }
    else {
        return Promise.reject(err);
    }
})


// instance.interceptors.response.use(
//     function (response) {
//         /*
//             http status가 200인 경우
//             응답 바로 직전에 대해 작성합니다.
//             .then() 으로 이어집니다.
//         */
//         return response;
//     },
//
//     function (error) {
//         /*
//             http status가 200이 아닌 경우
//             응답 에러 처리를 작성합니다.
//             .catch() 으로 이어집니다.
//         */
//         if (error.response.status === 419) {
//
//         }
//         return Promise.reject(error);
//     }
// );

// 생성한 인스턴스를 익스포트 합니다.
export default instance;