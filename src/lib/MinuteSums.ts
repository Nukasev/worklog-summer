import { minutesToTimeString } from "./utils";

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
   * Done in single method to keep things DRY.
   */
  _buildSums() {
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
    this._buildSums();
    return this.#sumRows;
  }

  getTotalMinutes() {
    this._buildSums();
    return this.#totalMinutes;
  }

  getLunchlessMinutes() {
    this._buildSums();
    return this.#lunchlessMinutes;
  }
}
