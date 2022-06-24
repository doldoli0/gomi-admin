import {Button, Form, Modal} from "react-bootstrap";
import {useState} from "react";

const GomiDeleteModal = ({text, show, onSubmitDelete, handleModal}) => {
    const [deleteText, setDeleteText] = useState();

    const onClickDelete = () => {
        if (deleteText !== '삭제')
            return;

        onSubmitDelete();
    }

    return (
        <Modal show={show} onHide={() => handleModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>신규 가맹점 추가</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><span className={'text-primary fw-bold'}>{text}</span>를 삭제합니다.</p>
                <p>삭제후 복구가 불가능합니다.</p>
                <p>아래 [삭제]라고 입력후 삭제 해주세요.</p>
                <Form.Control type={'text'} value={deleteText} onChange={(e) => {setDeleteText(e.target.value)}} placeholder={'삭제'}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleModal(false)}>
                    닫기
                </Button>
                <Button variant="danger" onClick={onClickDelete}>
                    삭제
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default GomiDeleteModal;