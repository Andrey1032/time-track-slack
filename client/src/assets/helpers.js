export const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
};
export const countMissed = (data) => {
    return data
        ? convertStringInTime(
              data
                  ?.map((d) =>
                      d.underworking_time
                          ?.map((rt) => convertTimeInMinutes(rt.time))
                          .reduce((acc, val) => acc + val, 0)
                  )
                  .reduce((acc, val) => acc + val, 0)
          )
        : "";
};

export const countWorked = (data) => {
    return data
        ? convertStringInTime(
              data
                  ?.map((d) =>
                      d.reworked_time
                          ?.map((rt) => convertTimeInMinutes(rt.time))
                          .reduce((acc, val) => acc + val, 0)
                  )
                  .reduce((acc, val) => acc + val, 0)
          )
        : "";
};

export const converTimeInHoursMinutes = (time) => {
    return time?.slice(0, 5);
};
export const convertTimeInMinutes = (time) => {
    const t = time.split(":");
    return +t[0] * 60 + +t[1];
};
export const convertStringInTime = (str) => {
    const hours = Math.floor(str / 60);
    const minutes = str % 60;
    return `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
    }`;
};
export const convertInterval = (interval) => {
    return `${converTimeInHoursMinutes(
        interval.start
    )} - ${converTimeInHoursMinutes(interval.end)}`;
};

export const convertDate = (date) => {
    const newDate = date.split("-").reverse();
    newDate[2] = newDate[2].slice(2, 4);
    return newDate.join(".");
};
