<script lang="ts">
  import { minutesToTimeString } from "./lib/utils";

  let inputText: string = "Place input here.";
  let outputText: string = "Output will appear here.";

  const processInput = () => {
    // TODO: lounaan huomiointi

    const rows = inputText.split("\n");
    const space = " ";
    const consecutiveWhitespaceRegex = /\s{2,}/;

    const cleanedRows = rows
      // Remove leading/trailing whitespace
      .map((row) => row.trim())
      // Shrink consecutive whitespace characters to spaces
      .map((row) => row.replace(consecutiveWhitespaceRegex, space))
      // Only nonempty rows
      .filter((row) => row.length > 0);

    // TODO: jonkinlainen check sille, että aikaväleissä ei ole gappeja eikä päällekkäisyyksiä
    // - gapit voi täyttää ja huomioida outputissa että herää pahvi

    const outputRows: string[] = [];

    type sumsDictType = { [key: string]: number };
    let minuteSums: sumsDictType = {};

    for (const currentRow of cleanedRows) {
      const indexOfFirstSpace = currentRow.indexOf(space);
      const timeString = currentRow.substring(0, indexOfFirstSpace);
      const timeStringSplit = timeString.split("-");

      if (timeStringSplit.length !== 2) {
        //TODO: error handling
      }

      //TODO: aikojen splittaus fiksummin/more DRY
      const startTime = timeStringSplit[0];
      const startTimeSplit = startTime.split(":");

      if (startTimeSplit.length !== 2) {
        //TODO: error handling
      }

      const startTimeHours = parseInt(startTimeSplit[0]);
      const startTimeMinutes = parseInt(startTimeSplit[1]);

      const endTime = timeStringSplit[1];
      const endTimeSplit = endTime.split(":");

      if (endTimeSplit.length !== 2) {
        //TODO: error handling
      }

      const endTimeHours = parseInt(endTimeSplit[0]);
      const endTimeMinutes = parseInt(endTimeSplit[1]);

      const durationInMinutes =
        endTimeHours * 60 +
        endTimeMinutes -
        startTimeHours * 60 -
        startTimeMinutes;

      if (durationInMinutes < 0) {
        //TODO: error handling
      }

      const key: string = currentRow.substring(indexOfFirstSpace + 1);

      if (!(key in minuteSums)) {
        minuteSums[key] = 0;
      }

      minuteSums[key] += durationInMinutes;

      const rowOutput = `${currentRow} DURATION: ${minutesToTimeString(
        durationInMinutes
      )} CUMULATIVE: ${minutesToTimeString(minuteSums[key])}`;
      outputRows.push(rowOutput);
    }

    const sumRows: string[] = [];
    let totalMinutes: number = 0;
    for (const currentKey in minuteSums) {
      const minutesForKey = minuteSums[currentKey];
      const sumRow = `${currentKey}: ${minutesToTimeString(minutesForKey)}`;
      sumRows.push(sumRow);
      totalMinutes += minutesForKey;
    }

    outputText = `${outputRows.join("\n")}\n\nTOTALS:\n${sumRows.join(
      "\n"
    )}\n\nTOTAL TIME: ${minutesToTimeString(totalMinutes)}`;
  };
</script>

<main>
  <div id="input-area">
    <textarea bind:value={inputText} />
  </div>

  <div class="card">
    <button on:click={processInput}> Process input </button>
  </div>

  <div id="output-area">
    <textarea bind:value={outputText} />
  </div>
</main>

<style>
  textarea {
    min-width: 600px;
    width: 100%;
    height: 350px;
    resize: none;
  }
</style>
