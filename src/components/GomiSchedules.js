import {Badge, Button, Card, Table} from "react-bootstrap";
import CardHeaderMore from "./CardHeaderMore";

const GomiSchedules = ({schedules}) => {

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
                        <th>담당 사원</th>
                        <th>일정</th>
                        <th>종류</th>
                        <th>기간</th>
                        <th>상태</th>
                        <th>요청</th>
                    </tr>
                    </thead>
                    <tbody>
                    {schedules.map((item, index) => {
                        return (
                            <tr className="align-middle" key={index}>
                                {/*<td>#{item.id}</td>*/}
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
                <Button variant="outline-dark" href="#!">
                    See all orders
                </Button>
            </Card.Footer>
        </Card>
    )
}

export default GomiSchedules