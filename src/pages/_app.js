import "@fortawesome/fontawesome-svg-core/styles.css"
import "../scss/style.default.scss"
import 'react-toastify/dist/ReactToastify.css';

import Layout from "../components/Layout"
import {SSRProvider} from "react-bootstrap"
import {wrapper} from "../store";
import {ToastContainer} from "react-toastify";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {requestUser, setIsLoaded} from "../store/modules/user";
import {SessionProvider, useSession} from "next-auth/react";

function App({Component, pageProps}) {

    return (
        <SessionProvider>
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
        </SessionProvider>
    )
}

export default wrapper.withRedux(App)