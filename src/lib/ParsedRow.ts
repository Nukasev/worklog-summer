import { space, timeStringToMinutes, type timeString } from "./utils";

const errorPrefix = "ERROR:";
export class ParsedRow {
  row: string;
  key: string | null = null;
  note: string | null = null;
  error: string | null = null;
  startTimeInMinutes: number | null = null;
  endTimeInMinutes: number | null = null;
  durationInMinutes: number | null = null;

  constructor(row: string) {
    this.row = row;
    const indexOfFirstSpace = row.indexOf(space);

    if (indexOfFirstSpace === -1) {
      this.error = `${errorPrefix} Could not parse, make sure that there is some whitespace after the time interval.`;
      return;
    }

    this.key = row.substring(indexOfFirstSpace + 1);
    const durationString = row.substring(0, indexOfFirstSpace);
    const durationStringSplit = durationString.split("-");

    if (durationStringSplit.length !== 2) {
      this.error = `${errorPrefix} Could not parse, make sure that there only one dash (-) in the time interval.`;
      return;
    }

    const startTime = durationStringSplit[0] as timeString;
    this.startTimeInMinutes = timeStringToMinutes(startTime);

    const endTime = durationStringSplit[1] as timeString;
    this.endTimeInMinutes = timeStringToMinutes(endTime);

    this.durationInMinutes = this.endTimeInMinutes - this.startTimeInMinutes;

    if (this.durationInMinutes < 0) {
      this.error = `${errorPrefix} Could not parse, make sure that the start time is before the end time.`;
    }
  }
}
