<script lang="ts">
	import Nav from "../components/Nav.svelte";
	export let segment: string;
	// import { onMount } from "svelte";
	// let socket;
	// onMount(() => {
	// 	socket = io("/");
	// 	console.log("socket", socket, socket.id, socket.connected);
	// });
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
	<div id="h" class="d-flex justify-around flex-column">
		<h1 class="display-5">Welcome to meet-peer</h1>
		<div class="m-auto">
			<a
				href="/new-room"
				class="btn btn-link"
				style="font-size: 20px;">create new room</a>

			<p>OR</p>

			<div class="mt-4">
				<input id="join-code" class="form-control" type="text" />
				<button
					class="btn btn-primary mt-2"
					id="join-room"
					to="/room">join with code</button>
			</div>
		</div>
	</div>
</main>

<!-- 
<svelte:head><script src="/socket.io/socket.io.js">
	</script></svelte:head> -->
