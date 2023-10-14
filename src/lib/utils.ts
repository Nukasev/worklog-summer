export const minutesToTimeString = (minutes: number) => {
  const durationHours = Math.floor(minutes / 60);

  const durationMinutes = minutes - durationHours * 60;

  // Adds leading zero if necessary
  const leadingZeroPrefix = durationMinutes < 10 ? "0" : "";

  return `${durationHours}:${leadingZeroPrefix}${durationMinutes}`;
};

export const buildOutputRowString = (
  row: string,
  key: string,
  durationInMinutes: number,
  minuteSums: MinuteSums
) => {
  return `${row} DURATION: ${minutesToTimeString(
    durationInMinutes
  )} CUMULATIVE: ${minutesToTimeString(minuteSums.get(key))}`;
};

type sumsDictType = { [key: string]: number };
export class MinuteSums {
  #data: sumsDictType = {};

  #sumsBuilt = false;
  #sumRows: string[] = [];
  #lunchlessMinutes: number = 0;
  #totalMinutes: number = 0;

  addMinutes(key: string, durationInMinutes: number) {
    if (!(key in this.#data)) {
      this.#data[key] = 0;
    }

    this.#data[key] += durationInMinutes;
  }

  get(key: string) {
    return this.#data[key];
  }

  /**
   * Check whether the sums/totals have been built and builds them if not, then sets them as built.
   * Done in single m,ethod to keep things DRY.
   */
  #buildSums() {
    if (this.#sumsBuilt) {
      return;
    }

    const lunchKeys: string[] = ["lounas", "lunch"];

    for (const currentKey in this.#data) {
      const minutesForKey = this.get(currentKey);
      const sumRow = `${currentKey}: ${minutesToTimeString(minutesForKey)}`;

      this.#sumRows.push(sumRow);
      this.#totalMinutes += minutesForKey;

      if (!lunchKeys.includes(currentKey)) {
        this.#lunchlessMinutes += minutesForKey;
      }
    }

    this.#sumsBuilt = true;
  }

  getSumRows() {
    this.#buildSums();
    return this.#sumRows;
  }

  getTotalMinutes() {
    this.#buildSums();
    return this.#totalMinutes;
  }

  getLunchlessMinutes() {
    this.#buildSums();
    return this.#lunchlessMinutes;
  }
}
