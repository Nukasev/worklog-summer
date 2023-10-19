import { MinuteSums } from "./MinuteSums";
import { ParsedRow } from "./ParsedRow";
import { minutesToTimeString, space } from "./utils";

export class InputProcessor {
  #rows: string[];
  #minuteSums: MinuteSums = new MinuteSums();
  #outputRows: string[] = [];

  constructor(inputText: string) {
    this.#rows = inputText.split("\n");
  }

  process = () => {
    const consecutiveWhitespaceRegex = /\s{2,}/;

    const cleanedRows = this.#rows
      // Remove leading/trailing whitespace
      .map((row) => row.trim())
      // Shrink consecutive whitespace characters to spaces
      .map((row) => row.replace(consecutiveWhitespaceRegex, space))
      // Only nonempty rows
      .filter((row) => row.length > 0);

    const outputRows = this._buildOutputRows(cleanedRows);

    const outputText = `${outputRows.join("\n")}\n\nTOTALS:\n${this.#minuteSums
      .getSumRows()
      .join("\n")}\n\nTOTAL TIME: ${minutesToTimeString(
      this.#minuteSums.getLunchlessMinutes()
    )}\nWITH LUNCH: ${minutesToTimeString(this.#minuteSums.getTotalMinutes())}`;

    return outputText;
  };

  _buildOutputRows = (cleanedRows: string[]): string[] => {
    const gapKey = "GAP";

    let hasGaps = false;
    let hasOverlaps = false;

    // Used to validate that the time ranges have no gaps/overlaps.
    let previousEndTimeInMinutes: number | null = null;

    for (const currentRow of cleanedRows) {
      const parsed = new ParsedRow(currentRow);

      // Shorthand to avoid repeated access
      const startTimeInMinutes = parsed.startTimeInMinutes;

      let hasGap = false;
      let hasOverlap = false;

      // Do not run validation of consecutive intervals on first iteration.
      if (previousEndTimeInMinutes !== null) {
        hasOverlap = startTimeInMinutes < previousEndTimeInMinutes;
        hasGap = startTimeInMinutes > previousEndTimeInMinutes;

        if (hasOverlap) {
          hasOverlaps = true;
          // TODO: error handling
        } else if (hasGap) {
          hasGaps = true;
          // Generate a gap row that is added in the output rows
          // between the previous row and the current row.
          const gapRow = `${minutesToTimeString(
            previousEndTimeInMinutes
          )}-${minutesToTimeString(startTimeInMinutes)} ${gapKey}`;

          const parsedGap = new ParsedRow(gapRow);

          this._insertRow(parsedGap);
        }
      }

      previousEndTimeInMinutes = parsed.endTimeInMinutes;

      this._insertRow(parsed);
    }

    return this.#outputRows;
  };

  /**
   * "Consumes" the row to update minuteSums and outputRows
   *
   */
  _insertRow = (parsed: ParsedRow): void => {
    this.#minuteSums.addMinutes(parsed.key, parsed.durationInMinutes);

    const rowOutput = this._buildOutputRowString(parsed);

    this.#outputRows.push(rowOutput);
  };

  _buildOutputRowString = (parsed: ParsedRow): string => {
    return `${parsed.row} DURATION: ${minutesToTimeString(
      parsed.durationInMinutes
    )} CUMULATIVE: ${minutesToTimeString(this.#minuteSums.get(parsed.key))}`;
  };
}
