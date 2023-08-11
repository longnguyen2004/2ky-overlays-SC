<script lang="ts">
  import "@overlay-fonts/made-tommy";
  import companion, {
    GameStates,
    type Tokens,
  } from "osu-stream-companion-store";
  import anime from "animejs";
  import { afterUpdate } from "svelte";
  import { fade } from "svelte/transition";
  import { MD5 } from "object-hash";
  import { config } from "./lib/config";
  import * as Client from "./lib/api";

  import type { ScoreEntry } from "./lib/api";
    import Leaderboard from "./components/Leaderboard.svelte";

  let fetcher: Client.ApiClient;
  const server = config.servers.find(({ name }) => name === config.current);
  if (!server) {
    console.error(
      "Selected server is not in the server list!\n" +
        `Selected server: ${config.current}\n` +
        `Server list: ${config.servers.map((el) => el.name).join(", ")}`
    );
  } else {
    switch (server.type) {
      case "osu_v1": {
        fetcher = new Client.OsuV1(server.endpoint, server.api_key);
        break;
      }
      case "osu_v2": {
        const { endpoint, auth_endpoint, client_id, client_secret } = server;
        fetcher = new Client.OsuV2(
          endpoint,
          auth_endpoint,
          client_id,
          client_secret
        );
        break;
      }
      case "akatsuki_v1": {
        fetcher = new Client.AkatsukiV1(server.endpoint);
        break;
      }
    }
  }

  const tokens = [
    "currentMaxCombo",
    "score",
    "username",
    "acc",
    "mapid",
    "gameMode",
    "status",
  ] as const satisfies readonly Tokens[];
  const store = companion("localhost:20727", tokens);

  $: ({ values } = $store);
  $: ({ gameMode, mapid } = values);
  $: current = {
    username: values.username || "",
    accuracy: values.acc || 0,
    score: values.score || 0,
    max_combo: values.currentMaxCombo || 0,
    timestamp: "now",
  };
  $: isGameplay =
    values.status &&
    [GameStates.Playing, GameStates.Watching].includes(values.status);

  const {
    count: cardCount,
    width: cardWidth,
    height: cardHeight,
    gap: cardGap,
  } = config.card;
</script>

<main
  style="
    --card-count: {cardCount};
    --card-width: {cardWidth}px;
    --card-height: {cardHeight}px;
    --card-gap: {cardGap}px
  "
>
  {#if isGameplay && gameMode !== undefined}
    {#await fetcher.getMapLeaderboard(mapid || -1, gameMode) then res}
      {@const { scores: leaderboard, limit } = res}
      {@const scores = [...(leaderboard || []), current]}
      <Leaderboard {scores} {limit} {cardWidth} {cardHeight} {cardCount} {cardGap} />
    {/await}
  {/if}
</main>
