import {Badge, Button, Card, Table} from "react-bootstrap";
import CardHeaderMore from "./CardHeaderMore";
import Moment from "react-moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faClock,
    faLocationArrow,
    faMap,
    faMapMarked, faMapMarkerAlt,
    faMapPin,
    faMarker,
    faSearchLocation, faTimes, faTimesCircle, faUser,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const GomiSchedules = ({schedules, calendars}) => {
    const now = moment();

    return (
        <Card className="card-table mb-4">
            <Card.Header>
                <h5 className="card-heading">Upcoming Schedules</h5>
                {/*<CardHeaderMore />*/}
            </Card.Header>
            <Card.Body>
                <Table borderless hover responsive className="mb-0">
                    <thead>
                    <tr>
                        <th>일정 이름</th>
                        <th>시작</th>
                        <th>종료</th>
                        <th>사원</th>
                        <th>일정 종류</th>
                        <th>장소</th>
                        <th>etc</th>
                    </tr>
                    </thead>
                    <tbody>
                    {schedules.map((item, index) => {
                        const start_at = moment(item.start_at);

                        return (
                            <tr className={`align-middle ${now.isAfter(start_at) && "bg-opacity-10 bg-secondary"}`} key={index}>
                                <td>{item.title}</td>
                                <td><FontAwesomeIcon icon={faClock}/> <span className={'fw-bold'}><Moment format={'YYYY-MM-DD HH:mm'}>{item.start_at}</Moment></span></td>
                                <td><FontAwesomeIcon icon={faClock}/> <span className={'fw-bold'}><Moment format={'YYYY-MM-DD HH:mm'}>{item.finish_at}</Moment></span></td>
                                <td><FontAwesomeIcon icon={faUser}/> {item.user.name}</td>
                                <td>{calendars[item.calendar_id].name}</td>
                                <td><FontAwesomeIcon icon={faMapMarkerAlt}/> {item.location}</td>
                                <td>
                                    <FontAwesomeIcon icon={faUsers}/>
                                    {item.users.map((item, index) => (
                                        <>
                                            {' '}<Badge key={index}>{item.user.name}</Badge>
                                        </>
                                    ))}
                                </td>
                                {/*<td>*/}
                                {/*    <strong>{item.customer.name}</strong>*/}
                                {/*    <br/>*/}
                                {/*    <span className="text-muted text-sm">*/}
                                {/*                  {item.customer.email}*/}
                                {/*                </span>*/}
                                {/*</td>*/}
                                {/*<td>{item.date}</td>*/}
                                {/*<td>${item.total}</td>*/}
                                {/*<td>*/}
                                {/*    {item.status === "open" && (*/}
                                {/*        <Badge bg="success-light" text="success">*/}
                                {/*            Open*/}
                                {/*        </Badge>*/}
                                {/*    )}*/}
                                {/*    {item.status === "closed" && (*/}
                                {/*        <Badge bg="danger-light" text="danger">*/}
                                {/*            Closed*/}
                                {/*        </Badge>*/}
                                {/*    )}*/}
                                {/*    {item.status === "inprogress" && (*/}
                                {/*        <Badge bg="info-light" text="info">*/}
                                {/*            In Progress*/}
                                {/*        </Badge>*/}
                                {/*    )}*/}
                                {/*    {item.status === "onhold" && (*/}
                                {/*        <Badge bg="warning-light" text="warning">*/}
                                {/*            On Hold*/}
                                {/*        </Badge>*/}
                                {/*    )}*/}
                                {/*</td>*/}
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </Card.Body>
            <Card.Footer className="text-end">
                {/*<Button variant="outline-dark" href="#!">*/}
                {/*    See all orders*/}
                {/*</Button>*/}
            </Card.Footer>
        </Card>
    )
}

export default GomiSchedules