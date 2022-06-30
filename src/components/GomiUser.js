import {Button, Card, Col, Form, FormFloating, Row} from "react-bootstrap";
import Preloader from "./Preloader";
import LoadingButton from "./LoadingButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";

const GomiUser = ({user, onSubmitUpdateUser, isLoading}) => {

    const role = (role) => {
        if (user.role === 'admin') {
            return '관리자';
        }
        else if (user.role === 'seller') {
            return '영업사원';
        }
        else {
            return '알수없음';
        }
    }

    return (
        <Card>
            <Card.Header>
                <h3 className={'card-heading'}>내 정보 수정</h3>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmitUpdateUser}>
                    <Row className={'mb-1'}>
                        <Col lg={3}>
                            <Form.Label className="text-uppercase" htmlFor="email">
                                이메일
                            </Form.Label>
                        </Col>
                        <Col lg={9}>
                            <label>{user.email}</label>
                            {/*<Form.Control*/}
                            {/*    id="email"*/}
                            {/*    name="email"*/}
                            {/*    type="email"*/}
                            {/*    placeholder="Email Address"*/}
                            {/*    className="form-control"*/}
                            {/*    defaultValue={user.email}*/}
                            {/*    disabled*/}
                            {/*    required*/}
                            {/*/>*/}
                            {/*<Form.Text className="text-muted ms-3">*/}
                            {/*    이메일은 변경 불가능한 정보입니다.*/}
                            {/*</Form.Text>*/}
                        </Col>
                    </Row>
                    <Row className={'mb-1'}>
                        <Col lg={3}>
                            <Form.Label className="text-uppercase">
                                이름
                            </Form.Label>
                        </Col>
                        <Col lg={9}>
                            <label>{user.name}</label>
                        </Col>
                    </Row>
                    <Row className={'mb-1'}>
                        <Col lg={3}>
                            <Form.Label className="text-uppercase">
                                권한
                            </Form.Label>
                        </Col>
                        <Col lg={9}>
                            <label>{role(user.role)}</label>
                        </Col>
                    </Row>
                    <Row className={'mb-1'}>
                        <Col lg={3}>
                            <Form.Label className="text-uppercase" htmlFor="password">
                                비밀번호
                            </Form.Label>
                        </Col>
                        <Col lg={9}>
                            <Form.Control
                                disabled={isLoading}
                                id="password"
                                name="password"
                                type="password"
                                placeholder="비밀번호"
                                className="form-control"
                                required
                            />
                        </Col>
                    </Row>
                    <Row className={'mb-1'}>
                        <Col lg={3}>
                            {/*<Form.Label className="text-uppercase" htmlFor="password_confirmation">*/}
                                {/*비밀번호 확인*/}
                            {/*</Form.Label>*/}
                        </Col>
                        <Col lg={9}>
                            <Form.Control
                                disabled={isLoading}
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                placeholder="비밀번호 확인"
                                className="form-control"
                                required
                            />
                            <Form.Text className="text-muted ms-3">
                                *정보 수정시 모든 기기에서 로그아웃 됩니다.
                            </Form.Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} align={'right'}>
                            <LoadingButton
                                label={'수정'}
                                actionType="expand-right"
                                className="mb-1 me-1"
                                loading={isLoading}
                            />
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default GomiUser;