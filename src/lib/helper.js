import moment from "moment";

export function datetimeToLocalDatetime (datetime = null) {
    if (datetime)
        return moment(datetime).format('YYYY-MM-DD[T]HH:mm');
    else
        return null;
}