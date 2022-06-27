import {useRouter} from "next/router";
import {useSelector} from "react-redux";

export async function useAuth ({auth, redirect}) {
    const router = useRouter();
    const user = useSelector((state)=>state.user);

    let userAuth
    if (user.isLoaded) {
        if (!user.isAuth) {
            userAuth = 'guest';
        }
        else if (user.isAuth && user.data.role === 'admin') {
            userAuth = 'admin';
        }
        else {
            userAuth = 'user';
        }

        if (auth.indexOf(userAuth)) {
            router.replace(redirect);
        }
    }
    else {
        return true;
    }
}