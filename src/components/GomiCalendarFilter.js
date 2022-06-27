import {Badge, ListGroup} from "react-bootstrap";

const GomiCalendarFilter = ({calendars, users, toggleFilter, userFilter, calendarFilter, onClickAllFilter, schedules}) => {

    return (
        <ListGroup as="ul">
            <ListGroup.Item as={'li'} className={'nav-header disabled text-center'}>
                일정 종류
            </ListGroup.Item>
            <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" action onClick={() => onClickAllFilter('calendar')} active={calendarFilter.count() === 0}>
                <div className="ms-2 me-auto">
                    <div className={`fw-bold ${calendarFilter.count() === 0?'text-light':'text-info'}`}>전체</div>
                </div>
                {/*<Badge bg="primary" pill>*/}
                {/*    0*/}
                {/*</Badge>*/}
            </ListGroup.Item>
            {calendars.map((calendar, index) => {
                const filterIndex = calendarFilter.findIndex(id => id === calendar.id);

                let option = {};
                if (filterIndex >= 0 ) {
                    option.active = true;
                }
                else {
                    option.active = false;
                }

                const count = schedules.filter(schedule => schedule.calendar_id === calendar.id).length;

                return (
                    <ListGroup.Item key={index} as="li" className="d-flex justify-content-between align-items-start" action onClick={() => toggleFilter('calendar', calendar.id)} active={option.active}>
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">{calendar.name}</div>
                        </div>
                        <Badge bg="danger" pill>
                            {count}
                        </Badge>
                    </ListGroup.Item>
                )
            })}
            <ListGroup.Item as={'li'} className={'nav-header disabled text-center'}>
                유저
            </ListGroup.Item>
            <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" action onClick={() => onClickAllFilter('user')} active={userFilter.count() === 0}>
                <div className="ms-2 me-auto">
                    <div className={`fw-bold ${userFilter.count() === 0?'text-light':'text-info'}`}>전체</div>
                </div>
                {/*<Badge bg="primary" pill>*/}
                {/*    0*/}
                {/*</Badge>*/}
            </ListGroup.Item>
            {users.map((user, index) => {
                const filterIndex = userFilter.findIndex(id => id === user.id);

                let option = {};
                if (filterIndex >= 0 ) {
                    option.active = true;
                }
                else {
                    option.active = false;
                }

                const count = schedules.filter(schedule => schedule.user_id === user.id).length;

                return (
                    <ListGroup.Item key={index} as="li" className="d-flex justify-content-between align-items-start" action onClick={() => toggleFilter('user', user.id)} active={option.active}>
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">{user.name}</div>
                        </div>
                        <Badge bg="danger" pill>
                            {count}
                        </Badge>
                    </ListGroup.Item>
                )
            })}
        </ListGroup>
    )
}

export default GomiCalendarFilter;