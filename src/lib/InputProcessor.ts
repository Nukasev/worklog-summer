import { MinuteSums } from "./MinuteSums";
import { ParsedRow } from "./ParsedRow";
import { minutesToTimeString, space } from "./utils";

export class InputProcessor {
  #rows: string[];
  #minuteSums: MinuteSums = new MinuteSums();
  #outputRows: string[] = [];
  #hasErrors: boolean = false;
  #previousEndTimeInMinutes: number | null = null;

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

    return this._buildOutputString(outputRows);
  };

  _buildOutputRows = (cleanedRows: string[]): string[] => {
    // Used to validate that the time ranges have no gaps/overlaps.

    for (const currentRow of cleanedRows) {
      let parsed = new ParsedRow(currentRow);

      if (parsed.error !== null) {
        // _insertRow() can handle the errors; the loop should NOT be continued.
        this._insertRow(parsed);
        this.#hasErrors = true;
        break;
      }

      // Note that parsed can be overridden due to overlap-fixing.
      parsed = this._ensureConsecutiveIntervals(parsed);
      this.#previousEndTimeInMinutes = parsed.endTimeInMinutes;

      this._insertRow(parsed);
    }

    return this.#outputRows;
  };

  _ensureConsecutiveIntervals = (parsed: ParsedRow): ParsedRow => {
    // Do not run validation of consecutive intervals on first iteration.
    if (this.#previousEndTimeInMinutes === null) {
      return parsed;
    }

    // Shorthand to avoid repeated access.
    // TODO: fix type cast.
    const startTimeInMinutes = parsed.startTimeInMinutes as number;

    let hasGap = false;
    let hasOverlap = false;

    const startTimeString = minutesToTimeString(startTimeInMinutes);
    const previousEndTimeString = minutesToTimeString(
      this.#previousEndTimeInMinutes
    );

    hasOverlap = startTimeInMinutes < this.#previousEndTimeInMinutes;
    hasGap = startTimeInMinutes > this.#previousEndTimeInMinutes;

    if (hasOverlap) {
      // Note that parsed is overridden here.
      parsed = this._fixOverlap(parsed, previousEndTimeString, startTimeString);
    } else if (hasGap) {
      this._fixGap(previousEndTimeString, startTimeString);
    }

    return parsed;
  };

  _fixOverlap = (
    parsed: ParsedRow,
    previousEndTimeString: string,
    startTimeString: string
  ): ParsedRow => {
    // We assume that the error is in the current start time, fix that and
    // inform the user in the output.

    const overlapReplacedMessage = `NOTE: STARTING TIME CHANGED FROM ${startTimeString} TO ${previousEndTimeString} DUE TO OVERLAPS`;
    // TODO: fix type cast.
    const endTimeString = minutesToTimeString(
      parsed.endTimeInMinutes as number
    );

    const fixedRow = `${previousEndTimeString}-${endTimeString} ${parsed.key}`;

    // Override parsed so we can _insertRow() as usual in the main loop.
    parsed = new ParsedRow(fixedRow);
    parsed.note = overlapReplacedMessage;
    return parsed;
  };

  _fixGap = (previousEndTimeString: string, startTimeString: string): void => {
    const gapKey = "GAP";
    // Generate a gap row that is added in the output rows
    // between the previous row and the current row.
    const gapRow = `${previousEndTimeString}-${startTimeString} ${gapKey}`;

    const parsedGap = new ParsedRow(gapRow);

    this._insertRow(parsedGap);
  };

  /**
   * "Consumes" the row to update minuteSums and outputRows
   *
   */
  _insertRow = (parsed: ParsedRow): void => {
    if (parsed.key !== null && parsed.durationInMinutes !== null) {
      this.#minuteSums.addMinutes(parsed.key, parsed.durationInMinutes);
    }

    const rowOutput = this._buildOutputRowString(parsed);

    this.#outputRows.push(rowOutput);
  };

  _buildOutputRowString = (parsed: ParsedRow): string => {
    if (parsed.error !== null) {
      return parsed.error;
    }
    /**
     * NOTE: The type casts here are a legitimate code smell
     * (implying a TODO of eradication),
     * but non-null error-field ensures that
     * the actual data fields are not null.
     */

    const durationString = `DURATION: ${minutesToTimeString(
      parsed.durationInMinutes as number
    )}`;

    const cumulativeString = `CUMULATIVE: ${minutesToTimeString(
      this.#minuteSums.get(parsed.key as string)
    )}`;

    const baseString = `${parsed.row} ${durationString} ${cumulativeString}`;

    const noteSuffix = parsed.note !== null ? `${space}${parsed.note}` : "";

    return `${baseString}${noteSuffix}`;
  };

  _buildOutputString = (outputRows: string[]): string => {
    const joinedOutputRows = `${outputRows.join("\n")}`;
    const joinedTotalRows = `${this.#minuteSums.getSumRows().join("\n")}`;
    const totalsString = `TOTALS:\n${joinedTotalRows}`;
    const lunchlessTotalString = `TOTAL TIME: ${minutesToTimeString(
      this.#minuteSums.getLunchlessMinutes()
    )}`;
    const totalString = `WITH LUNCH: ${minutesToTimeString(
      this.#minuteSums.getTotalMinutes()
    )}`;

    const allTotalsString = `\n\n\n${totalsString}\n\n${lunchlessTotalString}\n${totalString}`;

    // Do not display any totals if there are any parsing errors.
    const totalsSuffix = this.#hasErrors ? "" : allTotalsString;

    const outputText = `${joinedOutputRows}${totalsSuffix}`;

    return outputText;
  };
}
