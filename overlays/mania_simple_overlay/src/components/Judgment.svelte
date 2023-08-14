<script lang="ts">
    import Odometer from "svelte-odometer";

    export let label: string;
    export let value: number = 0;
    export let color: string;

    let labelElem: HTMLSpanElement;
    let oldValue = value;

    $: {
        if (oldValue < value) {
            labelElem.animate([
                { color },
                { color: "#898989" }
            ], { duration: 1600, direction: "normal", easing: "linear" });
        }
        oldValue = value;
    }
</script>

<div style="--highlight-color: {color}">
    <span bind:this={labelElem}>{label}</span>
    <Odometer
        number={value}
        --color="white"
        --font-size="18pt"
        --font-weight="bold"
        --font-family="GothicB, Helvetica, sans-serif"
    />
</div>

<style>
    div {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    span {
        color: #898989;
        font-weight: bold;
    }
</style>
