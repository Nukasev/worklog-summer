import { space, timeStringToMinutes, type timeString } from "./utils";

export class ParsedRow {
  row: string;
  key: string;
  startTimeInMinutes: number;
  endTimeInMinutes: number;
  durationInMinutes: number;

  constructor(row: string) {
    this.row = row;
    const indexOfFirstSpace = row.indexOf(space);

    if (indexOfFirstSpace === -1) {
      //TODO: error handling
    }

    this.key = row.substring(indexOfFirstSpace + 1);
    const durationString = row.substring(0, indexOfFirstSpace);
    const durationStringSplit = durationString.split("-");

    if (durationStringSplit.length !== 2) {
      //TODO: error handling
    }
    if (durationStringSplit[0]) {
      //TODO: error handling
    }
    if (durationStringSplit[1]) {
      //TODO: error handling
    }

    const startTime = durationStringSplit[0] as timeString;
    this.startTimeInMinutes = timeStringToMinutes(startTime);

    const endTime = durationStringSplit[1] as timeString;
    this.endTimeInMinutes = timeStringToMinutes(endTime);

    this.durationInMinutes = this.endTimeInMinutes - this.startTimeInMinutes;

    if (this.durationInMinutes < 0) {
      //TODO: error handling
    }
  }
}
