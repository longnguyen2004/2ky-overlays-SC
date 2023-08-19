<script lang="ts">
    import { autoscroll } from "svelte-autoscroll";
    import Judgment from "../components/Judgment.svelte";
    import HitRatio from "../components/HitRatio.svelte";
    import { config } from "../lib/config";

    import type { SCStore } from "osu-stream-companion-store";
    export let store: SCStore;
    const { left_box, right_box, l_r, l_g, l_b, r_r, r_g, r_b, subtitle } = config;

    $: ({
        geki: c320, c300, katsu: c200, c100, c50, miss,

        acc, currentMaxCombo, mStars, liveStarRating,
        unstableRate, ppIfMapEndsNow,

        artistRoman, titleRoman, creator, diffName        
    } = $store.values);
</script>

<div class="card">
    <section class="stats">
        <div class="left-box" style="background-color: rgb({l_r}, {l_g}, {l_b})">
            {#if left_box === "star"}
                <span>STAR RATE</span>
                <span class="value">{(mStars ?? 0).toFixed(2)}</span>
            {:else if left_box === "star_live"}
                <span>LIVE STAR RATE</span>
                <span class="value">{(liveStarRating ?? 0).toFixed(2)}</span>
            {:else if left_box === "acc"}
                <span>ACCURACY</span>
                <span class="value">{(acc ?? 0).toFixed(2)}</span>
            {:else}
                <span>MAX-COMBO</span>
                <span class="value">{currentMaxCombo ?? 0}</span>
            {/if}
        </div>
        <div class="right-box" style="background-color: rgb({r_r}, {r_g}, {r_b})">
            {#if right_box === "ur"}
                <span>UR</span>
                <span class="value">{(unstableRate ?? 0).toFixed(2)}</span>
            {:else}
                <span>PP</span>
                <span class="value">{(ppIfMapEndsNow ?? 0).toFixed(0)}</span>
            {/if}
        </div>
    </section>
    <div class="separator" />
    <section class="info">
        <span class="title" use:autoscroll={{ axis: "x" }}>
            {artistRoman} - {titleRoman}
        </span>
        <span class="subtitle">
            {#if subtitle === "mapper"}
                mapper: {creator}
            {:else}
                [{diffName}]
            {/if}
        </span>
    </section>
    <HitRatio {c320} {c300} {c200} {c100} {c50} {miss} />
    <section class="judgment">
        <Judgment label="320" value={c320 ?? 0} color="var(--color-c320)" />
        <Judgment label="300" value={c300 ?? 0} color="var(--color-c300)" />
        <Judgment label="200" value={c200 ?? 0} color="var(--color-c200)" />
        <Judgment label="100" value={c100 ?? 0} color="var(--color-c100)" />
        <Judgment label="50" value={c50 ?? 0} color="var(--color-c50)" />
        <Judgment label="miss" value={miss ?? 0} color="var(--color-miss)" />
    </section>
</div>

<style>
    .card {
        width: 500px;
        height: 220px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .info {
        display: flex;
        flex-direction: column;
    }
    .stats {
        height: 33px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        font-weight: bold;
    }
    .stats > div {
        height: 100%;
        padding: 1rem 0.5rem 1rem 1rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        border-radius: 9999px;
    }
    .left-box {
        width: 55%;
    }
    .right-box {
        width: 35%;
    }
    .value {
        border-radius: 30px;
        background-color: rgba( 0, 0, 0, 0.6 );
        font-size: 15pt;
        padding: 0 12px;
        color: white;
    }
    .judgment {
        display: flex;
        flex-direction: row;
        gap: 5pt;
    }
    .title, .subtitle {
        max-width: 100%;
        margin: 0 auto;
        font-weight: bold;
        color: white;
        overflow: hidden;
        white-space: nowrap;
    }
    .title {
        font-size: 17pt;
    }
    .subtitle {
        font-size: 14pt;
    }
</style>