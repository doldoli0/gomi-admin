import {Button, Form, InputGroup, Modal, Spinner} from "react-bootstrap";
import DaumPostcode from "react-daum-postcode";

const GomiAddressModal = ({show, handleModal, onClickPost}) => {
    const postCodeStyle = {
        display: 'block',
        position: 'relative',
        top: '0%',
        width: '100%',
        height: '400px',
        padding: '7px',
    };

    return (
        <Modal show={show} onHide={() => handleModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>신규 가맹점 추가</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DaumPostcode style={postCodeStyle} onComplete={onClickPost} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleModal(false)}>
                    닫기
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default GomiAddressModal;