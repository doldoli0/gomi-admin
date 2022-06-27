import {useAuth} from "../../hooks/useAuth";
import {wrapper} from "../../store";
import {Button, Card, Col, Container, Form, Pagination, Row} from "react-bootstrap";
import GomiQna from "../../components/GomiQna";
import {useSelector} from "react-redux";
import {useCallback, useEffect, useRef, useState} from "react";
import {fromJS, List, Map} from "immutable";
import apiController from "../../lib/ApiController";
import {toast} from "react-toastify";
import GomiDeleteModal from "../../components/GomiDeleteModal";

export const getStaticProps = wrapper.getStaticProps((store) => () => {
    return {
        props: {
            title: "QNA",
            pageHolderClass: "p-0",
            hideHeader: true,
            hideFooter: true,
            hideSidebar: true,
        },
    }
});

export default function Qna() {
    const searchTextRef = useRef(null);
    useAuth({auth:['admin', 'tm'], redirect:'/login'})

    const role = useSelector((state) => state.user.data.role);
    const [editIndex, setEditIndex] = useState(null);
    const [createInputs, setCreateInputs] = useState(Map({}));
    const [editInputs, setEditInputs] = useState(Map({}));
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateLoading, setIsCreateLoading] = useState(false);
    const [isEditLoading, setIsEditLoading] = useState(false);
    const [qnas, setQnas] = useState(List([]));
    const [filterQnas, setFilterQnas] = useState(List([]));
    const [searchText, setSearchText] = useState('');
    const [isAllQnas, setIsAllQnas] = useState(false);


    const onChangeEditInput = useCallback((e) => {
        if (e.target.name === 'keyword') {
            const replaceText = e.target.value.replace(/[^[가-힣|\,|ㄱ-ㅎ|a-z|A-Z|0-9]/g, '');
            setEditInputs(editInputs.set(e.target.name, replaceText));
        }
        else {
            setEditInputs(editInputs.set(e.target.name, e.target.value));
        }

        // if (e.target.name === 'keyword') {
        //     const badges = e.target.value.match(/.+?\,/g);
        //     setCreateInputs(createInputs.set(e.target.name, e.target.value.replace(/.*?\,/, '')).set('badges', fromJS(badges)));
        // }
    }, [editInputs]);

    const onChangeCreateInput = useCallback((e) => {
        if (e.target.name === 'keyword') {
            const replaceText = e.target.value.replace(/[^[가-힣|\,|ㄱ-ㅎ|a-z|A-Z|0-9]/g, '');
            setCreateInputs(createInputs.set(e.target.name, replaceText));
        }
        else {
            setCreateInputs(createInputs.set(e.target.name, e.target.value));
        }
        // if (e.target.name === 'keyword') {
        //     const badges = e.target.value.match(/.+?\,/g);
        //     setCreateInputs(createInputs.set(e.target.name, e.target.value.replace(/.*?\,/, '')).set('badges', fromJS(badges)));
        // }
    }, [createInputs]);

    const handleEditMode = useCallback((index) => {
        if (role !== 'admin' || index === editIndex)
            return;

        setEditInputs(filterQnas.get(index));
        setEditIndex(index);
    }, [filterQnas, editIndex])

    const handleUpdateQna = useCallback(() => {
        setIsEditLoading(true);
        apiController.post(`/update/qna`, editInputs)
            .then((response) => {
                setEditIndex(null);
                setEditInputs(Map({}))
                const index = qnas.findIndex(qna => qna.get('id') === response.data.qna.id)
                if (index >= 0) {
                    setQnas(qnas.set(index, fromJS(response.data.qna)));
                }
            })
            .finally(() => {
                setIsEditLoading(false);
            })
    }, [editInputs, filterQnas, qnas])

    const handleCreateQna = useCallback(() => {
        setIsCreateLoading(true);
        apiController.post(`/qna`, createInputs)
            .then((response) => {
                setQnas(qnas.push(fromJS(response.data.qna)));
                setCreateInputs(Map({}))
            })
            .finally(() => {
                setIsCreateLoading(false);
            })
    }, [createInputs, qnas]);

    const onChangeSearchText = useCallback((e) => {
        setSearchText(e.target.value.replace('`', ''))
    }, [searchText])

    useEffect(() => {
        if (!isLoading) {
            if (searchText === '') {
                if (isAllQnas) {
                    setFilterQnas(qnas);
                }
                else {
                    setFilterQnas(List([]));
                }
            }
            else {
                const filterItems = qnas.filter((item) => (item.get('question').includes(searchText) || item.get('answer').includes(searchText) || item.get('keyword').includes(searchText)));
                setFilterQnas(filterItems);
            }
        }
    }, [qnas, searchText, isAllQnas])

    useEffect(() => {
        setEditIndex(null);
        handleDeleteModal(false);
    }, [searchText])

    const handleToggleIsAllQnas = useCallback(() => {
        setIsAllQnas(!isAllQnas);
    }, [isAllQnas])

    const onPressHotKey = useCallback((e) => {
        if (e.key === '`') {
            setSearchText('');
            searchTextRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        apiController.get('/qnas')
            .then((response) => {
                setQnas(fromJS(response.data));
            })
            .finally(() => {
                setIsLoading(false);
            })

            window.addEventListener("keypress",onPressHotKey);
            return () => {
                window.removeEventListener("keypress",onPressHotKey);
            };
    }, [])

    const [deleteModal, setDeleteModal] = useState({show:false, title:'QNA 삭제', text:''});
    const onSubmitDelete = useCallback(() => {
        //삭제
        setIsEditLoading(true);
        setDeleteModal({...deleteModal, show: false});
        const id = editInputs.get('id');
        apiController.post('/delete/qna', {id:id})
            .then((response) => {
                setEditIndex(null);
                const index = qnas.findIndex(qna => qna.get('id') === id);
                if (index >= 0) {
                    setQnas(qnas.splice(index, 1))
                }
                const filterIndex = filterQnas.findIndex(qna => qna.get('id') === id);
                if (filterIndex >= 0) {
                    setQnas(qnas.splice(index, 1))
                }
            })
            .finally(() => {
                setIsEditLoading(false);
            })
    }, [editInputs]);
    const handleDeleteModal = useCallback((bool) => {
        setDeleteModal({...deleteModal, show: bool});
    }, [deleteModal, qnas]);

    return (
        <Container fluid className="px-lg-4 px-xl-5 mt-3">
            <section className="mb-3 mb-lg-5">
                <Row>
                    <Col>
                        <GomiQna role={role} editIndex={editIndex} editInputs={editInputs} createInputs={createInputs}
                                 onChangeCreateInput={onChangeCreateInput} handleCreateQna={handleCreateQna}
                                 isLoading={isLoading} isCreateLoading={isCreateLoading} searchText={searchText} onChangeSearchText={onChangeSearchText}
                                 qnas={filterQnas} searchTextRef={searchTextRef} isAllQnas={isAllQnas} handleToggleIsAllQnas={handleToggleIsAllQnas}
                                 handleEditMode={handleEditMode} onChangeEditInput={onChangeEditInput} handleUpdateQna={handleUpdateQna} handleDeleteModal={handleDeleteModal}
                                 isEditLoading={isEditLoading}
                        />
                    </Col>
                </Row>
            </section>
            <GomiDeleteModal onSubmitDelete={onSubmitDelete} handleModal={handleDeleteModal} show={deleteModal.show} text={deleteModal.text} title={deleteModal.title}/>
        </Container>
    )
}