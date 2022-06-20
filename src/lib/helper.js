export function datetimeToLocalDatetime (datetime = null) {
    let now;
    if (datetime)
        now = new Date(datetime);
    else
        return null;

    return now.toISOString().replace('Z', '');
}