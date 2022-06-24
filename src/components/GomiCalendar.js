import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faRedo} from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
import {forwardRef, useRef} from "react";
import moment from "moment";
import Preloader from "./Preloader";


const TuiCalendar = dynamic(() => import('../components/TuiCalendarWrapper'), {ssr: false});
const CalendarWithForwardedRef = forwardRef((props, ref) => (
    <TuiCalendar {...props} forwardedRef={ref}/>
));

const GomiCalendar = ({calendars, schedules, calendarRef, isLoading, handleDeletePopup, handleCreatePopup, handleUpdatePopup}) => {


    const calendarItems = calendars.map((calendar, index) => {
        let color;
        switch (index) {
            case 0:
                color = {
                    bgColor: "#4650dd",
                    borderColor: "#4650dd",
                    color: "#fff",
                }
                break;
            case 1:
                color = {
                    bgColor: "#00a9ff",
                    borderColor: "#00a9ff",
                    color: "#fff",
                }
                break;
            case 2:
                color = {
                    bgColor: "#a9a24a",
                    borderColor: "#a9a24a",
                    color: "#fff",
                }
                break;
            default:
                color = {
                    bgColor: "#e00f0f",
                    borderColor: "#a80d0d",
                    color: "#fff",
                }
        }


        return ({
            id: calendar.id,
            name: calendar.name,
            bgColor: color.bgColor,
            borderColor: color.borderColor,
            color: color.color,
        })
    })

    const themeConfig = {
        // month day grid cell 'day'
        // "month.weekend.backgroundColor": "#fafafa",
        "common.border": "1px solid #ddd",
        "common.backgroundColor": "white",
        "common.holiday.color": "#ff1500",
        "common.saturday.color": "#135de6",
        "common.dayname.color": "#333",
        "common.today.color": "#009688",

        // creation guide style
        "common.creationGuide.backgroundColor": "rgba(19, 93, 230, 0.1)",
        "common.creationGuide.border": "1px solid #135de6",

        // month header 'dayname'
        "month.dayname.height": "42px",
        "month.dayname.borderLeft": "none",
        "month.dayname.paddingLeft": "0",
        "month.dayname.paddingRight": "0",
        "month.dayname.fontSize": "13px",
        "month.dayname.backgroundColor": "inherit",
        "month.dayname.fontWeight": "normal",
        "month.dayname.textAlign": "center",

        // month day grid cell 'day'
        "month.holidayExceptThisMonth.color": "#f3acac",
        "month.dayExceptThisMonth.color": "#bbb",
        "month.weekend.backgroundColor": "#fafafa",
        "month.day.fontSize": "16px",

        // month schedule style
        "month.schedule.height": "20px",
        "month.schedule.marginTop": "2px",
        "month.schedule.marginLeft": "10px",
        "month.schedule.marginRight": "10px",

        // month more view
        "month.moreView.boxShadow": "none",
        "month.moreView.paddingBottom": "0",
        "month.moreViewTitle.height": "28px",
        "month.moreViewTitle.marginBottom": "0",
        "month.moreViewTitle.backgroundColor": "#f4f4f4",
        "month.moreViewTitle.borderBottom": "1px solid #ddd",
        "month.moreViewTitle.padding": "0 10px",
        "month.moreViewList.padding": "10px",

        // week header 'dayname'
        "week.dayname.height": "41px",
        "week.dayname.borderTop": "1px solid #ddd",
        "week.dayname.borderBottom": "1px solid #ddd",
        "week.dayname.borderLeft": "1px solid #ddd",
        "week.dayname.paddingLeft": "5px",
        "week.dayname.backgroundColor": "inherit",
        "week.dayname.textAlign": "left",
        "week.today.color": "#009688",
        "week.pastDay.color": "#999",

        // week vertical panel 'vpanel'
        "week.vpanelSplitter.border": "1px solid #ddd",
        "week.vpanelSplitter.height": "3px",

        // week daygrid 'daygrid'
        "week.daygrid.borderRight": "1px solid #ddd",

        "week.daygridLeft.width": "100px",
        "week.daygridLeft.backgroundColor": "",
        "week.daygridLeft.paddingRight": "5px",
        "week.daygridLeft.borderRight": "1px solid #ddd",

        "week.today.backgroundColor": "inherit",
        "week.weekend.backgroundColor": "inherit",

        // week timegrid 'timegrid'
        "week.timegridLeft.width": "100px",
        "week.timegridLeft.backgroundColor": "#fafafa",
        "week.timegridLeft.borderRight": "1px solid #ddd",
        "week.timegridLeft.fontSize": "12px",
        "week.timegridLeftTimezoneLabel.height": "51px",
        "week.timegridLeftAdditionalTimezone.backgroundColor": "#fdfdfd",

        "week.timegridOneHour.height": "48px",
        "week.timegridHalfHour.height": "24px",
        "week.timegridHalfHour.borderBottom": "1px dotted #f9f9f9",
        "week.timegridHorizontalLine.borderBottom": "1px solid #eee",

        "week.timegrid.paddingRight": "10px",
        "week.timegrid.borderRight": "1px solid #ddd",
        "week.timegridSchedule.borderRadius": "0",
        "week.timegridSchedule.paddingLeft": "0",

        "week.currentTime.color": "#135de6",
        "week.currentTime.fontSize": "12px",
        "week.currentTime.fontWeight": "bold",

        "week.pastTime.color": "#999",
        "week.pastTime.fontWeight": "normal",

        "week.futureTime.color": "#333",
        "week.futureTime.fontWeight": "normal",

        "week.currentTimeLinePast.border": "1px solid rgba(19, 93, 230, 0.3)",
        "week.currentTimeLineBullet.backgroundColor": "#135de6",
        "week.currentTimeLineToday.border": "1px solid #135de6",
        "week.currentTimeLineFuture.border": "1px solid #135de6",

        // week creation guide style
        "week.creationGuide.color": "#135de6",
        "week.creationGuide.fontSize": "12px",
        "week.creationGuide.fontWeight": "bold",

        // week daygrid schedule style
        "week.dayGridSchedule.borderRadius": "0",
        "week.dayGridSchedule.height": "18px",
        "week.dayGridSchedule.marginTop": "2px",
        "week.dayGridSchedule.marginLeft": "10px",
        "week.dayGridSchedule.marginRight": "10px"
    }

    const handleCalendar = (type = 'today') => {
        const calendarInstance = calendarRef.current.getInstance();
        if (type === 'next') {
            calendarInstance.next();
        } else if (type === 'back') {
            calendarInstance.prev();
        } else {
            calendarInstance.today();
        }
    }

    const ScheduleItems = schedules.map((schedule) => (
        {
            'id':schedule.id,
            'calendarId': schedule.calendar_id,
            'start': moment(schedule.start_at).format('YYYY-MM-DD[T]hh:mm'),
            'end': moment(schedule.finish_at).format('YYYY-MM-DD[T]hh:mm'),
            'title': schedule.title,
            'category': 'time',
            'location': schedule.location,
            'attendees': schedule.users.map((user)=>user.user.name),
            'body': schedule.memo,
            'raw': {name:schedule.user.name},
        }
    ))

    return (
        <>
            <div className={'m-2'}>
                <Button onClick={() => handleCalendar('back')} className={'rounded-circle'}>
                    <FontAwesomeIcon icon={faArrowLeft}/>
                </Button>
                <Button onClick={() => handleCalendar('today')} className={'rounded-circle'}>
                    <FontAwesomeIcon icon={faRedo}/>
                </Button>
                <Button onClick={() => handleCalendar('next')} className={'rounded-circle'}>
                    <FontAwesomeIcon icon={faArrowRight}/>
                </Button>
            </div>
            <CalendarWithForwardedRef
                // onAfterRenderSchedule={onAfterRenderSchedule}
                onBeforeCreateSchedule={handleCreatePopup}
                onBeforeDeleteSchedule={handleDeletePopup}
                onBeforeUpdateSchedule={handleUpdatePopup}
                // scheduleCreationPopup={false}
                ref={calendarRef}
                usageStatistics={false}
                height="900px"
                view="month"
                calendars={calendarItems}
                // disableDblClick={true}
                disableClick={true}
                // isReadOnly={true}
                template={{
                    milestone(schedule) {
                        return `<span style="color:#333;background-color: ${schedule.bgColor};">${schedule.title}</span>`;
                    },
                    milestoneTitle() {
                        return "Milestone";
                    },
                    allday(schedule) {
                        return `${schedule.raw.name} - ${schedule.title}`;
                    },
                    alldayTitle() {
                        return "All Day";
                    },
                }}
                month={{
                    daynames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
                }}
                schedules={ScheduleItems}
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
                useCreationPopup={false}
                week={{
                    showTimezoneCollapseButton: true,
                    timezonesCollapsed: true,
                }}
            />
        </>
    )
}

export default GomiCalendar