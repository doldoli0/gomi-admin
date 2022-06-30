import Pusher from "pusher-js";
import Echo from "laravel-echo";

const options = {
    broadcaster: "pusher",
    key: process.env.NEXT_PUSHER_KEY,
    cluster: "ap3",
    forceTLS: true,
    encrypted: false,
    //authEndpoint is your apiUrl + /broadcasting/auth
    authEndpoint: `${process.env.NEXT_PUBLIC_END_POINT}/broadcasting/auth`,
    // As I'm using JWT tokens, I need to manually set up the headers.
    auth: {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            Accept: "application/json"
        }
    }
};

export const echo = new Echo(options);