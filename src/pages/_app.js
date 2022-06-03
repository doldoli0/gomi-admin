import "@fortawesome/fontawesome-svg-core/styles.css"
import "../scss/style.default.scss"
import Layout from "../components/Layout"
import { SSRProvider } from "react-bootstrap"
import {wrapper} from "../store";

function App({ Component, pageProps }) {
  return (
    <SSRProvider>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </SSRProvider>
  )
}

export default wrapper.withRedux(App)