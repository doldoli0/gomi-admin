import {
    DropdownButton,
    FloatingLabel,
    Modal,
    Button,
    Form,
    Container,
    Row,
    Col,
    InputGroup,
    Dropdown, Badge
} from "react-bootstrap";
import {datetimeToLocalDatetime} from "../lib/helper";
import {useState} from "react";
import moment from "moment";
import Preloader from "./Preloader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXbox} from "@fortawesome/free-brands-svg-icons";
import {faRemoveFormat, faTrash} from "@fortawesome/free-solid-svg-icons";


const GomiScheduleModal = ({show, handleModal, inputs, onChangeInput, admins, calendars, onSubmitModal, onAddUser, onRemoveUser, userId, isLoading, inputErrors, onUpdateModal}) => {
    return (
        <Modal
            show={show}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => handleModal(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {inputs.get('type') === 'edit'?
                        <>{inputs.get('title')} 일정 수정</>
                        :
                        <>새로운 일정 추가</>
                    }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {inputs.get('isAllDay')?
                    <InputGroup className={'mb-3'}>
                        <InputGroup.Text>시작</InputGroup.Text>
                        <Form.Control name={'start_at'} type={'date'} value={inputs.get('start_at')} onChange={onChangeInput} disabled={isLoading} isInvalid={inputErrors.finish_at}/>
                        <InputGroup.Text>종료</InputGroup.Text>
                        <Form.Control name={'finish_at'} type={'date'} value={inputs.get('finish_at')} onChange={onChangeInput} disabled={isLoading} isInvalid={inputErrors.finish_at}/>
                        <Form.Control.Feedback type="invalid">
                            {inputErrors.finish_at}
                        </Form.Control.Feedback>
                    </InputGroup>
                    :
                    <>
                        <Form.Control name={'date'} type={'date'} value={inputs.get('date')} onChange={onChangeInput} disabled={isLoading}/>
                        <InputGroup className={'mb-3'}>
                            <InputGroup.Text>시작</InputGroup.Text>
                            <Form.Control name={'start_at'} type={'time'} value={inputs.get('start_at')} onChange={onChangeInput} disabled={isLoading} isInvalid={inputErrors.finish_at}/>
                            <InputGroup.Text>종료</InputGroup.Text>
                            <Form.Control name={'finish_at'} type={'time'} value={inputs.get('finish_at')} onChange={onChangeInput} disabled={isLoading} isInvalid={inputErrors.finish_at}/>
                            <Form.Control.Feedback type="invalid">
                            {inputErrors.finish_at}
                                </Form.Control.Feedback>
                                </InputGroup>
                                </>
                            }
                                <FloatingLabel label="일정 종류" className="mb-3">
                                    <Form.Select name={'calendar_id'} value={inputs.get('calendar_id')} onChange={onChangeInput} disabled={isLoading} isInvalid={inputErrors.calendar_id}>
                                        {calendars.map((calendar, index) => (
                                            <option key={index} value={calendar.id}>{calendar.name}</option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {inputErrors.calendar_id}
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="일정 이름" className="mb-3">
                    <Form.Control type="text" name='title' placeholder="일정 이름" autoComplete={'off'} value={inputs.get('title') || ''} onChange={onChangeInput} disabled={isLoading} isInvalid={inputErrors.title}/>
                    <Form.Control.Feedback type="invalid">
                        {inputErrors.title}
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="장소" className="mb-3">
                    <Form.Control type="text" name='location' placeholder="장소" autoComplete={'off'} value={inputs.get('location') || ''} onChange={onChangeInput} disabled={isLoading}/>
                </FloatingLabel>
                <FloatingLabel label="일정 설명" className="mb-3">
                    <Form.Control as={"textarea"} style={{height:'200px'}} name='memo' placeholder="일정 설명" autoComplete={'off'} value={inputs.get('memo') || ''} onChange={onChangeInput} disabled={isLoading}/>
                </FloatingLabel>
                {inputs.get('users').map((user, index) => (
                    <div key={index}>
                        <h4>
                            <Badge bg="secondary">{user.get('name')}</Badge><Button onClick={() => onRemoveUser(index)} size={'sm'} variant={'outline-dark'} disabled={isLoading}>X</Button>
                        </h4>
                    </div>
                ))}
                <div>
                    {admins.isLoading ?
                        <Preloader type={"wandering-cubes"} variant={'warning'}/>
                        :
                        <DropdownButton id="dropdown-item-button" title="누구와 함께 하시나요?">
                            {/*<Dropdown.ItemText>선택</Dropdown.ItemText>*/}
                            {admins.data.map((admin, index) => {
                                const user = inputs.get('users').find(user => user.get('id') === admin.id)
                                if (userId !== admin.id && !user)
                                    return (
                                        <Dropdown.Item key={index} as="button" onClick={() => onAddUser(index)} disabled={isLoading}>{admin.name}</Dropdown.Item>
                                    )
                            })}
                        </DropdownButton>
                    }
                </div>
            </Modal.Body>
            <Modal.Footer>
                {inputs.get('type') === 'edit' ?
                    <Button variant={'info'} onClick={onUpdateModal} disabled={isLoading}>수정</Button>
                    :
                    <Button onClick={onSubmitModal} disabled={isLoading}>추가</Button>
                }
            </Modal.Footer>
        </Modal>
    )
}

export default GomiScheduleModal;