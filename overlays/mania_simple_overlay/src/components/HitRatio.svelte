<script lang="ts">
    export let c320 = 0;
    export let c300 = 0;
    export let c200 = 0;
    export let c100 = 0;
    export let c50 = 0;
    export let miss = 0;

    $: total = c320 + c300 + c200 + c100 + c50 + miss;
</script>

<div class="separator">
    <div style="width: {c320 / total * 100}%" class="c320" />
    <div style="width: {c300 / total * 100}%" class="c300" />
    <div style="width: {c200 / total * 100}%" class="c200" />
    <div style="width: {c100 / total * 100}%" class="c100" />
    <div style="width: {c50  / total * 100}%" class="c50"  />
    <div style="width: {miss / total * 100}%" class="miss" />
</div>

<style>
    .separator {
        display: flex;
        flex-direction: row;
    }
    .c320 {
        background-color: var(--color-c320);
    }
    .c300 {
        background-color: var(--color-c300);
    }
    .c200 {
        background-color: var(--color-c200);
    }
    .c100 {
        background-color: var(--color-c100);
    }
    .c50 {
        background-color: var(--color-c50);
    }
    .miss {
        background-color: var(--color-miss);
    }
</style>