export function shouldElementBeSelected(
    selectedDate: Date,
    begin: Date,
    end: Date
): boolean {
    const selectedDateDayMonthYear = new Date(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        selectedDate.getUTCDate()
    );
    const beginDayMonthYear = new Date(
        begin.getUTCFullYear(),
        begin.getUTCMonth(),
        begin.getUTCDate()
    );
    const endDayMonthYear = new Date(
        end.getUTCFullYear(),
        end.getUTCMonth(),
        end.getUTCDate()
    );
    return (
        beginDayMonthYear.getTime() <= selectedDateDayMonthYear.getTime() &&
        selectedDateDayMonthYear.getTime() <= endDayMonthYear.getTime()
    );
}
