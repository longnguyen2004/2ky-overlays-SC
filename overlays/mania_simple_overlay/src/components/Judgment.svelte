<script lang="ts">
    import Odometer from "svelte-odometer";

    export let label: string;
    export let value: number = 0;
    export let color: string;

    let oldValue = value;
    let highlighted = false;

    $: {
        if (oldValue < value) {
            highlighted = true;
            requestAnimationFrame(() => (highlighted = false));
        }
        oldValue = value;
    }
</script>

<div style="--highlight-color: {color}">
    <span class:highlighted>{label}</span>
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
        transition: color 1.6s 0s linear;
        font-weight: bold;
    }
    .highlighted {
        color: var(--highlight-color);
        transition: color 0s 0s linear;
    }
</style>
