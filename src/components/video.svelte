<script lang="ts">
  import store from '../stores';
  import { keyInputThrottle } from '../utils';
  import Ping from './icons/pingIcon.svelte';
  import { MicOffIcon, MicIcon, CameraOffIcon, CameraIcon } from 'svelte-feather-icons';
  import { onDestroy } from 'svelte';
  const { toggleCamera, toggleMic } = store.actions;
  const { getCameraState, getMicState, getPinged, getUserName } = store.getters;
  const camera = getCameraState(),
    mic = getMicState(),
    ping = getPinged(),
    userName = getUserName();

  export let id = '';
  export let inMeet = false;
  export let name;
  export let main_class = '';
  export let main_style = '';
  export let user = false;
  export let vid_class = '';
  export let vid_style = '';
  $: pinged = $ping === id;
  $: pingColor = pinged ? 'success' : 'light';

  $: cam_color = $camera === 'on' ? 'success' : 'danger';
  $: mic_color = $mic === 'on' ? 'success' : 'danger';

  onDestroy(() => {
    if (typeof document === undefined) {
      const videoStream = document.getElementById(id)['srcObject'];
      const audioStream = document.getElementById(id + 'audio')['srcObject'];
      if (videoStream) videoStream.getTracks().forEach((track) => track.stop());
      if (audioStream) audioStream.getTracks().forEach((track) => track.stop());
      document.getElementById(id)['srcObject'] = null;
      document.getElementById(id + 'audio')['srcObject'] = null;
    }
  });
</script>

<div
  class="{main_class} position-relative  d-flex flex-column b p-0 rounded-lg col-12 {user && !inMeet
    ? 'w-100'
    : ''} {pinged ? 'order-first vh-90 vh-md-100' : 'col-sm-6 col-md-4 col-lg-3'}"
  style="background:#e3f2fd;{main_style}"
>
  <span
    on:click={() => store.dispatch('togglePing', id)}
    class="position-absolute"
    style="z-index:30;"
  >
    <Ping width="24" height="24" cls="alert alert-{pingColor} lead3" style="padding:2px" /></span
  >
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    {id}
    aria-label={user ? 'userVideo' : 'peerVideo'}
    class="flex-grow-1 fluid  {vid_class}"
    style={vid_style}
    autoplay
    playsInline
  />
  <!-- svelte-ignore a11y-media-has-caption -->
  <audio id={id + 'audio'} autoplay playsinline class="d-none" />
  <div class="w-100" style={user && !inMeet ? 'bottom:0;position:absolute' : ''}>
    {#if user && !inMeet}
      <div class="toggle w-100 d-flex justify-center">
        <span on:click={toggleCamera}>
          {#if $camera === 'on'}
            <CameraIcon size="2x" class="btn rounded-circle btn-{cam_color} lead3" />
          {:else}
            <CameraOffIcon size="2x" class="btn rounded-circle btn-{cam_color} lead3" />
          {/if}
        </span>
        <span on:click={toggleMic}>
          {#if $mic === 'on'}
            <MicIcon size="2x" class="btn rounded-circle btn-{mic_color} lead3" />
          {:else}
            <MicOffIcon size="2x" class="btn rounded-circle btn-{mic_color} lead3" />
          {/if}
        </span>
      </div>
    {/if}
    <div class="w-100 p-0">
      {#if !inMeet && user}
        <!-- svelte-ignore a11y-autofocus -->
        <input
          id="p-name-input"
          class="form-control my-0 w-100 lead3 text-center"
          autofocus={true}
          type="text"
          placeholder="Input Your Name"
          bind:value={$userName}
          on:keydown={keyInputThrottle((ev) => store.dispatch('joinMeet'))}
        />
      {:else}
        <p id="p-name" style="" class="lead my-0 p-2 text-center">
          {name + (user ? '(Me)' : '')}
        </p>
      {/if}
    </div>
  </div>
</div>
