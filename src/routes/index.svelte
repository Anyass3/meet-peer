<script lang="ts">
  import { goto } from '@sapper/app';
  import Nav from '../components/Nav.svelte';
  export let segment: string;
  let roomId = '';
</script>

<main>
  <Nav {segment} />
  <div id="h" class="d-flex justify-around flex-column">
    <h1 class="display-5">Welcome to meet-peer</h1>
    <div class="m-auto">
      <a href="/room" class="btn btn-link lead" style="font-size: 20px;">create new room</a>

      <p>OR</p>

      <div class="mt-4">
        <input
          id="join-code"
          bind:value={roomId}
          class="form-control"
          on:keydown={(ev) => {
            if (ev.key === 'Enter') goto(`/room/${roomId}`);
          }}
          type="text"
        />
        <a
          class:disabled={!roomId}
          class="btn btn-primary mt-2"
          id="join-room"
          href="/room/{roomId}">join with room ID</a
        >
      </div>
    </div>
  </div>
</main>

<!-- 
<svelte:head><script src="/socket.io/socket.io.js" ✂prettier:content✂="Cgk=" ✂prettier:content✂="e30=">{}</script></svelte:head> -->
<style>
  main {
    position: relative;
    padding: 0.5em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
