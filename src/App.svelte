<script lang="ts">
	import { onMount } from "svelte";
	import { GameService } from "./core/classes/game-service";
	import { ElementType } from "./core/enums/elementType";
	onMount(async () => {
		const game = GameService.init();
	});
</script>

<main>
	<canvas id="canvas" width="512" height="512" />
	<button
		on:click={() =>
			window["eventBus"]?.emit("elementType", ElementType.SAND)}
		>SAND</button
	>
	<button
		on:click={() =>
			window["eventBus"]?.emit("elementType", ElementType.WATER)}
		>WATER</button
	>
	<button
		on:click={() =>
			window["eventBus"]?.emit("elementType", ElementType.DIRT)}
		>DIRT</button
	>
</main>

<style lang="scss">
	#canvas {
		// width: 100%;
		// height: 100%;
		border: 1px solid #333;
	}
</style>
