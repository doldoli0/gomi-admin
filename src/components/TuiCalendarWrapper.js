// #components/TuiCalendarWrapper
import React from 'react'
import Calendar from '@toast-ui/react-calendar'

export default (props) => (
    // 3. 넘겨받은 `forwardedRef`를 진짜 컴포넌트에 넘긴다.
    <Calendar {...props} ref={props.forwardedRef}/>
)