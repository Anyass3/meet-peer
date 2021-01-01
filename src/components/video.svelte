<script lang="ts">
    import store from "../stores";
    import Ping from "./icons/pingIcon.svelte";
    const { toggleCamera, toggleMic, togglePing } = store.actions;
    const { getCameraState, getMicState, getPinged } = store.getters;
    const camera = getCameraState(),
        mic = getMicState(),
        ping = getPinged();

    export let id = "";
    export let inMeet = false;
    export let name;
    export let main_class = "";
    export let main_style = "width:400px";
    export let user = false;
    export let vid_class = "";
    export let vid_style = "";
    $: pinged = $ping === id;
    $: pingColor = pinged ? "success" : "light";
    // $: console.log($ping, pinged);
    // export let width = "";
    // export let height = "";
</script>

<style>
    video {
        border-radius: 9px 9px 0px 0px;
        background: black;
    }
</style>

<div
    class="{main_class} position-relative d-flex flex-column col-12 {pinged ? 'order-first vh-100' : 'col-sm-6 col-md-4 col-lg-3'}"
    style={main_style}>
    <span
        on:click={() => togglePing(id)}
        class="position-absolute"
        style="z-index:30;">
        <Ping
            width="24"
            height="24"
            cls="alert alert-{pingColor} lead"
            style="padding:2px" /></span>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
        {id}
        aria-label={user ? 'userVideo' : 'peerVideo'}
        class="w-100 flex-grow-1 {vid_class}"
        style={vid_style}
        autoplay
        playsInline />
    <!-- svelte-ignore a11y-media-has-caption -->
    <audio {id} class="d-none" />
    <div class="w-100" style="">
        {#if user && !inMeet}
            <div class="toggle w-100 d-flex justify-center">
                <button
                    id="toggleCamera"
                    class="btn"
                    on:click={() => toggleCamera()}
                    class:btn-danger={$camera === 'off'}
                    class:btn-success={$camera === 'on'}>video</button>
                <button
                    id="toggleMic"
                    class="btn"
                    on:click={() => toggleMic()}
                    class:btn-danger={$mic === 'off'}
                    class:btn-success={$mic === 'on'}>mic</button>
            </div>
        {/if}
        <div class="w-100 p-0">
            {#if !inMeet && user}
                <input
                    id="p-name-input"
                    class="form-control my-0 w-100 bs lead text-center"
                    type="text"
                    placeholder="Input Your Name"
                    on:input={(ev) => {
                        store.dispatch('setUserName', ev.target['value']);
                    }} />
            {:else}
                <p id="p-name" style="" class="lead my-0 p-2 text-center">
                    {(name || 'Anonymous') + (user ? '(Me)' : '')}
                </p>
            {/if}
        </div>
    </div>
</div>
