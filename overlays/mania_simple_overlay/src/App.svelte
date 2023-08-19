<script lang="ts">
  import "@overlay-fonts/made-tommy";
  import companion, { GameStates } from "osu-stream-companion-store";
  import { fade } from "svelte/transition";
  import { config } from "./lib/config";
  import Normal from "./cards/Normal.svelte";

  const store = companion("localhost:20727", [
    // Judgments
    "c300",
    "c100",
    "c50",
    "geki",
    "katsu",
    "miss",

    // Map information
    "titleRoman",
    "artistRoman",
    "diffName",
    "creator",

    // Background
    "backgroundImageLocation",

    // Play stats
    "acc",
    "currentMaxCombo",
    "mStars",
    "liveStarRating",
    "unstableRate",
    "ppIfMapEndsNow",

    // Game status
    "osuIsRunning",
    "status",
  ]);

  $: ({ backgroundImageLocation } = $store.values);
  $: backgroundImageLink = backgroundImageLocation
    ? `http://localhost:20727/${backgroundImageLocation
        .slice(backgroundImageLocation.indexOf("Songs"))
        .replaceAll("\\", "/")}`
    : "";
  $: isPlaying =
    $store.values.status &&
    [GameStates.Playing, GameStates.Watching].includes($store.values.status);
</script>

{#if isPlaying}
  <main
    transition:fade
    style="
    --background: var(--bg-{config.background});
    --background-image: url('{config.mapBackground
      ? encodeURI(backgroundImageLink).replaceAll("'", '%27')
      : ''}')
  "
  >
    {#if config.simple === "on"}{:else}
      <Normal {store} />
    {/if}
  </main>
{/if}

<style>
  main {
    margin: 10px;
    font-family: "MADE TOMMY";
  }
</style>
