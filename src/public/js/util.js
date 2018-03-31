function padTime(time) {
    return (time < 10) ? `0${time}` : time;
}
function getTimestamp() { // eslint-disable-line
    const today = new Date();
    const h = padTime(today.getHours());
    const m = padTime(today.getMinutes());
    const d = padTime(today.getDate());
    const mo = padTime(today.getMonth());
    const y = today.getFullYear();
    return `${h}:${m}&nbsp&nbsp${d}/${mo}/${y}`;
}
