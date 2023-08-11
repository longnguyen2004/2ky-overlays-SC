<script lang="ts">
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	
	export let digit = 0;
	export let duration = 500;
	export let decreasing = false;

	const angle = tweened(digit * 36, { duration, easing: cubicOut });
	$: {
		let newAngle = digit * 36;
		angle.update(prev => {
			let setAngle = newAngle;
			if (decreasing)
				while (setAngle > prev) setAngle -= 360;
			else
				while (setAngle < prev) setAngle += 360;
			return setAngle;
		}).then(() => angle.set(newAngle, { duration: 0 }));
	}
</script>

<div class="cylinder">
	<div class="digits" style="--rotate-angle: {$angle}deg">
		<span class="placeholder">0</span>
		{#each { length: 10 } as _, i}
			<span class="digit" style="--angle: -{36 * i}deg" inert={digit !== i}>{i}</span>
		{/each}
	</div>
</div>

<style>
	.cylinder {
		--font-size-fallback: var(--font-size, 1rem);
		--line-height-fallback: var(--line-height, 1.5);
		--div-height: calc(var(--font-size-fallback) * var(--line-height-fallback));
		--circumference: calc(var(--div-height) * 10);
		--radius: calc(var(--circumference) / pi / 2);

		font-family: var(--font-family, inherit);
		font-weight: var(--font-weight, normal);
		font-size: var(--font-size-fallback);
		line-height: var(--line-height-fallback);
		overflow-y: hidden;
	}
	.digits {
		position: relative;
		transform-style: preserve-3d;
		transform: rotateX(var(--rotate-angle)) perspective(10000px);
	}
	.digit {
		position: absolute;
		top: 0;
		left: 0;
		transform:
			rotateX(var(--angle))
			translateZ(var(--radius));
		backface-visibility: hidden;
	}
	.placeholder {
		visibility: hidden;
	}
</style>
