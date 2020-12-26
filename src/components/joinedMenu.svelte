<script lang="ts">
    import store from "../stores";
    const { toggleCamera, toggleAudio } = store.actions;
    const { getCameraState, getAudioState } = store.getters;
    const camera = getCameraState();
    const audio = getAudioState();
    $: cam_color = $camera === "on" ? "success" : "danger";
    $: mic_color = $audio === "on" ? "success" : "danger";
</script>

<div
    class="bg-white mt-2 w-100 d-flex justify-between p-2"
    style="min-height:50px;z-index:10">
    <div class="d-flex justify-center as-center mr-2">
        <span class="btn btn-info">info</span>
    </div>
    <div class="d-flex justify-evenly as-center flex-grow-1 br bl">
        <button
            class="btn btn-light text-danger lead3 rounded-circle  b border-danger">end</button>
        <button
            on:click={toggleCamera}
            class="btn btn-{cam_color} rounded-circle">cam</button>
        <button
            on:click={toggleAudio}
            class="btn btn-{mic_color} rounded-circle">mic</button>
        <button class="btn btn-light rounded-pill">present</button>
    </div>
    <div class="d-flex justify-center as-center">
        <button class="lead3 btn btn-light rounded mx-auto">:</button>
    </div>
</div>
