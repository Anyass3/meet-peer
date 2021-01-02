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
			params: { roomId: params.roomID },
		};
	}
</script>

<script lang="ts">
	// const SimplePeer = require("simple-peer");
	import { onMount } from "svelte";
	// import io from "socket.io-client";
	export let params: { roomId: string };
	import store from "../../stores";
	import Video from "../../components/video.svelte";
	import JoinedMenu from "../../components/joinedMenu.svelte";
	import { throttle } from "../../utils";
	import { NotificationDisplay } from "@beyonk/svelte-notifications";
	const {
		getUserId,
		getPeers,
		getEnteredRoom,
		getJoinRequest,
		getUserName,
		getReconnecting,
		getScreens,
	} = store.getters;

	const peers = getPeers(),
		inMeet = getEnteredRoom(),
		name = getUserName(),
		reconnecting = getReconnecting(),
		sendingJoinRequest = getJoinRequest(),
		screens = getScreens();

	let id,
		maxH,
		bProp = {},
		join_meet_text = "Enter Meet Now";
	$: join_meet_text = $sendingJoinRequest
		? "Connecting..."
		: "Enter Meet Now";
	$: bProp = $sendingJoinRequest ? { disabled: true } : {};
	$: id = getUserId();

	// initiator
	const join_meet = (ev) =>
		throttle(() => {
			store.commit("setJoinRequest", true);
			store.dispatch("joinMeet", params.roomId);

			// document.querySelector("#joinMeet").setAttribute('disabled','')
		}, 5000)();

	onMount(() => {
		maxH = `${innerWidth} ${innerHeight} ${innerWidth / innerHeight}`;
		store
			.dispatch("setAspectRatio", innerWidth / innerHeight)
			.then((r) => console.log(r, innerWidth / innerHeight));
		store.dispatch(
			"setUserVideo",
			document.querySelector("[aria-label='userVideo']")
		);
		store.dispatch("fakeStream").then(
			() => 0 //join_meet(params.roomId)
			// store
			// 	.dispatch("toggleCamera")
			// 	.then(() => store.dispatch("toggleMic").then(() => 0))
		);
		// console.log(store.state.iceConfig);
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
	:global(html) {
		margin: 0 !important;
	}
	:global(body) {
		margin: 0 !important;
	}
</style>

<svelte:head>
	<script defer src="/simplepeer.min.js">
	</script>
</svelte:head>
<NotificationDisplay />
<main class="vh-100 vw-100 m-0 position-relative">
	<div
		style="display:flex;justify-content: center;z-index:20"
		class="w-100 position-fixed text-danger">
		<h1
			style="text-align: center;{$inMeet ? 'opacity:.5;' : ''}"
			class="text-muted">
			Peer Meet Room
		</h1>
		{#if $reconnecting}
			<div>
				<p style="color:red">reconnecting...</p>
			</div>
		{/if}
	</div>
	<div class="d-flex justify-around flex-wrap h-100">
		<div class="container flex-grow-1 mw-100">
			<div class="row gx-1 justify-center mw-100 m-0 mh-100">
				{#each [...$screens] as { id, name } (id)}
					<Video main_class="" {id} main_style="" {name} />
				{/each}
				{#each [...$peers] as peer (peer.peerId)}
					<Video
						main_class=""
						id={'peer' + peer.peerId}
						main_style=""
						name={peer.name} />
				{/each}
				<Video
					{id}
					name={$name}
					inMeet={$inMeet}
					vid_class=""
					main_class=""
					main_style={false ? `height:${maxH ? maxH - maxH * 0.25 + 'px' : '90%'}` : ''}
					user />
				<!-- {#each '    ' as i}
					<Video
						main_style="flex-basis:400px"
						main_class="flex-grow-1 flex-shrink-1 m-1" />
				{/each} -->
			</div>
		</div>
		{#if !$inMeet}
			<div class="as-center d-flex justify-center">
				<button
					{...bProp}
					id="joinMeet"
					class="btn btn-success w-100"
					on:click={join_meet}
					style="margin: 20px;">
					{join_meet_text}
				</button>
			</div>
		{/if}
	</div>
	{#if $inMeet}
		<JoinedMenu cls="position-fixed" style="bottom:0;left:0;right:0" />
	{/if}
</main>
