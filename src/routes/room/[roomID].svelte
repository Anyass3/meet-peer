<script context="module" lang="ts">
  export async function preload({ params }) {
    return {
      params: { roomId: params.roomID },
    };
  }
</script>

<script lang="ts">
  // const SimplePeer = require("simple-peer");
  import { onMount } from 'svelte';
  export let params: { roomId: string };
  import store from '../../stores';
  import Video from '../../components/video.svelte';
  import JoinedMenu from '../../components/joinedMenu.svelte';
  import { throttle } from '../../utils';
  import { NotificationDisplay } from '@beyonk/svelte-notifications';

  const {
    getUserId,
    getPeers,
    getEnteredRoom,
    getJoinRequest,
    getUserName,
    getReconnecting,
    getScreens,
    getPinged,
    // ctmConnected,
    // ctmState,
    // ctmApi,
  } = store.getters;

  const peers = getPeers(),
    inMeet = getEnteredRoom(),
    name = getUserName(),
    reconnecting = getReconnecting(),
    sendingJoinRequest = getJoinRequest(),
    screens = getScreens(),
    pinged = getPinged();
  // state = ctmState(),
  // connected = ctmConnected();
  // api = ctmApi();

  let id,
    join_meet_text = 'Enter Meet Now';

  $: join_meet_text = $sendingJoinRequest ? 'Connecting...' : 'Enter Meet Now';

  $: id = getUserId();
  // $: (() => {
  // console.log('connected', $connected);
  // console.log('state', $state);
  // if (typeof window !== 'undefined') window['state'] = state;
  // console.log('api', store.api);
  // })();

  // function joinRoom() {
  //   api.call('join', { roomId: params.roomId, peerId: state.connector.clientPublicKeyHex });
  // }

  // function leaveRoom() {
  //   api.call('leave', { roomId: params.roomId, peerId: state.connector.clientPublicKeyHex });
  // }
  // initiator

  onMount(() => {
    store.commit('setRoomId', params.roomId);
    store.dispatch('setAspectRatio', innerWidth / innerHeight);
    store.dispatch('setUserVideo', document.querySelector("[aria-label='userVideo']"));
    store.dispatch('fakeStream').then(() => {
      // join_meet(params.roomId);
      // store.dispatch("toggleCamera");
      // 	.then(() => store.dispatch("toggleMic").then(() => 0))
    });
  });
</script>

<svelte:head
  ><script defer src="/simplepeer.min.js">
  </script></svelte:head
>
<NotificationDisplay />
<main class="vh-100 vw-100 m-0 position-relative bg-light">
  <div style="z-index:20" class="w-100 p-0 m-0 position-fixed d-flex justify-center">
    {#if !$inMeet}
      <h1 style="text-align: center;opacity:.5;" class="text-muted">Peer Meet Room</h1>
    {/if}
    {#if $reconnecting}
      <div class="alert d-block alert-danger lead">
        <p>reconnecting...</p>
      </div>
    {/if}
  </div>
  <div class="d-flex flex-column flex-md-row h-100" class:justify-around={!$inMeet}>
    <div class="container flex-grow-1 pb-5 mw-100">
      <div class="row g-1 as-center justify-center m-0" class:h-100={!$inMeet} class:g-1={!$pinged}>
        {#each [...$screens] as { id, name } (id)}
          <Video {id} {name} />
        {/each}
        {#each [...$peers] as peer (peer.peerId)}
          <Video id={'peer' + peer.peerId} name={peer.peerName} />
        {/each}
        <Video {id} name={$name} inMeet={$inMeet} user />
      </div>
    </div>
    {#if !$inMeet}
      <div class="as-center d-flex justify-center">
        <a
          class:disabled={$sendingJoinRequest}
          id="joinMeet"
          class="btn btn-success w-100"
          on:click={throttle(() => store.dispatch('joinMeet'))}
          style="margin: 20px;">
          {join_meet_text}
        </a>
      </div>
    {/if}
  </div>
  {#if $inMeet}
    <JoinedMenu cls="position-fixed" style="bottom:0;left:0;right:0" />
  {/if}
</main>

<style>
  /* :global(body) {
		background: #e1f5fe;
	} */

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
