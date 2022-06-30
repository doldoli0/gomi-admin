import {Button, Form, InputGroup, Modal, Spinner} from "react-bootstrap";

const GomiCreateCompanyModal = ({show, handleClose, onChangeInput, onSubmitAddCompany, companies}) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>신규 가맹점 추가</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="company">
                        <Form.Label>가맹점*</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="가맹점"
                            name={'name'}
                            value={companies.inputs.name}
                            onChange={onChangeInput}
                            disabled={companies.isLoading}
                            isInvalid={companies.inputErrors.name}
                            autoComplete="off"
                            autoFocus
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {companies.inputErrors.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="sales">
                        <Form.Label>연 매출*</Form.Label>
                        <Form.Control
                            type="number"
                            step={1}
                            placeholder="30"
                            name={'sales'}
                            value={companies.inputs.sales || ''}
                            onChange={onChangeInput}
                            disabled={companies.isLoading}
                            isInvalid={companies.inputErrors.sales}
                            autoComplete="off"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {companies.inputErrors.sales}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="number">
                        <Form.Label>담당자 연락처 *</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="01000000000"
                                name={'number'}
                                value={companies.inputs.number || ''}
                                onChange={onChangeInput}
                                disabled={companies.isLoading}
                                isInvalid={companies.inputErrors.number}
                                autoComplete="off"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {companies.inputErrors.number}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="before_fee">
                        <Form.Label>이전 수수료</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                step={0.001}
                                placeholder="3.0"
                                name={'before_fee'}
                                value={companies.inputs.before_fee || ''}
                                onChange={onChangeInput}
                                disabled={companies.isLoading}
                                isInvalid={companies.inputErrors.before_fee}
                                autoComplete="off"
                            />
                            <InputGroup.Text>%</InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                                {companies.inputErrors.before_fee}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="after_fee">
                        <Form.Label>확정 수수료</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                step={0.001}
                                placeholder="3.0"
                                name={'after_fee'}
                                value={companies.inputs.after_fee || ''}
                                onChange={onChangeInput}
                                disabled={companies.isLoading}
                                isInvalid={companies.inputErrors.after_fee}
                                autoComplete="off"
                            />
                            <InputGroup.Text>%</InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                                {companies.inputErrors.after_fee}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    {/*<Form.Group className="mb-3" controlId="memo">*/}
                    {/*    <Form.Label>메모</Form.Label>*/}
                    {/*    <Form.Control as="textarea" rows={10} disabled={companies.isLoading}*/}
                    {/*                  name={'memo'}*/}
                    {/*                  value={companies.inputs.memo}*/}
                    {/*                  onChange={onChangeInput}/>*/}
                    {/*</Form.Group>*/}
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