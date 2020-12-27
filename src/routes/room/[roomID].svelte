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
	const {
		getUserId,
		getPeers,
		getEnteredRoom,
		getJoinRequest,
		getUserName,
		getReconnecting,
	} = store.getters;

	const peers = getPeers(),
		inMeet = getEnteredRoom(),
		name = getUserName(),
		reconnecting = getReconnecting(),
		sendingJoinRequest = getJoinRequest();

	let id,
		join_meet_text = "Enter Meet Now";
	$: join_meet_text = $sendingJoinRequest
		? "Connecting..."
		: "Enter Meet Now";
	$: id = getUserId();

	// initiator
	const join_meet = () =>
		throttle(() => {
			store.commit("setJoinRequest", true);
			store.dispatch("joinMeet");

			//   $("#joinMeet").attr('disabled','').text="Connecting..."
		}, 5000)();

	onMount(() => {
		store.dispatch(
			"setUserVideo",
			document.querySelector("[aria-label='userVideo']")
		);
		store.dispatch("fakeStream").then(
			() => 0 //join_meet()
			// store
			// 	.dispatch("toggleCamera")
			// 	.then(() => store.dispatch("toggleMic").then(() => 0))
		);
	});
</script>

<style>
	:global(body) {
		background: aliceblue;
	}

	:global(button):active {
		transform: scale(0.9);
		transition: none;
	}
</style>

<svelte:head>
	<script defer src="/simplepeer.min.js">
	</script>
</svelte:head>

<div style="display:flex;justify-content: center;">
	<h1 style="text-align: center;">Peer Meet Room</h1>
	{#if $reconnecting}
		<div>
			<p style="color:red">reconnecting...</p>
		</div>
	{/if}
</div>
<main class="d-flex justify-around flex-wrap  bg-primary">
	<!-- <p>mic:{$mic}||cam:{$cam}</p> -->
	<div class="d-flex justify-evenly flex-wrap mb-0">
		<Video
			{id}
			name={$name}
			main_style="flex-basis:auto"
			inMeet={$inMeet}
			user />
		{#each [...$peers] as peer (peer.peerId)}
			<Video id={'peer' + peer.peerId} name={peer.name} />
		{/each}
	</div>
	{#if !$inMeet}
		<div class="">
			<button
				id="joinMeet"
				class="btn btn-success w-100"
				on:click={join_meet}
				style="margin: 20px;">
				{join_meet_text}
			</button>
		</div>
	{/if}
</main>
{#if $inMeet}
	<JoinedMenu />
{/if}
