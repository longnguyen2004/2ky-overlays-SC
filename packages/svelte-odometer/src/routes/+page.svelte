<script lang="ts">
    import Odometer from "$lib";

    let number = 0;
</script>

<Odometer {number}
    --font-family="sans-serif"
    --font-weight="bold"
/>
<input type="number" bind:value={number} />
