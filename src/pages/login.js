import Link from "next/link"
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap"
import Image from "../components/CustomImage"
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {Map} from "immutable";
import {requestLogin} from "../store/modules/user";
import LoadingButton from "../components/LoadingButton";
import {wrapper} from "../store";
import apiController from "../lib/ApiController";
import {getSession, signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";

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

export default function login() {
    const [loginInputs, setLoginInputs] = useState(Map({email:'', password:'', remember:false}));
    const [errorMessage, setErrorMessage] = useState(false);
    const dispatch = useDispatch();
    const emailRef = useRef();
    const passwordRef = useRef();
    const router = useRouter();
    const user = useSelector((state)=>state.user);

    if (user.isAuth && user.data.role === 'admin') {
        router.replace('/');
    }

    useEffect(() => {
        if (emailRef.current && passwordRef.current) {
            if (localStorage.getItem('email')) {
                passwordRef.current?.focus();
                setLoginInputs(loginInputs.set('email', localStorage.getItem('email')).set('remember', true));
            }
            else {
                emailRef.current?.focus();
            }
        }
    }, []);

    const onChangeInput = (e) => {
        setLoginInputs(loginInputs.set(e.target.name, e.target.value));
        if (e.target.name === 'remember') {
            setLoginInputs(loginInputs.set(e.target.name, e.target.checked));
        }
    }

    const onSubmitLogin = async (e) => {
        e.preventDefault();

        // setIsLoading(true);
        // const response = await signIn("email-password-credential", {
        //     email: loginInputs.get('email'),
        //     password: loginInputs.get('password'),
        //     redirect: false,
        //     callbackUrl:'/'
        // });
        // setIsLoading(false);
        // setErrorMessage(response.error);
        // await router.push(response.url)
        // if (status === 'authenticated')
        //     router.push('/');

        dispatch(requestLogin(loginInputs.toJS()));
    }


    return (
        <Container fluid className="px-0 overflow-hidden">
            <Row className="gx-0 min-vh-100">
                <Col
                    md={9}
                    lg={6}
                    xl={4}
                    className="px-5 d-flex align-items-center shadow"
                >
                    <div className="w-100 py-5">
                        <div className="text-center">
                            <img
                                className="img-fluid mb-4"
                                src="img/brand/brand-1.svg"
                                alt="..."
                                style={{ maxWidth: "6rem" }}
                            />
                            <h1 className="h4 text-uppercase mb-5">Welcome Back</h1>
                        </div>
                        <Form onSubmit={onSubmitLogin}>
                            <div className="mb-3">
                                <Form.Label className="form-label">Email Address</Form.Label>
                                <Form.Control
                                    ref={emailRef}
                                    required
                                    name="email"
                                    type="email"
                                    autoComplete="off"
                                    value={loginInputs.get('email')}
                                    onChange={onChangeInput}
                                    disabled={user.isLoading}
                                    isInvalid={user.inputErrors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {user.inputErrors.email}
                                </Form.Control.Feedback>
                            </div>
                            <div className="mb-4">
                                <Row>
                                    <Col>
                                        <Form.Label className="form-label">Password</Form.Label>
                                    </Col>
                                    {/*<Col xs="auto">*/}
                                    {/*    <a className="form-text small text-muted" href="#">*/}
                                    {/*        Forgot your password?*/}
                                    {/*    </a>*/}
                                    {/*</Col>*/}
                                </Row>
                                <Form.Control
                                    ref={passwordRef}
                                    name="password"
                                    type="password"
                                    value={loginInputs.get('password')}
                                    onChange={onChangeInput}
                                    required
                                    disabled={user.isLoading}
                                />
                            </div>
                            <Form.Check
                                type={'switch'}
                                className="mb-4"
                                name={'remember'}
                                label="EMail 기억"
                                checked={loginInputs.get('remember')}
                                disabled={user.isLoading}
                                onChange={onChangeInput}
                            />
                            <div className="d-grid mb-5">
                                <LoadingButton
                                    label="Sign in"
                                    actionType="expand-right"
                                    className="mb-1 me-1"
                                    loading={user.isLoading}
                                />
                            </div>
                            {/*<p className="text-sm text-muted text-center">*/}
                            {/*    Don't have an account yet?{" "}*/}
                            {/*    <Button onClick={onTest}>Register</Button>*/}
                            {/*</p>*/}
                        </Form>
                    </div>
                </Col>
                <Col md={3} lg={6} xl={8} className="d-none d-md-block">
                    <div className="bg-cover h-100 me-n3 position-relative">
                        <Image
                            src="/img/photos/victor-ene-1301123-unsplash.jpg"
                            alt="..."
                            layout="fill"
                            objectFit="cover"
                            sizes="75vw"
                            priority
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    )
}