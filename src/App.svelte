<script lang="ts">
  import Instructions from "./Instructions.svelte";
  import { InputProcessor } from "./lib/InputProcessor";

  let inputText: string = "Place input here.";
  let outputText: string = "Output will appear here.";

  const processInput = (): void => {
    const inputProcessor = new InputProcessor(inputText);
    outputText = inputProcessor.process();
  };
</script>

<main>
  <Instructions />

  <div id="input-area">
    <textarea id="input-textarea" bind:value={inputText} />
  </div>

  <div class="card">
    <button on:click={processInput}> Process input </button>
  </div>

  <div id="output-area">
    <textarea id="output-textarea" bind:value={outputText} />
  </div>
</main>

<style>
  textarea {
    min-width: 900px;
    width: 100%;
    resize: none;
  }
  #input-textarea {
    height: 250px;
  }
  #output-textarea {
    height: 350px;
  }
</style>
