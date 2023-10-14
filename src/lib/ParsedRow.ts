import { space, timeStringToMinutes } from "./utils";

export class ParsedRow {
  row: string;
  key: string;
  startTimeInMinutes: number;
  endTimeInMinutes: number;
  durationInMinutes: number;

  constructor(row: string) {
    this.row = row;
    const indexOfFirstSpace = row.indexOf(space);
    this.key = row.substring(indexOfFirstSpace + 1);
    const timeString = row.substring(0, indexOfFirstSpace);
    const timeStringSplit = timeString.split("-");

    if (timeStringSplit.length !== 2) {
      //TODO: error handling
    }

    const startTime = timeStringSplit[0];
    this.startTimeInMinutes = timeStringToMinutes(startTime);

    const endTime = timeStringSplit[1];
    this.endTimeInMinutes = timeStringToMinutes(endTime);

    this.durationInMinutes = this.endTimeInMinutes - this.startTimeInMinutes;

    if (this.durationInMinutes < 0) {
      //TODO: error handling
    }
  }
}
