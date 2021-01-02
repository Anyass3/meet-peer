<script lang="ts">
    import store from "../stores";
    import Ping from "./icons/pingIcon.svelte";
    import {
        MicOffIcon,
        MicIcon,
        CameraOffIcon,
        CameraIcon,
    } from "svelte-feather-icons";
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

    $: cam_color = $camera === "on" ? "success" : "danger";
    $: mic_color = $mic === "on" ? "success" : "danger";
    // $: console.log($ping, pinged);
    // export let width = "";
    // export let height = "";
</script>

<div
    class="{main_class} position-relative  d-flex flex-column b p-0 rounded-lg col-12 {pinged || (user && !inMeet) ? 'order-first vh-90 vh-md-100' : 'col-sm-6 col-md-4 col-lg-3'}"
    style="background:#e3f2fd;{main_style}">
    <span
        on:click={() => store.dispatch('togglePing', id).then(() => {
                if (pinged && window) window.scrollTo(0, 0);
            })}
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
        class="flex-grow-1 fluid  {vid_class}"
        style={vid_style}
        autoplay
        playsInline />
    <!-- svelte-ignore a11y-media-has-caption -->
    <audio id={id + 'audio'} autoplay playsinline class="d-none" />
    <div class="w-100" style="">
        {#if user && !inMeet}
            <div class="toggle w-100 d-flex justify-center">
                <span on:click={toggleCamera}>
                    {#if $camera === 'on'}
                        <CameraIcon
                            size="2x"
                            class="btn btn-{cam_color} lead3" />
                    {:else}
                        <CameraOffIcon
                            size="2x"
                            class="btn btn-{cam_color} lead3" />
                    {/if}
                </span>
                <span on:click={toggleMic}>
                    {#if $mic === 'on'}
                        <MicIcon size="2x" class="btn btn-{mic_color} lead3" />
                    {:else}
                        <MicOffIcon
                            size="2x"
                            class="btn btn-{mic_color} lead3" />
                    {/if}
                </span>
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
