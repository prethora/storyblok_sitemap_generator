export const convertDate = (dateStr, targetTimeZoneOffset) => {
    const dateObj = new Date(dateStr);

    // Local time zone offset in minutes (It's negative for time zones ahead of UTC)
    const localTimeZoneOffset = dateObj.getTimezoneOffset();

    // Convert target time zone offset from hours to minutes to match the Date object's offset
    const targetTimeZoneOffsetInMinutes = targetTimeZoneOffset * 60;

    // Calculate the total shift in minutes
    // We add here because the local time zone offset is negative for time zones ahead of UTC,
    // so effectively we're subtracting it when we want to find the difference.
    const totalShiftInMinutes = targetTimeZoneOffsetInMinutes + localTimeZoneOffset;

    // Create a new Date object shifted by the total offset in milliseconds
    const shiftedDate = new Date(dateObj.getTime() + totalShiftInMinutes * 60 * 1000);

    // Extract and return the components in the target time zone using local time functions
    const year = shiftedDate.getFullYear();
    const month = (shiftedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = shiftedDate.getDate().toString().padStart(2, '0');
    const hours = shiftedDate.getHours().toString().padStart(2, '0');
    const minutes = shiftedDate.getMinutes().toString().padStart(2, '0');
    const seconds = shiftedDate.getSeconds().toString().padStart(2, '0');
    const sign = (targetTimeZoneOffset < 0) ? "-" : "+";
    const timezone = sign + Math.abs(targetTimeZoneOffset).toString().padStart(2, '0') + ":00";

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezone}`;
}