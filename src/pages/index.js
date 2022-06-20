import Calendar from "../components/Calendar"
import moment from "moment"
import {useAuth} from "../hooks/useAuth";
import {Card, Col, Container, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import apiController from "../lib/ApiController";
import {fromJS, List} from "immutable";
import {datetimeToLocalDatetime} from "../lib/helper";
import Preloader from "../components/Preloader";


export async function getStaticProps() {
    return {
        props: {
            title: "대시 보드"
        },
    }
}


export default function dashboard(props) {
    useAuth({auth:'admin', redirect:'/login'});

    const [isLoading, setIsLoading] = useState(false);
    const [schedules, setSchedules] = useState(List());

    useEffect(() => {
        setIsLoading(true);
        apiController.get(`${process.env.NEXT_PUBLIC_END_POINT}/api/schedule`)
            .then((response) => {
                let items = [];
                response.data.company.map((item) => {
                    items.push({
                        calendarId: "0",
                        title: `${item.name} - ${item.schedule_comment}`,
                        category: "time",
                        start: datetimeToLocalDatetime(item.schedule),
                        end: datetimeToLocalDatetime(item.schedule)
                    })
                })

                setSchedules(fromJS(items))
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [])


    // const todayDate = moment().startOf("day")
    // const YM = todayDate.format("YYYY-MM")
    // const YESTERDAY = todayDate.clone().subtract(1, "day").format("YYYY-MM-DD")
    // const TODAY = todayDate.format("YYYY-MM-DD")
    // const TOMORROW = todayDate.clone().add(1, "day").format("YYYY-MM-DD")
    const themeConfig = {
        // month day grid cell 'day'
        "month.weekend.backgroundColor": "#fafafa",
    }

    const calendars = [
        {
            id: "0",
            name: "가맹점",
            bgColor: "#4650dd",
            borderColor: "#4650dd",
            color: "#fff",
        },
        {
            id: "1",
            name: "프로젝트",
            bgColor: "#00a9ff",
            borderColor: "#00a9ff",
            color: "#fff",
        },
        {
            id: "2",
            name: "업무",
            bgColor: "#a9a24a",
            borderColor: "#a9a24a",
            color: "#fff",
        },
    ];

    // const schedules = [
    //     {
    //         calendarId: "0",
    //         title: "All Day Event",
    //         category: "time",
    //         start: YM + "-01",
    //     },
    //     {
    //         calendarId: "0",
    //         title: "Long Event",
    //         category: "time",
    //         start: YM + "-07",
    //         end: YM + "-10",
    //     },
    //     {
    //         calendarId: "1",
    //         category: "time",
    //         id: 999,
    //         title: "Repeating Event",
    //         start: YM + "-30T16:00:00",
    //     },
    //     {
    //         calendarId: "1",
    //         title: "Repeating Event",
    //         category: "time",
    //         id: 999,
    //         start: YM + "-16T16:00:00",
    //     },
    //     {
    //         calendarId: "1",
    //         title: "Conference",
    //         start: YESTERDAY,
    //         end: TOMORROW,
    //         category: "time",
    //     },
    //     {
    //         calendarId: "0",
    //         title: "Meeting",
    //         start: TODAY + "T10:30:00",
    //         end: TODAY + "T12:30:00",
    //         category: "time",
    //     }
    // ]

    return(
        <Container fluid className="px-lg-4 px-xl-5">
            <section className="mb-3 mb-lg-5">
                <Row>
                    <Col lg={12} align={isLoading?'center':'left'}>
                        {isLoading?
                            <Preloader type={"wandering-cubes"} variant={'warning'} center/>
                            :
                            <Card className={'card-table h-100'}>
                                <Card.Header>
                                    <h4 className="card-heading">Calendar</h4>
                                </Card.Header>
                                <Calendar
                                    height="900px"
                                    view="month"
                                    calendars={calendars}
                                    disableDblClick={true}
                                    disableClick={true}
                                    isReadOnly={true}
                                    month={{
                                        startDayOfWeek: 0,
                                    }}
                                    schedules={schedules.toJS()}
                                    scheduleView
                                    taskView
                                    theme={themeConfig}
                                    timezones={[
                                        {
                                            timezoneOffset: 540,
                                            displayLabel: "GMT+09:00",
                                            tooltip: "Seoul",
                                        },
                                        // {
                                        //     timezoneOffset: -420,
                                        //     displayLabel: "GMT-08:00",
                                        //     tooltip: "Los Angeles",
                                        // },
                                    ]}
                                    useDetailPopup
                                    // useCreationPopup
                                    week={{
                                        showTimezoneCollapseButton: true,
                                        timezonesCollapsed: true,
                                    }}
                                />
                            </Card>
                        }
                    </Col>
                </Row>
            </section>
        </Container>
    )
}