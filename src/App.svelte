<script lang="ts">
  import {
    MinuteSums,
    buildOutputRowString,
    minutesToTimeString,
  } from "./lib/utils";

  let inputText: string = "Place input here.";
  let outputText: string = "Output will appear here.";

  const processInput = () => {
    const rows = inputText.split("\n");
    const space = " ";
    const consecutiveWhitespaceRegex = /\s{2,}/;
    const gapKey = "GAP";

    let hasGaps = false;
    let hasOverlaps = false;

    const cleanedRows = rows
      // Remove leading/trailing whitespace
      .map((row) => row.trim())
      // Shrink consecutive whitespace characters to spaces
      .map((row) => row.replace(consecutiveWhitespaceRegex, space))
      // Only nonempty rows
      .filter((row) => row.length > 0);

    const outputRows: string[] = [];

    let minuteSums = new MinuteSums();

    // Used to validate that the time ranges have no gaps/overlaps.
    let previousEndTimeInMinutes = null;

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
      const startTimeInMinutes = startTimeHours * 60 + startTimeMinutes;

      const endTime = timeStringSplit[1];
      const endTimeSplit = endTime.split(":");

      if (endTimeSplit.length !== 2) {
        //TODO: error handling
      }

      const endTimeHours = parseInt(endTimeSplit[0]);
      const endTimeMinutes = parseInt(endTimeSplit[1]);
      const endTimeInMinutes = endTimeHours * 60 + endTimeMinutes;

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
          const gapDuration = startTimeInMinutes - previousEndTimeInMinutes;
          minuteSums.addMinutes(gapKey, gapDuration);
          const gapRow = `${minutesToTimeString(
            previousEndTimeInMinutes
          )}-${minutesToTimeString(startTimeInMinutes)} ${gapKey}`;
          const gapRowOutput = buildOutputRowString(
            gapRow,
            gapKey,
            gapDuration,
            minuteSums
          );
          outputRows.push(gapRowOutput);
        }
      }

      previousEndTimeInMinutes = endTimeInMinutes;

      const durationInMinutes = endTimeInMinutes - startTimeInMinutes;

      if (durationInMinutes < 0) {
        //TODO: error handling
      }

      const key: string = currentRow.substring(indexOfFirstSpace + 1);

      minuteSums.addMinutes(key, durationInMinutes);

      const rowOutput = buildOutputRowString(
        currentRow,
        key,
        durationInMinutes,
        minuteSums
      );

      outputRows.push(rowOutput);
    }

    outputText = `${outputRows.join("\n")}\n\nTOTALS:\n${minuteSums
      .getSumRows()
      .join("\n")}\n\nTOTAL TIME: ${minutesToTimeString(
      minuteSums.getLunchlessMinutes()
    )}\nWITH LUNCH: ${minutesToTimeString(minuteSums.getTotalMinutes())}`;
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
