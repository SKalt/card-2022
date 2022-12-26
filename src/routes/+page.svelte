<script lang="ts">
  import { browser } from "$app/environment";
  import { base } from "$app/paths";
  let canvas: HTMLCanvasElement;
  import { doTheThing } from "$lib/main";
  import { onMount } from "svelte";
  import { done, log } from "$lib/log";
  // const handleResize = (e: UIEvent) => {
  //   canvas.width
  // }
  if (browser) {
    onMount(() => {
      // let ctx = new WebGL2RenderingContext();
      doTheThing(canvas, base);
    });
  }
</script>

<canvas bind:this={canvas} />
{#if $done}
  <div class="message">Happy holidays from Baltimore, MD!</div>
{:else}
  <div class="message log">
    <progress max="100" value={$log.percent}>{$log.percent}%</progress>
    <pre>{$log.message}</pre>
  </div>
{/if}

<style>
  :global(body) {
    background-color: black;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  canvas {
    width: 100vw;
    height: 100vh;
  }
  div.message {
    position: absolute;
    color: white;
    bottom: 2em;
    text-align: center;
    font-size: xx-large;
    width: 100vw;
  }
  .log {
    font-size: large;
    bottom: 40vh;
  }
</style>
