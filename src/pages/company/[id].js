import {Container, Row, Col, Button, Card, Form, InputGroup, Spinner, ButtonGroup} from "react-bootstrap"
import { useRouter } from 'next/router';
import Avatar from "../../components/Avatar";
import {useCallback, useEffect, useState} from "react";
import {fromJS, Map} from "immutable";
import apiController from "../../lib/ApiController";
import {toast} from "react-toastify";
import GomiReply from "../../components/GomiReply";
import Preloader from "../../components/Preloader";
import LoadingButton from "../../components/LoadingButton";
import Icon from "../../components/Icon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faChartArea, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {useDispatch} from "react-redux";
import {setItem} from "../../store/modules/companies";
import {datetimeToLocalDatetime} from "../../lib/helper";



export const getServerSideProps = async () => {
    return {
        props: {
            title: "가맹점",
        },
    }
}

export default function CompanyDetail () {
    const [messageInput, setMessageInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [company, setCompany] = useState(Map({}));
    const [admins, setAdmins] = useState(Map({}))
    const [adminsIsLoading, setAdminsIsLoading] = useState(false);
    const [isSchedule, setIsSchedule] = useState(false);
    const dispatch = useDispatch();

    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        apiController.get(`${process.env.NEXT_PUBLIC_END_POINT}/api/company/${id}`)
            .then((response) => {
                setCompany(fromJS(response.data));
                if (response.data.schedule) {
                    setIsSchedule(true);
                }
                setIsLoaded(true);
            })
            .catch((error) => {
                if (error.response.status === 422) {
                    router.push('/');
                }
            })

        setAdminsIsLoading(true);
        apiController.get(`${process.env.NEXT_PUBLIC_END_POINT}/api/admins`)
            .then((response) => {
                setAdmins(fromJS(response.data));
            })
            .finally(() => {
                setAdminsIsLoading(false);
            })
    }, [])

    const onChangeCompany = useCallback((e) => {
        if (e.target.name === 'status') {
            setCompany(company.set(e.target.name, e.target.value * 1));
        }
        else if (e.target.name === 'schedule') {
            const date = new Date(e.target.value);
            setCompany(company.set(e.target.name, date));
        }
        else {
            setCompany(company.set(e.target.name, e.target.value));
        }
    }, [company]);

    const onSubmitCompany = (e) => {
        e.preventDefault()
        if ((company.get('sales') <= 0 || company.get('before_fee') <= 0 || company.get('after_fee') <= 0) && (company.get('status') !== 0 && company.get('status') !== 3)) {
            toast.error('비어있는 필드가 있으면 검토중/보류중 상태만 가능합니다.');
            return;
        }


        setIsLoading(true);
        apiController.post(`${process.env.NEXT_PUBLIC_END_POINT}/api/update/company`, company)
            .then((response) => {
                try {
                    setCompany(company.set('comments', fromJS(response.data.company.comments)))
                } catch (e){}

                dispatch(setItem(response.data.company));
            })
            .catch((error) => {

            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const onChangeMessage = (e) => {
        setMessageInput(e.target.value);
    }

    const onSubmitMessage = (e) => {
        e.preventDefault();

        setIsLoading(true);
        const postData = {id: company.get('id'), 'comment': messageInput};
        apiController.post(`${process.env.NEXT_PUBLIC_END_POINT}/api/company/comment`, postData)
            .then((response) => {
                setMessageInput('');
                setCompany(company.update('comments', comments => comments.unshift(fromJS(response.data.comment))))
            })
            .catch((error) => {

            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const handleSchedule = (bool) => {
        if (bool) {
            //만들기
            // const now = new Date().toISOString();
            setIsSchedule(true);
            setCompany(company.set('schedule', null));
        }
        else {
            setCompany(company.set('schedule_comment', ''));
            setIsSchedule(false);
        }
    }

    return (
        <Container fluid className="px-lg-4 px-xl-5">
            <section>
                {isLoaded?
                    <Row>
                        <Col lg={4}>
                            <div className="d-grid gap-2 mb-3">
                                <ButtonGroup size="lg">
                                    <Link href={'/companies'}>
                                        <Button variant="outline-primary">
                                            <FontAwesomeIcon icon={faArrowLeft}/>{' '}뒤로 가기
                                        </Button>
                                    </Link>
                                    <Button variant={'outline-info'} as={'a'} href={`/cal?before_fee=${company.get('before_fee')}&after_fee=${company.get('after_fee')}&sales=${company.get('sales')}`} target={'_blank'}>
                                        <FontAwesomeIcon icon={faChartArea}/>{' '}수수료 차트
                                    </Button>
                                </ButtonGroup>
                            </div>
                            <Card className="mb-4">
                                <Form onSubmit={onSubmitCompany}>
                                    <Card.Header>
                                        <h4 className="card-heading">가맹점 정보</h4>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="mb-3">
                                            <Form.Label>가맹점</Form.Label>
                                            <Form.Control placeholder="" type="text" required name={'name'} value={company.get('name') || ''} onChange={onChangeCompany} disabled={isLoading}/>
                                        </div>
                                        <div className="mb-3">
                                            <Form.Label>연 매출</Form.Label>
                                            <InputGroup>
                                                <Form.Control placeholder="" type="number" required name={'sales'} value={company.get('sales') || ''} onChange={onChangeCompany} disabled={isLoading}/>
                                                <InputGroup.Text>억</InputGroup.Text>
                                            </InputGroup>
                                        </div>
                                        <div className="mb-3">
                                            <Form.Label>담당자 연락처</Form.Label>
                                            <Form.Control placeholder="" type="text" required name={'number'} value={company.get('number') || ''} onChange={onChangeCompany} disabled={isLoading}/>
                                        </div>
                                        <div className="mb-3">
                                            <Form.Label>기존 수수료</Form.Label>
                                            <InputGroup>
                                                <Form.Control placeholder="" type="number" step={0.1} name={'before_fee'} value={company.get('before_fee') || ''} onChange={onChangeCompany} disabled={isLoading}/>
                                                <InputGroup.Text>%</InputGroup.Text>
                                            </InputGroup>
                                        </div>
                                        <div className={"mb-3"}>
                                            <Form.Label>확정 수수료</Form.Label>
                                            <InputGroup>
                                                <Form.Control placeholder="" type="number" step={0.1} name={'after_fee'} value={company.get('after_fee') || ''} onChange={onChangeCompany} disabled={isLoading}/>
                                                <InputGroup.Text>%</InputGroup.Text>
                                            </InputGroup>
                                        </div>
                                        <div className="mb-3">
                                            <Form.Label>다음 일정</Form.Label>
                                            {isSchedule?
                                                <>
                                                    <InputGroup>
                                                        {/*안됨*/}
                                                        <Form.Control type={'datetime-local'} value={datetimeToLocalDatetime(company.get('schedule')) || ''} name={'schedule'} onChange={onChangeCompany} disabled={isLoading || !isSchedule} required={isSchedule}/>
                                                        <Button variant={'secondary'} onClick={() => handleSchedule(false)}>없음</Button>
                                                    </InputGroup>
                                                    <Form.Control value={company.get('schedule_comment') || ''} name={'schedule_comment'} onChange={onChangeCompany} disabled={isLoading || !isSchedule} placeholder={'다음 일정 내용'} required={isSchedule}/>
                                                </>
                                                :
                                                <InputGroup>
                                                    <Button variant={'primary'} onClick={() => handleSchedule(true)}>일정 만들기</Button>
                                                </InputGroup>
                                            }
                                        </div>
                                        <div className={"mb-3"}>
                                            <Form.Label>
                                                <strong>담당 사원</strong>
                                            </Form.Label>
                                            {adminsIsLoading?
                                                <Preloader type={"wandering-cubes"} variant={'warning'}/>
                                                    :
                                                    <Form.Control
                                                        name="user_id"
                                                        as={"select"}
                                                        className="form-select"
                                                        onChange={onChangeCompany}
                                                        style={{fontWeight:"bold"}}
                                                        // onBlur={handleBlur}
                                                        // isValid={touched.country && !errors.country}
                                                        // isInvalid={!!errors.country}
                                                        value={company.get('user_id') || ''}
                                                        disabled={isLoading}
                                                    >
                                                        <option value={''}>없음</option>
                                                        {admins.map((admin, index) => (
                                                            <option value={admin.get('id')} key={index}>{admin.get('name')}</option>
                                                        ))}
                                                    </Form.Control>
                                                }
                                        </div>
                                        <div className={"mb-3"}>
                                            <Form.Label>진행 상태</Form.Label>
                                            <Form.Control
                                                name="status"
                                                as={"select"}
                                                className="form-select"
                                                onChange={onChangeCompany}
                                                // onBlur={handleBlur}
                                                // isValid={touched.country && !errors.country}
                                                // isInvalid={!!errors.country}
                                                value={company.get('status')}
                                                disabled={isLoading}
                                            >
                                                <option value={0}>검토중</option>
                                                <option value={1}>계약 대기</option>
                                                <option value={2}>계약 완료</option>
                                                <option value={3}>보류중</option>
                                            </Form.Control>
                                        </div>
                                    </Card.Body>
                                    <Card.Footer className="text-end">
                                        {/*<Button type='submit' variant="primary">저장</Button>*/}
                                        <LoadingButton
                                            label="수정"
                                            actionType="expand-right"
                                            className="mb-1 me-1"
                                            loading={isLoading}
                                        />
                                    </Card.Footer>
                                </Form>
                            </Card>
                        </Col>
                        <Col lg={8}>
                            <GomiReply replies={company.get('comments').toJS()} messageInput={messageInput} onChangeMessage={onChangeMessage} onSubmitMessage={onSubmitMessage} isLoading={isLoading}/>
                        </Col>
                    </Row>
                    :
                    <Row>
                        <Col lg={12}>
                            <div className="d-flex justify-content-center pt-5 pb-5">
                                <Preloader type={"wandering-cubes"} variant={'warning'} center/>
                            </div>
                        </Col>
                    </Row>
                }
            </section>
        </Container>
    )
}