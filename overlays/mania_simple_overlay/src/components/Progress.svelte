<script lang="ts">
    export let percent: number;
</script>

<div class="separator">
    <div class="progress" style="width: {Math.max(0, Math.min(100, percent))}%">
        <div class="dot" />
    </div>
</div>

<style>
    .progress {
        position: relative;
        background-color: azure;
        height: 100%;
    }
    .dot {
        position: absolute;
        top: 50%;
        right: 0;
        height: 300%;
        background-color: azure;
        border-radius: 9999px;
        aspect-ratio: 1;
        transform: translate(50%, -50%);
        box-shadow: 0 0 5px 2px azure;
    }
</style>