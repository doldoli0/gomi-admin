import Calendar from "../components/Calendar"
import moment from "moment"
import {useAuth} from "../hooks/useAuth";
import {
    Badge,
    ListGroup,
    Button,
    ButtonGroup,
    Card,
    Col,
    Container,
    Row,
    FormControl,
    ListGroupItem,
    Table,
} from "react-bootstrap";
import {forwardRef, useCallback, useEffect, useRef, useState} from "react";
import apiController from "../lib/ApiController";
import {fromJS, List, Map} from "immutable";
import Preloader from "../components/Preloader";
import dynamic from "next/dynamic";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faRedo} from "@fortawesome/free-solid-svg-icons";
import CardHeaderMore from "../components/CardHeaderMore";
import GomiSchedules from "../components/GomiSchedules";
import {useDispatch, useSelector} from "react-redux";
import GomiCalendar from "../components/GomiCalendar";
import GomiCalendarFilter from "../components/GomiCalendarFilter";
import {
    clearInputErrors,
    removeSchedule,
    requestCreateSchedule,
    requestDeleteSchedule,
    requestGetSchedules, requestUpdateSchedule,
    setShowModal
} from "../store/modules/schedules";
import {datetimeToLocalDatetime} from "../lib/helper";
import GomiScheduleModal from "../components/GomiScheduleModal";
import GomiDeleteModal from "../components/GomiDeleteModal";
import {toast} from "react-toastify";


export async function getStaticProps() {
    return {
        props: {
            title: "대시 보드"
        },
    }
}


