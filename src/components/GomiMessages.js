import {Spinner, Button, Card, Col, Form, InputGroup, Pagination, Row, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRedo, faSearch} from "@fortawesome/free-solid-svg-icons";
import Preloader from "./Preloader";
import Moment from "react-moment";
import Link from "next/link";

const GomiMessages = ({
                          isLoading,
                          searchInputs,
                          messages,
                          onChangeSearchInput,
                          currentPage,
                          lastPage,
                          onClickPage,
                          onClickCheck, checkIsLoading
                      }) => {

    let pageItems = [];
    for (let number = 1; number <= lastPage; number++) {
        pageItems.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => onClickPage(number)} disabled={isLoading}>
                {number}
            </Pagination.Item>
        );
    }

    return (
        <Card className="card-table h-100">
            <Card.Header>
                <h5 className="card-heading">메세지 목록</h5>
            </Card.Header>
            <Card.Body>
                {isLoading ?
                    <div className="d-flex justify-content-center pt-5 pb-5">
                        <Preloader type={"wandering-cubes"} variant={'warning'} center/>
                    </div>
                    :
                    <Table responsive hover className="mb-0">
                        <thead className={"light"}>
                        <tr>
                            <th>전송</th>
                            <th>카테고리</th>
                            <th>내용</th>
                            <th>시간</th>
                            <th>확인 시간</th>
                        </tr>
                        </thead>
                        <tbody>
                        {messages.map((message, index) => {
                            let category, link, actionUser;
                            if (message.getIn(['action_user', 'name'])) {
                                actionUser = message.getIn(['action_user', 'name']);
                            }
                            else {
                                actionUser = '[SYSTEM]';
                            }

                            switch (message.get('action')) {
                                case 'company':
                                    category = '대리점';
                                    link = `/companies/${message.get('action_id')}`;
                                    break;
                                case 'schedule':
                                    category = '일정';
                                    link = `/`;
                                    break;
                                default:
                                    category = '';
                                    link = `/user/messages`;
                            }


                            return (
                                <tr key={index}>
                                    <td>{actionUser}</td>
                                    <td>
                                        {category !== '' &&
                                            <Link href={link}>
                                                <Button size={'sm'}>{category}</Button>
                                            </Link>
                                        }
                                    </td>
                                    <td className={`text-${message.get('color')}`}>{message.get('message')}</td>
                                    <td><Moment format={'YYYY-MM-DD HH:mm'}>{message.get('created_at')}</Moment></td>
                                    <td>
                                        {message.get('checked_at')?
                                            <Moment format={'YYYY-MM-DD HH:mm'}>{message.get('checked_at')}</Moment>
                                            :
                                            <>
                                                {checkIsLoading ?
                                                    <Spinner animation="border" variant="primary" size={'sm'}/>
                                                    :
                                                    <Button variant={'secondary'} size={'sm'} onClick={() => onClickCheck(index)}>미확인</Button>
                                                }
                                            </>
                                        }
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                }
            </Card.Body>
            {!isLoading &&
                <Card.Footer className={'text-end'}>
                    <Pagination>
                        {pageItems}
                    </Pagination>
                </Card.Footer>
            }
        </Card>
    )
}

export default GomiMessages;