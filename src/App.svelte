<script lang="ts">
  import { minutesToTimeString } from "./lib/utils";

  let inputText: string = "Place input here.";
  let outputText: string = "Output will appear here.";

  const processInput = () => {
    // TODO: lounaan huomiointi
    // TODO: testboxeille korkeutta lisää

    const rows = inputText.split("\n");

    const nonEmptyRows = rows
      .filter((row) => row.length > 0)
      .map((row) => row.trim());
    // TODO: jonkinlainen check sille, että aikaväleissä ei ole gappeja eikä päällekkäisyyksiä
    // - gapit voi täyttää ja huomioita outputissa että herää pahvi

    const outputRows: string[] = []

    //TODO: shrink consecutive whitespaces

    type sumsDictType = { [key: string]: number };
    let minuteSums: sumsDictType = {};

    // Note the extra to force at least one occurrence.
    // TODO: only split by the first space to allow whitespace in the key
    let rowSplitRegex = /\s\s*/;

    for (const currentRow of nonEmptyRows) {
      const split = currentRow.split(rowSplitRegex);

      if (split.length !== 2) {
        //TODO: error handling
      }

      const timeString = split[0];

      const timeStringSplit = timeString.split("-");

      if (timeStringSplit.length !== 2){
        //TODO: error handling
      }
      
      //TODO: aikojen splittaus fiksummin/more DRY
      const startTime= timeStringSplit[0]
      const startTimeSplit= startTime.split(':')

      if (startTimeSplit.length !== 2){
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

      const key: string = split[1];

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
    height: 200px;
    resize: none;
  }
</style>
