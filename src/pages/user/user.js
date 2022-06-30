import {Card, Col, Container, Form, Row} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import GomiUser from "../../components/GomiUser";
import GomiSession from "../../components/GomiSession";
import {useCallback, useEffect, useState} from "react";
import {fromJS, List, Map} from "immutable";
import apiController from "../../lib/ApiController";
import {logout} from "../../store/modules/user";
import {useRouter} from "next/router";
import {toast} from "react-toastify";

export default function User() {
    const user = useSelector(state => state.user.data)
    const [sessions, setSessions] = useState(List([]));
    const [currentSession, setCurrentSession] = useState(Map({}));
    const [isSessionsLoading, setIsSessionsLoading] = useState(false);
    const [isUserLoading, setIsUserLoading] = useState(false);

    useEffect(() => {
        setIsSessionsLoading(true);
        apiController.get('/tokens')
            .then((response) => {
                setSessions(fromJS(response.data.tokens));
                setCurrentSession(fromJS(response.data.current_token));
            })
            .finally(() => {
                setIsSessionsLoading(false);
            })
    }, [])

    const dispatch = useDispatch();
    const router = useRouter();
    const onSubmitUpdateUser = useCallback((e) => {
        e.preventDefault();
        if (e.target.password.value !== e.target.password_confirmation.value) {
            toast.error('비밀번호 확인이 일치하지 않습니다.')
            return;
        }

        const postData = {
            password:e.target.password.value,
            password_confirmation:e.target.password_confirmation.value
        }

        setIsUserLoading(true);
        apiController.post('/update/user', postData)
            .then((response=>{
                dispatch(logout());
                router.replace('/login');
            }))
            .finally(() => {
                setIsUserLoading(false);
            })

    }, []);

    const onClickDeleteToken = useCallback((index) => {
        setIsSessionsLoading(true);
        const token = sessions.get(index);
        apiController.post('/delete/token', {id:token.get('id')})
            .then((response=>{
                setSessions(sessions.splice(index, 1));
            }))
            .finally(() => {
                setIsSessionsLoading(false);
            })
    }, [sessions]);


    return (
        <Container fluid className="px-lg-4 px-xl-5">
            <section className="mb-3 mb-lg-5">
                <Row>
                    <Col lg={4}>
                        <GomiUser user={user} onSubmitUpdateUser={onSubmitUpdateUser} isLoading={isUserLoading}/>
                    </Col>
                    <Col lg={8}>
                        <GomiSession sessions={sessions} isLoading={isSessionsLoading} currentSessions={currentSession} onClickDeleteToken={onClickDeleteToken}/>
                    </Col>
                </Row>
            </section>
        </Container>
    )
}