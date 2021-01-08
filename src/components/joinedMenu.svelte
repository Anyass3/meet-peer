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
    export let cls = "";
    export let style = "";
    const {
        toggleCamera,
        toggleMic,
        toggleShareScreen,
        endScreenShare,
    } = store.actions;
    const { getCameraState, getMicState, getSharingScreen } = store.getters;
    const camera = getCameraState(),
        mic = getMicState(),
        sharingScreen = getSharingScreen();

    const leave_meet = () =>
        throttle(() => {
            store.commit("setJoinRequest", false);
            store
                .dispatch("setHasLeftWillingly", true)
                .then(() =>
                    store
                        .dispatch("leaveMeet")
                        .then(() => store.commit("setEnteredRoom", false))
                );
            if ($sharingScreen) endScreenShare();
        }, 5000)();
    $: cam_color = $camera === "on" ? "success" : "danger";
    $: mic_color = $mic === "on" ? "success" : "danger";
</script>

<style>
</style>

<div
    class=" mt-2 w-100 d-flex justify-between p-2 {cls}"
    style="min-height:50px;z-index:10;{style}">
    <!-- <div class="d-flex justify-center as-center mr-2">
        <span class="btn btn-info">info</span>
    </div> -->
    <div class="d-flex justify-evenly as-center flex-grow-1 br bl">
        <span on:click={toggleCamera}>
            {#if $camera === 'on'}
                <CameraIcon size="2x" class="btn btn-{cam_color} lead3" />
            {:else}
                <CameraOffIcon size="2x" class="btn btn-{cam_color} lead3" />
            {/if}
        </span>
        <span on:click={toggleMic}>
            {#if $mic === 'on'}
                <MicIcon size="2x" class="btn btn-{mic_color} lead3" />
            {:else}
                <MicOffIcon size="2x" class="btn btn-{mic_color} lead3" />
            {/if}
        </span>
        <span on:click={toggleShareScreen}>
            <ShareIcon
                size="2x"
                class="btn {$sharingScreen ? 'bg-success' : 'bg-light'} rounded-pill lead3" />
        </span>

        <span on:click={leave_meet} class=" ">
            <LogOutIcon
                size="2x"
                style="background-color: #ffebbe;"
                class="btn btn-light text-danger  lead3  b border-danger" /></span>
        <!-- <span on:click={toggleMic} class="btn btn-{mic_color} ">mic</span> -->
    </div>
    <div class="d-flex justify-center as-center">
        <span class="lead3 btn btn-light rounded mx-auto">:</span>
    </div>
</div>
