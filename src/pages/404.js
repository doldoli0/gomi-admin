import {wrapper} from "../store";
import {useRouter} from "next/router";
import Style from "../styles/404.module.css";
import Link from "next/link";

export const getStaticProps = wrapper.getStaticProps((store) => () => {
    return {
        props: {
            title: "Login",
            pageHolderClass: "p-0",
            hideHeader: true,
            hideFooter: true,
            hideSidebar: true,
        },
    }
});

export default function Custom404() {

    return (
        <div className={Style.root}>
            <div className={Style.body}>
                <h1>404</h1>
                <div className={Style.cloak__wrapper}>
                    <div className={Style.cloak__container}>
                        <div className={Style.cloak}></div>
                    </div>
                </div>
                <div className={Style.info}>
                    <h2>페이지를 찾을수 없습니다.</h2>
                    <p>Page not found</p><Link href="/">Home</Link>
                </div>
            </div>
        </div>
    )
}
