export const minutesToTimeString = (minutes: number) => {
    const durationHours = Math.floor(minutes/60)

    const durationMinutes = minutes - durationHours*60

    // Adds leading zero if necessary
    const leadingZeroPrefix = durationMinutes < 10 ? "0" : ""

    return `${durationHours}:${leadingZeroPrefix}${durationMinutes}`
}