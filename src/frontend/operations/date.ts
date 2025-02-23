export function toDate(date: string): Date {
    const [day, month, year] = date.split(' ')[0].split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}
export function getDateDayBefore(date: Date) {
    return new Date(date.setDate(date.getDate() - 1));
}