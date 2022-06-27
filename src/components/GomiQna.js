import {Spinner, InputGroup, Button, Card, Col, Form, Pagination, Row, Table, Container, Badge} from "react-bootstrap";
import Preloader from "./Preloader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";

const GomiQna = ({
                     role, editInputs, onChangeEditInput,
                     editIndex,
                     searchTextRef,
                     createInputs,
                     onChangeCreateInput, handleCreateQna,
                     isLoading,
                     isCreateLoading,
                     searchText,
                     onChangeSearchText,
                     qnas, handleToggleIsAllQnas, isAllQnas, handleEditMode, handleUpdateQna, handleDeleteModal, isEditLoading
                 }) => {

    const router = useRouter();
    const onClickBack = () => {
        router.back();
    }

    return (
        <Card className="card-table h-100">
            <Card.Header>
                <h5 className="card-heading">
                    {role === 'admin' &&
                        <>
                            <Button variant={'outline-info'} onClick={onClickBack}><FontAwesomeIcon icon={faArrowLeft}/>뒤로가기</Button>{' '}
                        </>
                    }
                    QNA
                </h5>
            </Card.Header>
            <Card.Body>
                {isLoading ?
                    <div className="d-flex justify-content-center pt-5 pb-5">
                        <Preloader type={"wandering-cubes"} variant={'warning'} center/>
                    </div>
                    :
                    <>
                        <Container>
                            <Row>
                                <Col className={'p-1'}>
                                    <InputGroup>
                                        <InputGroup.Text>검색어</InputGroup.Text>
                                        <Form.Control placeholder={'단축키 `'} autoComplete={'off'} value={searchText} onChange={onChangeSearchText} ref={searchTextRef}/>
                                    </InputGroup>
                                    <div className={'mt-1'}>
                                        <Form.Check
                                            value={isAllQnas}
                                            onClick={handleToggleIsAllQnas}
                                            type="switch"
                                            id="custom-switch"
                                            label="검색어 없을때 전체 보기"
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                        <Table responsive hover className="mb-0">
                            <thead>
                            <tr>
                                <th>질문</th>
                                <th>답변</th>
                                <th className={'text-end'}>키워드</th>
                            </tr>
                            </thead>
                            <tbody>
                            {qnas.map((qna, index) => {
                                if (editIndex === index) {
                                    if (index > 50) {
                                        return;
                                    }
                                    return (
                                        <tr key={index} onDoubleClick={() => handleEditMode(index)}>
                                            <td>
                                                <Form.Control value={editInputs.get('question')} name={'question'} onChange={onChangeEditInput} disabled={isEditLoading}/>
                                            </td>
                                            <td>
                                                <Form.Control as={'textarea'} rows={5} value={editInputs.get('answer')} name={'answer'} onChange={onChangeEditInput} disabled={isEditLoading}/>
                                            </td>
                                            <td className={'text-end'}>
                                                <InputGroup>
                                                    <Form.Control value={editInputs.get('keyword')} name={'keyword'} onChange={onChangeEditInput} disabled={isEditLoading}/>
                                                    <Button variant={'info'} onClick={handleUpdateQna} disabled={isEditLoading}>수정</Button>
                                                    <Button variant={'danger'} onClick={() => handleDeleteModal(true)} disabled={isEditLoading}>삭제</Button>
                                                    <Button variant={'secondary'} onClick={() => handleEditMode(null)} disabled={isEditLoading}>취소</Button>
                                                </InputGroup>
                                            </td>
                                        </tr>
                                    )
                                }
                                else {
                                    const badges = qna.get('keyword').match(/.+?\,|.+?$/g);
                                    return (
                                        <tr key={index} onDoubleClick={() => handleEditMode(index)}>
                                            <td>{qna.get('question')}</td>
                                            <td style={{whiteSpace:'pre-wrap'}}>{qna.get('answer')}</td>
                                            <td className={'text-end'}>
                                                <div>
                                                {badges && badges.map((badge, index2) => {
                                                const badgeText = badge.replace(',', '');
                                                if (badgeText !== '') {
                                                    return <Badge className={'me-1'} key={index2}>{badgeText}</Badge>
                                                }})}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                            })}
                            {role === 'admin' &&
                                <tr>
                                    <td>
                                        <Form.Control name={'question'} value={createInputs.get('question') || ''}
                                                      onChange={onChangeCreateInput} disabled={isCreateLoading} autoComplete={'off'}/>
                                    </td>
                                    <td>
                                        <Form.Control as={'textarea'} rows={5} name={'answer'} value={createInputs.get('answer') || ''}
                                                      onChange={onChangeCreateInput} disabled={isCreateLoading} autoComplete={'off'}/>
                                    </td>
                                    <td className={'text-end'}>
                                        <InputGroup>
                                            <Form.Control name={'keyword'} value={createInputs.get('keyword') || ''}
                                                          onChange={onChangeCreateInput} disabled={isCreateLoading} autoComplete={'off'}/>
                                            <Button onClick={handleCreateQna} disabled={isCreateLoading}>
                                                {isCreateLoading?
                                                    <Spinner size={'sm'} animation="border" variant="secondary"/>
                                                    :
                                                    "추가"
                                                }
                                            </Button>
                                        </InputGroup>
                                    </td>
                                </tr>
                            }
                            </tbody>
                        </Table>
                    </>
                }
            </Card.Body>
            <Card.Footer className={'text-end'}>
            </Card.Footer>
        </Card>
    )
}

export default GomiQna;