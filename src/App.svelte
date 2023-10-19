<script lang="ts">
  import { InputProcessor } from "./lib/InputProcessor";

  let inputText: string = "Place input here.";
  let outputText: string = "Output will appear here.";

  const processInput = (): void => {
    const inputProcessor = new InputProcessor(inputText);
    outputText = inputProcessor.process();
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
