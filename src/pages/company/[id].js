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


export const getServerSideProps = async () => {
    return {
        props: {
            title: "디테일",
        },
    }
}

export default function CompanyDetail () {
    const [messageInput, setMessageInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [company, setCompany] = useState(Map({}));

    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        apiController.get(`${process.env.NEXT_PUBLIC_END_POINT}/api/company/${id}`)
            .then((response) => {
                setCompany(fromJS(response.data));
                setIsLoaded(true);
            })
            .catch((error) => {
                if (error.response.status === 422) {
                    router.push('/');
                }
            })
    }, [])

    const onChangeCompany = useCallback((e) => {
        setCompany(company.set(e.target.name, e.target.value));
    }, [company]);

    const onSubmitCompany = (e) => {
        e.preventDefault()
        if ((company.get('sales') <= 0 || company.get('before_fee') <= 0 || company.get('after_fee') <= 0) && company.get('status') !== 0) {
            toast.error('비어있는 필드가 있으면 검토중 상태만 가능합니다.');
            return;
        }


        setIsLoading(true);
        apiController.post(`${process.env.NEXT_PUBLIC_END_POINT}/api/update/company`, company)
            .then((response) => {

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
                setCompany(company.update('comments', comments => comments.unshift(fromJS(response.data.comment))))
                console.log('추가', response.data.comments);
            })
            .catch((error) => {

            })
            .finally(() => {
                setIsLoading(false);
            })
    }



    const replies = [
            {
                "name": "name",
                "time": "10 mins ago",
                "text": "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections",
            },
            {
                "name": "name",
                "time": "12 mins ago",
                "text": "Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame."
            },
            {
                "name": "name",
                "time": "34 mins ago",
                "text": "He must have tried it a hundred times, shut his eyes so that he wouldn't have to look at the floundering legs, and only stopped when he began to feel a mild, dull pain there that he had never felt before.",
            }
        ]


    return (
        <Container fluid className="px-lg-4 px-xl-5">
            <section>
                {isLoaded?
                    <Row>
                        <Col lg={4}>
                            <div className="d-grid gap-2 mb-3">
                                <ButtonGroup size="lg">
                                    <Link href={'/'}>
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
                                        <h4 className="card-heading">회사 정보</h4>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="mb-3">
                                            <Form.Label>회사명</Form.Label>
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
                                                <option value="0">검토중</option>
                                                <option value="1">계약 대기</option>
                                                <option value="2">계약 완료</option>
                                                <option value="3">보류중</option>
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