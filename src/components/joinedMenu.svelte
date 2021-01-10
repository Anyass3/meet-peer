<script lang="ts">
    import store from "../stores";
    import { throttle } from "../utils";
    import {
        MicOffIcon,
        MicIcon,
        CameraOffIcon,
        CameraIcon,
        ShareIcon,
        LogOutIcon,
    } from "svelte-feather-icons";
    export let cls = ""; //class
    export let style = "";
    const { toggleCamera, toggleMic, toggleShareScreen } = store.actions;
    const { getCameraState, getMicState, getSharingScreen } = store.getters;
    const camera = getCameraState(),
        mic = getMicState(),
        sharingScreen = getSharingScreen();

    const leave_meet = throttle(() => {
        store.dispatch("leaveMeet");
    }, 5000);
    $: cam_color = $camera === "on" ? "success" : "danger";
    $: mic_color = $mic === "on" ? "success" : "danger";
</script>

<div
    class=" mt-2 w-100 d-flex justify-between p-2 {cls}"
    style="min-height:50px;z-index:10;{style}">
    <div class="d-flex justify-evenly as-center flex-grow-1 br bl">
        <span on:click={toggleCamera}>
            {#if $camera === 'on'}
                <CameraIcon
                    size="2x"
                    class="btn btn-{cam_color} rounded-circle lead3" />
            {:else}
                <CameraOffIcon
                    size="2x"
                    class="btn btn-{cam_color} rounded-circle lead3" />
            {/if}
        </span>
        <span on:click={toggleMic}>
            {#if $mic === 'on'}
                <MicIcon
                    size="2x"
                    class="btn btn-{mic_color} rounded-circle lead3" />
            {:else}
                <MicOffIcon
                    size="2x"
                    class="btn btn-{mic_color} rounded-circle lead3" />
            {/if}
        </span>
        <span on:click={toggleShareScreen}>
            <ShareIcon
                size="2x"
                class="btn {$sharingScreen ? 'btn-success' : 'btn-outline-secondary'} rounded-circle lead3" />
        </span>

        <span on:click={leave_meet} class=" ">
            <LogOutIcon
                size="2x"
                class="btn btn-outline-danger lead3 rounded-circle" /></span>
    </div>
    <div class="d-flex justify-center as-center">
        <span
            class="lead3 btn btn-light rounded rounded-circle mx-auto">:</span>
    </div>
</div>
