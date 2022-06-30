import {Button, Card, Form, Table} from "react-bootstrap";
import Moment from "react-moment";
import Preloader from "./Preloader";

const GomiSession = ({sessions, isLoading, currentSessions, onClickDeleteToken}) => {

    return (
        <Card className="card-table h-100">
            <Card.Header>
                <h3 className={'card-heading'}>접속 정보</h3>
            </Card.Header>
            <Card.Body>
                {isLoading?
                    <div className="d-flex justify-content-center pt-5 pb-5">
                        <Preloader type={"wandering-cubes"} variant={'warning'} center/>
                    </div>
                    :
                    <Table responsive hover className="mb-0">
                        <thead className={"light"}>
                        <tr>
                            <th className={'text-center'}>로그인 시간</th>
                            <th className={'text-center'}>마지막 사용</th>
                            <th className={'text-center'}>접속 기기</th>
                            <th className={'text-end'}>강제종료</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sessions.map((session, index) => {
                            return (
                                <tr key={index} align={'center'} valign={'middle'}>
                                    <td>
                                        <Moment format={'YYYY-MM-DD HH:mm'}>{session.get('created_at')}</Moment>
                                    </td>
                                    <td>
                                        <Moment format={'YYYY-MM-DD HH:mm'}>{session.get('last_used_at')}</Moment>
                                    </td>
                                    <td>
                                        {session.get('name')}
                                    </td>
                                    <td className={'text-end'}>
                                        <Button size={'sm'} variant={'outline-danger'} disabled={currentSessions.get('id') === session.get('id')} onClick={() => onClickDeleteToken(index)}>강제종료</Button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                }
            </Card.Body>
        </Card>
    )
}

export default GomiSession;