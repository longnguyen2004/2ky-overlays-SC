<script lang="ts">
  import companion, { GameStates } from "osu-stream-companion-store";
  import { tick } from "svelte";
  import { tweened } from "svelte/motion";
  import { linear, cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { config } from "../lib/config";
  import { tickColor, arrowColor } from "../lib/colors";

  const { tickDuration, avgWindow, colorful } = config;
  const store = companion("localhost:20727", ["mOD", "hitErrors", "status"]);

  function calculateHitWindow(od: number) {
    return [16, 64 - 3 * od, 97 - 3 * od, 127 - 3 * od, 188 - 3 * od];
  }
  function getPosition(offset: number, hitRange: number) {
    return Math.max(0, Math.min(1, (offset + hitRange) / 2 / hitRange));
  }
  function average(arr: number[]) {
    return arr.reduce((sum, value, _, arr) => sum + value / arr.length, 0);
  }

  let curHitErrors: number[] = [];
  let avgHitError = tweened(0, { duration: 500, easing: cubicOut });
  let prevLength = 0;

  let hitWindow: number[] = [];
  let hitRange: number = 0;

  $: ({ values } = $store);
  $: ({ hitErrors, status, mOD } = values);
  $: isPlaying =
    status && [GameStates.Playing, GameStates.Watching].includes(status);
  $: {
    hitWindow = calculateHitWindow(mOD ?? 0);
    hitRange = hitWindow.at(-1)!;
  }
  $: {
    curHitErrors = hitErrors ?? [];
    if (curHitErrors.length === 0) {
      // Reset tick count when the hit error array resets
      prevLength = 0;
      avgHitError.set(0, { duration: 0 });
    } else if (prevLength === 0 && curHitErrors.length > 20) {
      // Prevent huge number of ticks on site load
      prevLength = curHitErrors.length;
    }
    tick().then(() => (prevLength = curHitErrors.length));
  }
  $: $avgHitError = average(curHitErrors.slice(-avgWindow));
</script>

{#if isPlaying}
  <main transition:fade>
    <span
      class="arrow"
      style="
        left: {getPosition($avgHitError, hitRange) * 100}%;
        color: {colorful ? arrowColor($avgHitError, hitWindow) : 'white'}
      "
    >
      &#9660;
    </span>
    <div class="hits">
      <div class="tick center" />
      {#each curHitErrors.slice(prevLength) as hit ({})}
        <div
          class="tick"
          style="
            left: {getPosition(hit, hitRange) * 100}%;
            background-color: {colorful ? tickColor(hit, hitWindow) : 'white'}
          "
          out:fade={{ duration: tickDuration, easing: linear }}
        />
      {/each}
    </div>
  </main>
{/if}

<style>
  main {
    position: relative;
    width: 100%;
    max-width: 400px;
  }
  .hits {
    position: relative;
    width: 100%;
  }
  .tick {
    position: absolute;
    transform: translateY(0.5rem) translate(-50%, -50%);
    height: 1rem;
    width: 3px;
  }
  .center {
    left: 50%;
    height: 1.25rem;
    background-color: red;
    z-index: 1;
  }
  .arrow {
    display: inline-block;
    position: relative;
    transform: translateX(-50%) scale(75%) scaleX(175%);
  }
  .center {
    left: 50%;
  }
</style>
