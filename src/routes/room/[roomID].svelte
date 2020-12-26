<script context="module" lang="ts">
	export async function preload({ params }) {
		// the `slug` parameter is available because
		// this file is called [slug].svelte
		// const res = await this.fetch(`blog/${params.slug}.json`);
		// const data = await res.json();

		// if (res.status === 200) {
		// 	return { post: data };
		// } else {
		// 	this.error(res.status, data.message);
		// }
		return {
			post: { slug: params.roomId, title: "string", html: "<p>hmm</p>" },
		};
	}
</script>

<script lang="ts">
	// const SimplePeer = require("simple-peer");
	import { onMount } from "svelte";
	// import io from "socket.io-client";
	// export let post: { slug: string; title: string; html: any };
	import store from "../../stores";
	import Video from "../../components/video.svelte";
	import JoinedMenu from "../../components/joinedMenu.svelte";
	import { throttle } from "../../utils";
	// import { log } from "console";
	const {
		getCameraState,
		getAudioState,
		getUserId,
		getPeers,
		getSocket,
	} = store.getters;
	// store.dispatch("setSimplePeer", SimplePeer);
	const peers = getPeers();
	let mic, cam, name;
	$: mic = getAudioState();
	$: cam = getCameraState();
	$: name = store.state.userName;
	// $: console.log("peers", $peers);
	let inMeet = false;
	let id;
	let socket;
	$: socket = getSocket();
	// store.mutations.toggleCameraState();
	// initiator
	const join_meet = () =>
		throttle(() => {
			store.dispatch("joinMeet").then(() => {
				inMeet = true;
				console.log("ENtered room yayay");
			});
			store.dispatch("setEnteredRoom", true);
			//   $("#joinMeet").attr('disabled','').text="Connecting..."
		}, 5000)();
	const leave_meet = () =>
		throttle(() => {
			store.dispatch("setHasLeftWillingly", true);
			store.dispatch("leaveMeet").then(() => (inMeet = false));
			store.dispatch("setEnteredRoom", false);
		}, 5000)();

	onMount(() => {
		// console.log("$socket", $socket);
		store.dispatch("setUserVideo", document.querySelector("#userVideo"));
		// console.log(SimplePeer);
		store.dispatch("fakeStream").then(
			() => join_meet()
			// store
			// 	.dispatch("toggleCamera")
			// 	.then(() => store.dispatch("toggleAudio").then(() => 0))
		);
		// $peers.forEach((p) => console.log('srcObject',document.querySelector('peer'+p.peerId)['srcObject']));
	});
</script>

<style>
	:global(body) {
		background: aliceblue;
	}

	:global(button):hover {
		text-decoration: none;
		transform: scale(1.15);
	}
	:global(button):active {
		transform: scale(1);
		transition: none;
	}
	#leaveMeet {
		margin: auto;
		border-radius: 10px;
		background-color: #ffebbe;
		color: #d50000;
	}
	#joinMeet {
		display: flex;
		justify-content: center;
		width: 100%;
		/* top: 0; */
		/* position: absolute; */
	}
</style>

<svelte:head>
	<script src="/simplepeer.min.js">
	</script>
</svelte:head>

<div style="display:flex;justify-content: center;">
	<h1 style="text-align: center;">Peer Meet Room</h1>
	<div>
		<button id="leaveMeet" class="d-none">leave Meet</button>
		<p style="color:red" class="d-none">reconnecting...</p>
	</div>
</div>
<main class="d-flex justify-between flex-column  bg-primary">
	<p>mic:{$mic}||cam:{$cam}</p>
	<!-- {#each [...$peers] as peer}{peer}{/each} -->
	<div class="d-flex justify-evenly flex-wrap">
		<Video
			id="userVideo"
			name={$name}
			main_style="flex-basis:auto"
			{inMeet}
			user />
		{#each [...$peers] as peer (peer.peerId)}
			{peer}
			<Video id={'peer' + peer.peerId} name={peer.name} />
		{/each}
	</div>
	<div class="d-flex justify-center">
		{#if !inMeet}
			<button
				id="joinMeet"
				class="btn btn-success"
				on:click={join_meet}
				style="margin: 20px;">
				Enter Meet Now
			</button>
		{:else}
			<button
				id="leaveMeet"
				on:click={leave_meet}
				class="btn btn-danger">leave Meet</button>
		{/if}
	</div>
</main>
<JoinedMenu />