export default function dashboard(props) {
    const calendarRef = useRef(null);
    const admins = useSelector(((state)=>state.admins));
    const [userFilter, setUserFilter] = useState(List([]));
    const [calendarFilter, setCalendarFilter] = useState(List([]));
    const [scheduleInputs, setScheduleInputs] = useState(fromJS({
        calendar_id:0,
        users:[]
    }));

    useAuth({auth:'admin', redirect:'/login'});

    const dispatch = useDispatch();
    const schedules = useSelector((state) => state.schedules);
    const userId = useSelector((state) => state.user.data.id);

    useEffect(() => {
        if (!schedules.isLoaded) {
            dispatch(requestGetSchedules())
        }
    }, [])

    const handleShowModal = (bool) => {
        if (!bool && schedules.isLoading)
            return;

        dispatch(clearInputErrors());
        dispatch(setShowModal(bool));
    }

    const onChangeScheduleInput = (e) => {
        setScheduleInputs(scheduleInputs.set(e.target.name, e.target.value));
    }

    const onAddScheduleUser = (index) => {
        const admin = admins.data[index];
        const item = scheduleInputs.get('users').find((user) => user.get('id') === admin.id);
        if (!item && userId !== admin.id) {
            setScheduleInputs(scheduleInputs.update('users', (users) => users.push(Map(admin))))
        }
    }

    const onRemoveScheduleUser = (index) => {
        setScheduleInputs(scheduleInputs.update('users', (users) => users.splice(index, 1)));
    }


    const handleCreateSchedule = () => {
        let postData = {
            'calendar_id':scheduleInputs.get('calendar_id'),
            'title':scheduleInputs.get('title'),
            'location':scheduleInputs.get('location'),
            'users':scheduleInputs.get('users'),
            'memo':scheduleInputs.get('memo'),
            'isAllDay':scheduleInputs.get('isAllDay')
        }

        if (scheduleInputs.get('isAllDay')) {
            postData.start_at = scheduleInputs.get('start_at') + ' ' + '00:00';
            postData.finish_at = scheduleInputs.get('finish_at') + ' ' + '23:59';
        }
        else {
            postData.start_at = scheduleInputs.get('date') + ' ' + scheduleInputs.get('start_at');
            postData.finish_at = scheduleInputs.get('date') + ' ' + scheduleInputs.get('finish_at');
        }

        dispatch(requestCreateSchedule(postData));
    }

    const [deleteModal, setDeleteModal] = useState({show:false, text:'', id:null});
    const handleDeleteModal = (bool) => {
        setDeleteModal({...deleteModal, show:bool});
    }
    const handleDeletePopup = useCallback(data => {
        setDeleteModal({...deleteModal, show:true, text:'[일정] ' + data.schedule.title, id:data.schedule.id});
    }, []);
    const onSubmitDelete = () => {
        const postData = {id: deleteModal.id};
        dispatch(requestDeleteSchedule(postData));
        handleDeleteModal(false);
    }

    const handleUpdateSchedule = () => {
        let postData = {
            'id':scheduleInputs.get('id'),
            'calendar_id':scheduleInputs.get('calendar_id'),
            'title':scheduleInputs.get('title'),
            'location':scheduleInputs.get('location'),
            'users':scheduleInputs.get('users').toJS(),
            'memo':scheduleInputs.get('memo'),
            'isAllDay':scheduleInputs.get('isAllDay')
        }

        if (scheduleInputs.get('isAllDay')) {
            postData.start_at = scheduleInputs.get('start_at') + ' ' + '00:00';
            postData.finish_at = scheduleInputs.get('finish_at') + ' ' + '23:59';
        }
        else {
            postData.start_at = scheduleInputs.get('date') + ' ' + scheduleInputs.get('start_at');
            postData.finish_at = scheduleInputs.get('date') + ' ' + scheduleInputs.get('finish_at');
        }
        dispatch(requestUpdateSchedule(postData));
    }

    const handleUpdatePopup = useCallback((data) => {
        const index = schedules.data.findIndex(schedule => schedule.id === data.schedule.id);

        if (index >= 0) {
            const schedule = schedules.data[index];
            if (schedule.user.id !== userId) {
                toast.error('내 일정이 아닙니다.');
                return;
            }

            let item = {
                'type':'edit',
                'id':schedule.id,
                'calendar_id':schedule.calendar_id,
                'title':schedule.title,
                'location':schedule.location,
                'memo':schedule.memo,
                'isAllDay':schedule.isAllDay,
                'users':schedule.users.map((user) => ({'id':user.user.id, 'name':user.user.name})),
            };

            const start = moment(new Date(data.changes.start));
            const end = moment(new Date(data.changes.end));
            const date = moment(new Date(data.changes.start));

            if (schedule.isAllDay) {
                item.start_at = start.format('YYYY-MM-DD');
                item.finish_at = end.format('YYYY-MM-DD');
            }
            else {
                item.date = date.format('YYYY-MM-DD');
                item.start_at = start.format('HH:mm');
                item.finish_at = end.format('HH:mm');
            }

            setScheduleInputs(fromJS({...item}));
            dispatch(setShowModal(true));
        }
    }, [schedules.data])

    const handleCreatePopup = useCallback(schedule => {
        const start = moment(new Date(schedule.start));
        const end = moment(new Date(schedule.end));
        const date = moment(new Date(schedule.start));

        let inputs;
        if (schedule.isAllDay) {
            inputs = scheduleInputs.set('start_at', start.format('YYYY-MM-DD')).set('finish_at', end.format('YYYY-MM-DD'));
        }
        else {
            inputs = scheduleInputs.set('start_at', start.format('HH:mm')).set('finish_at', end.format('HH:mm')).set('date', date.format('YYYY-MM-DD'));
        }
        inputs = inputs.set('isAllDay', schedule.isAllDay).set('schedule_id', schedule.id);
        setScheduleInputs(inputs)
        // setScheduleInputs(scheduleInputs.set('finish_at', datetimeToLocalDatetime(end)))
        dispatch(setShowModal(true));


        const calendarInstance = calendarRef.current.getInstance();
        calendarInstance.setDate();
    }, [])

    const toggleFilter = (type, id) => {
        if (type === 'user') {
            const index = userFilter.findIndex((item) => item === id)
            if (index >= 0) {
                setUserFilter(userFilter.splice(index, 1))
            }
            else {
                setUserFilter(userFilter.push(id))
            }
        }
        else if (type === 'calendar') {
            const index = calendarFilter.findIndex((item) => item === id)
            if (index >= 0) {
                setCalendarFilter(calendarFilter.splice(index, 1))
            }
            else {
                setCalendarFilter(calendarFilter.push(id))
            }
        }
    }

    const onClickAllFilter = (type) => {
        if (type === 'user') {
            setUserFilter(List([]))
        }
        else if (type === 'calendar') {
            setCalendarFilter(List([]))
        }
    }

    const filterSchedule = useCallback(() => {
        let items = [...schedules.data];

        if (userFilter.count() !== 0) {
            //유저 필터
            items = items.filter((item) => {
                return (userFilter.findIndex(userId => (userId === item.user_id))) >= 0;
            })
        }

        if (calendarFilter.count() !== 0) {
            //일정 필터
            items = items.filter((item) => {
                return (calendarFilter.findIndex(calendarId => (calendarId === item.calendar_id))) >= 0;
            })
        }

        return [...items];
    },[schedules.data, userFilter, calendarFilter] )


    return(
        <Container fluid className="px-lg-4 px-xl-5">
            <section className="mb-3 mb-lg-5">
                <Row>
                    <Col lg={3}>
                        <Card className={'card-table'}>
                            <Card.Header>
                                <h4 className="card-heading">Filter</h4>
                            </Card.Header>
                            <Card.Body>
                                {admins.isLoading?
                                    <div className="d-flex justify-content-center pt-5 pb-5">
                                        <Preloader type={"wandering-cubes"} variant={'warning'} center/>
                                    </div>
                                    :
                                    <div className={'m-1'}>
                                        <GomiCalendarFilter calendars={schedules.calendars} users={admins.data} userFilter={userFilter} calendarFilter={calendarFilter} toggleFilter={toggleFilter} onClickAllFilter={onClickAllFilter}/>
                                    </div>
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={9}>
                        <Card className={'card-table h-100'}>
                            <Card.Header>
                                <h4 className="card-heading">Calendar</h4>
                            </Card.Header>
                            {!schedules.isLoaded?
                                <div className="d-flex justify-content-center pt-5 pb-5">
                                    <Preloader type={"wandering-cubes"} variant={'warning'} center/>
                                </div>
                                :
                                <GomiCalendar schedules={filterSchedule()} calendars={schedules.calendars}
                                              handleCreatePopup={handleCreatePopup} calendarRef={calendarRef}
                                              isLoading={schedules.isLoading} handleDeletePopup={handleDeletePopup}
                                              handleUpdatePopup={handleUpdatePopup}
                                />
                            }
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col className={'mt-2'}>
                        <GomiSchedules schedules={schedules.data}/>
                    </Col>
                </Row>
            </section>
            <GomiScheduleModal show={schedules.showModal} handleModal={handleShowModal} inputErrors={schedules.inputErrors} inputs={scheduleInputs} onChangeInput={onChangeScheduleInput} onAddUser={onAddScheduleUser} admins={admins} calendars={schedules.calendars} onSubmitModal={handleCreateSchedule} onRemoveUser={onRemoveScheduleUser} userId={userId} isLoading={schedules.isLoading} onUpdateModal={handleUpdateSchedule}/>
            <GomiDeleteModal text={deleteModal.text} onSubmitDelete={onSubmitDelete} show={deleteModal.show} handleModal={handleDeleteModal}/>
        </Container>
    )
}