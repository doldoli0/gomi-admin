import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

export async function useAuth ({user, redirect}) {
    const {data, status} = useSession();
    const router = useRouter();

    if (status === 'loading')
        return true;
    else {
        let auth;
        if (status !== 'unauthenticated')
            auth = 'guest';
        else if (status === 'authenticated' && data.user.role === 'admin')
            auth = 'admin';
        else
            auth = 'user';

        if (user !== auth) {
            await router.replace(redirect);
        }
        else {
            return false;
        }
    }
}