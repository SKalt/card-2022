<script lang="ts">
  import { browser } from "$app/environment";
  import { base } from "$app/paths";
  let canvas: HTMLCanvasElement;
  import { doTheThing } from "$lib/main";
  import { onMount } from "svelte";

  if (browser) {
    onMount(() => {
      doTheThing(canvas, base);
    });
  }
</script>

<svelte:body style="background-color: black; " />
<canvas bind:this={canvas} />

<style>
  canvas {
    width: 100vw;
    height: 100vh;
  }
</style>
