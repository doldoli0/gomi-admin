import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
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

        if (auth !== userAuth) {
            router.replace(redirect);
        }
    }
}