import "@fortawesome/fontawesome-svg-core/styles.css"
import "../scss/style.default.scss"
import 'react-toastify/dist/ReactToastify.css';

import Layout from "../components/Layout"
import {Container, SSRProvider} from "react-bootstrap"
import {wrapper} from "../store";
import {ToastContainer} from "react-toastify";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {requestUser, setIsLoaded} from "../store/modules/user";
import Preloader from "../components/Preloader";

function App({Component, pageProps}) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        if (!user.isLoaded) {
            if (sessionStorage.getItem('token')) {
                dispatch(requestUser());
            }
            else {
                dispatch(setIsLoaded(true));
            }
        }
    }, [user.isLoaded])

    if (!user.isLoaded) {
        return(
            <Preloader type="pulse" center />
        )
    }

    return (
        <SSRProvider>
            <Layout {...pageProps}>
                <Component {...pageProps} />
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover={false}
                    theme={'dark'}
                />
            </Layout>
        </SSRProvider>
    )
}

export default wrapper.withRedux(App)