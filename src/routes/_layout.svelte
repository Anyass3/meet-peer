<script lang="ts">
	import Nav from "../components/Nav.svelte";

	export let segment: string;
</script>

<style>
	main {
		position: relative;
		padding: 0.5em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<main>
	<Nav {segment} />
	<slot />
</main>
