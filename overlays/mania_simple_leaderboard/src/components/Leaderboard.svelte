<script lang="ts">
    import anime, { type AnimeInstance } from "animejs";
    import { afterUpdate } from "svelte";
    import type { ScoreEntry } from "../lib/api";
    export let cardWidth: number;
    export let cardHeight: number;
    export let cardCount: number;
    export let cardGap: number;

    export let scores: ScoreEntry[];
    export let currentScore: ScoreEntry;
    export let limit: number;
    export let hasher: (score: ScoreEntry, index: number) => string;

    $: hashedScores = scores.map((score, index) => ({
        ...score,
        hash: hasher(score, index),
    }));
    $: hashedCurrentScore = {
        ...currentScore,
        hash: hasher(currentScore, -1),
    };

    let leaderboard: HTMLDivElement;
    const scrollDuration = 1000;
    let currentIndex = 0;
    let prevAnim: AnimeInstance;

    afterUpdate(() => {
        if (!leaderboard) return;
        const elem = leaderboard.querySelector(".current") as HTMLElement;
        if (elem) {
            const newIndex = +(elem.getAttribute("data-index") ?? 0);
            if (currentIndex != newIndex) {
                const below = [...leaderboard.children].slice(
                    newIndex + 1,
                    currentIndex + 1
                );
                const delta = newIndex - currentIndex;
                currentIndex = newIndex;
                const numCardsOnTop = Math.floor(cardCount / 2);
                anime({
                    targets: leaderboard,
                    scrollTop: Math.max(
                        0,
                        elem.offsetTop - numCardsOnTop * (cardHeight + cardGap)
                    ),
                    duration: scrollDuration,
                    easing: "easeOutCubic",
                });
                if (delta >= 0) return;
                let currentTransform = 0;
                if (prevAnim)
                    currentTransform =
                        +prevAnim.animations[0].currentValue.replace("px", "");
                prevAnim = anime({
                    targets: elem,
                    translateY: {
                        value: [
                            currentTransform - delta * (cardHeight + cardGap),
                            0,
                        ],
                        duration: scrollDuration,
                    },
                    translateX: {
                        value: [50, 0],
                        duration: 500,
                    },
                    easing: "easeOutCubic",
                });
                anime({
                    targets: below,
                    translateY: [-(cardHeight + cardGap), 0],
                    duration: scrollDuration,
                    easing: "easeOutCubic",
                });
            }
        }
    });

    function scoreSorter(a: ScoreEntry, b: ScoreEntry) {
        const diff = b.score - a.score;
        if (diff != 0) return diff;
        return +!!b.current - +!!a.current;
    }
</script>

<div
    class="leaderboard"
    bind:this={leaderboard}
    style="
        --card-count: {cardCount};
        --card-width: {cardWidth}px;
        --card-height: {cardHeight}px;
        --card-gap: {cardGap}px
    "
>
    {#each [...hashedScores, hashedCurrentScore].sort(scoreSorter) as { username, accuracy, score, max_combo, current, hash }, i (hash)}
        <div class="score-card" class:current data-index={i}>
            <span class="rank">
                {current && i >= limit ? "#??" : `#${i + 1}`}
            </span>
            <span class="name">{username}</span>
            <span class="score">{score}</span>
            <span class="acc">{accuracy?.toFixed(2) ?? "--"}%</span>
            <span class="maxc">{max_combo}x</span>
        </div>
    {/each}
</div>

<style>
    .leaderboard {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: var(--card-gap);

        height: calc(
            var(--card-count) * var(--card-height) + (var(--card-count) - 1) *
                var(--card-gap)
        );
        overflow-x: visible;
        overflow-y: hidden;
    }
    .score-card {
        display: grid;
        grid-template-columns: min-content 1fr min-content;
        grid-template-areas:
            "rank name acc"
            "rank score maxc";
        align-items: center;
        width: var(--card-width);
        height: var(--card-height);
        min-height: var(--card-height);
        padding: 0.5rem;
        background-image: url(../assets/bg3.png);
        background-color: darkgray;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: top;
        background-blend-mode: multiply;
    }
    .score-card:not(.current) {
        filter: brightness(50%);
        z-index: -1;
    }
    .rank {
        grid-area: rank;
        padding: 0;
        width: 3.5rem;
        text-align: center;
        font-size: 18pt;
        font-weight: bold;
        color: azure;
    }
    .name {
        grid-area: name;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: azure;
    }
    .score {
        grid-area: score;
        color: azure;
        font-size: 15pt;
    }
    .acc {
        grid-area: acc;
        color: #93f0f4;
        font-size: 15pt;
        font-weight: bold;
    }
    .maxc {
        grid-area: maxc;
        color: #93f0f4;
    }
    .acc,
    .maxc {
        justify-self: end;
    }
    span {
        padding: 0 0.5rem;
        font-family: "MADE TOMMY";
    }
</style>
