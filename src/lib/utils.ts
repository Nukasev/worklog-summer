export const space = " ";

type minuteTens = "0" | "1" | "2" | "3" | "4" | "5";
type minuteOnes = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type minuteString = `${minuteTens}${minuteOnes}`;

type earlyHours = minuteOnes;
type midHours = `1${minuteOnes}`;
type lateHourOnes = Exclude<minuteTens, "4" | "5">;
type lateHours = `2${lateHourOnes}`;

type hourString = earlyHours | midHours | lateHours;

export type timeString = `${hourString}:${minuteString}`;

export const minutesToTimeString = (minutes: number): timeString => {
  const durationHours = Math.floor(minutes / 60);

  const durationMinutes = minutes - durationHours * 60;

  // Adds leading zero if necessary
  const leadingZeroPrefix = durationMinutes < 10 ? "0" : "";

  return `${durationHours}:${leadingZeroPrefix}${durationMinutes}` as timeString;
};

export const timeStringToMinutes = (timeString: timeString): number => {
  const timeSplit = timeString.split(":");

  if (timeSplit.length !== 2) {
    //TODO: error handling
  }

  const hours = parseInt(timeSplit[0]);
  const minutes = parseInt(timeSplit[1]);
  const durationInMinutes = hours * 60 + minutes;

  return durationInMinutes;
};
