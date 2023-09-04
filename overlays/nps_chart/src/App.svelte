<script lang="ts">
  import "@overlay-fonts/made-tommy";
  import companion, { isPlaying, Mods } from "osu-stream-companion-store";
  import { fade } from "svelte/transition";
  import NPS from "./nps";
  import NpsChart from "./NpsChart.svelte";

  const nps = new NPS(1);
  const store = companion("localhost:20727", [
    "c300",
    "c100",
    "c50",
    "geki",
    "katsu",
    "miss",
    "status",
    "time",
    "modsEnum"
  ]);

  let prev = 0;
  let curNps = 0;

  let chartInterval = 200;
  let chartValueCount = 100;
  let npsArr = Array<number>(chartValueCount).fill(0);

  setInterval(() => (npsArr = [...npsArr.slice(1), curNps]), chartInterval);

  $: ({ values } = $store);
  $: playing = isPlaying(values.status!)
  $: {
    const { c300, c100, c50, geki, katsu, miss, time, modsEnum } = values;
    if (playing && time !== undefined) {
      let rate = 1;
      if (modsEnum)
      {
        if (modsEnum & Mods.DoubleTime)
          rate = 1.5;
        else if (modsEnum & Mods.HalfTime)
          rate = 0.75;
      };

      const cur =
        (c300 || 0) +
        (c100 || 0) +
        (c50 || 0) +
        (geki || 0) +
        (katsu || 0) +
        (miss || 0);

      nps.update(time / rate);
      if (cur - prev < 100)
        // Bad heuristics, find something better
        nps.add(cur - prev);
      prev = cur;
      curNps = nps.get();
    } else {
      prev = curNps = 0;
    }
  }
</script>

{#if playing}
  <div transition:fade>
    <span>{curNps} Nps</span>
    <NpsChart {npsArr} />
  </div>
{/if}

<style>
  div {
    display: flex;
    flex-direction: column;
    width: 400px;
  }
  span {
    align-self: flex-end;
    font-family: MADE TOMMY;
    font-size: 20pt;
    font-weight: bold;
    color: white;
  }
</style>