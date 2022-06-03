import {Button, Form, InputGroup, Modal, Spinner} from "react-bootstrap";

const GomiCreateCompanyModal = ({show, handleClose, onChangeInput, onSubmitAddCompany, companies}) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>신규 회사 추가</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="company">
                        <Form.Label>회사명*</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="회사명"
                            name={'name'}
                            value={companies.inputs.name}
                            onChange={onChangeInput}
                            disabled={companies.isLoading}
                            isInvalid={companies.input_errors.name}
                            autoFocus
                        />
                        <Form.Control.Feedback type="invalid">
                            {companies.input_errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="sales">
                        <Form.Label>연 매출*</Form.Label>
                        <Form.Control
                            type="number"
                            step={1}
                            placeholder="30"
                            name={'sales'}
                            value={companies.inputs.sales}
                            onChange={onChangeInput}
                            disabled={companies.isLoading}
                            isInvalid={companies.input_errors.sales}
                        />
                        <Form.Control.Feedback type="invalid">
                            {companies.input_errors.sales}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="before_fee">
                        <Form.Label>이전 수수료</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                step={0.01}
                                placeholder="3.0"
                                name={'before_fee'}
                                value={companies.inputs.before_fee}
                                onChange={onChangeInput}
                                disabled={companies.isLoading}
                                isInvalid={companies.input_errors.before_fee}
                            />
                            <InputGroup.Text>%</InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                                {companies.input_errors.before_fee}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="after_fee">
                        <Form.Label>확정 수수료</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                step={0.01}
                                placeholder="3.0"
                                name={'after_fee'}
                                value={companies.inputs.after_fee}
                                onChange={onChangeInput}
                                disabled={companies.isLoading}
                                isInvalid={companies.input_errors.after_fee}
                            />
                            <InputGroup.Text>%</InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                                {companies.input_errors.after_fee}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="memo">
                        <Form.Label>메모</Form.Label>
                        <Form.Control as="textarea" rows={10} disabled={companies.isLoading}
                                      name={'memo'}
                                      value={companies.inputs.memo}
                                      onChange={onChangeInput}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={companies.isLoading}>
                    닫기
                </Button>
                <Button variant="primary" onClick={onSubmitAddCompany} disabled={companies.isLoading}>
                    {companies.isLoading?
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        :
                        '추가'
                    }
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default GomiCreateCompanyModal;