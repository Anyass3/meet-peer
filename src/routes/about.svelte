<script lang="ts">
	import Indicator from "../components/speakIndicator.svelte";

	import { onDestroy } from "svelte";

	let middle = 0,
		side = 0;
	const int = setInterval(() => {
		const r = () => Math.random();
		middle = r() * 12 + 0.5;
		side = r() * 8 + 0.5;
	}, 1000);
	onDestroy(() => clearInterval(int));
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<h1>About this site</h1>

<p>This is the 'about' page. There's not much here.</p>
<Indicator {middle} {side} />
