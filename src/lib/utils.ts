export const space = " ";

export const minutesToTimeString = (minutes: number) => {
  const durationHours = Math.floor(minutes / 60);

  const durationMinutes = minutes - durationHours * 60;

  // Adds leading zero if necessary
  const leadingZeroPrefix = durationMinutes < 10 ? "0" : "";

  return `${durationHours}:${leadingZeroPrefix}${durationMinutes}`;
};

export const timeStringToMinutes = (timeString: string) => {
  const timeSplit = timeString.split(":");

  if (timeSplit.length !== 2) {
    //TODO: error handling
  }

  const hours = parseInt(timeSplit[0]);
  const minutes = parseInt(timeSplit[1]);
  const durationInMinutes = hours * 60 + minutes;

  return durationInMinutes;
};
