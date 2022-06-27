import {useCallback, useEffect, useState} from "react";
import {fromJS, List, Map} from "immutable";
import {useDispatch, useSelector} from "react-redux";
import {Col, Container, Pagination, Row} from "react-bootstrap";
import GomiMessages from "../../components/GomiMessages";
import apiController from "../../lib/ApiController";
import moment from "moment";
import {removeMessage} from "../../store/modules/messages";

export default function Messages() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchInputs, setSearchInputs] = useState(Map({}));
    const [messages, setMessages] = useState(List([]));
    const onChangeSearchInput = useCallback((e) => {
        setSearchInputs(searchInputs.set(e.target.name, e.target.value))
    }, []);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);
    const [checkIsLoading, setCheckIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        apiController.get('/user/messages', {params:{page:currentPage}})
            .then((response) => {
                setMessages(fromJS(response.data.data));
                setCurrentPage(response.data.current_page);
                setLastPage(response.data.last_page);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [currentPage])

    const onClickPage = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const onClickCheck = useCallback((index) => {
        // setMessages(messages.setIn([index, 'isLoading'], true));
        setCheckIsLoading(true);
        const message = messages.get(index);
        apiController.post('/update/user/message',{id:message.get('id')})
            .then((response) => {
                setMessages(messages.set(index, message.set('checked_at', moment())));
                dispatch(removeMessage({id:message.get('id')}))
            })
            .finally(() => {
                setCheckIsLoading(false);
                // setMessages(messages.setIn([index, 'isLoading'], false));
            })
    }, [messages]);




    return (
        <Container fluid className="px-lg-4 px-xl-5">
            <section className="mb-3 mb-lg-5">
                <Row>
                    <Col lg={12} className="mb-4">
                        <GomiMessages messages={messages} isLoading={isLoading}
                                      onChangeSearchInput={onChangeSearchInput} searchInputs={searchInputs}
                                      lastPage={lastPage} currentPage={currentPage} onClickPage={onClickPage} onClickCheck={onClickCheck} checkIsLoading={checkIsLoading}/>
                    </Col>
                </Row>
            </section>
        </Container>
    )
}