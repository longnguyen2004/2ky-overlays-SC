<script lang="ts">
	import NumberWheel from "./NumberWheel.svelte";
	import { fade } from "svelte/transition";
	import { tweened } from "svelte/motion";
	import { derived } from "svelte/store";
	
	function toDigits(num: number)
	{
		if (num === 0) return [{ place: 0, digit: 0 }];
		const digits = [];
		let place = 0;
		for (; num > 0; num = Math.floor(num / 10))
			digits.push({ place: place++, digit: num % 10 });
		return digits.reverse();
	}
	
	export let number = 0;

	let oldNumber = number;
	let decreasing = false;
	let decreasingAbs = false;
	
	const numberTweened = tweened(number, { duration: 1000 });
	const integerTweened = derived(numberTweened, val => decreasing ? Math.floor(val) : Math.ceil(val));
	
	$: {
		decreasing = number < oldNumber;
		decreasingAbs = Math.abs(number) < Math.abs(oldNumber);
		$numberTweened = oldNumber = (number ?? 0);
	}
</script>

<span class="number">
	{#if $integerTweened < 0}
		<span class="sign" transition:fade>-</span>
	{/if}
	{#each toDigits(Math.abs($integerTweened)) as { place, digit } (place)}
		<div transition:fade>
			<NumberWheel {digit} decreasing={decreasingAbs} />
		</div>
	{/each}
</span>

<style>
	.number {
		display: flex;
		flex-direction: row;
	}
</style>
