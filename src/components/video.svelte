<script lang="ts">
    import store from "../stores";
    const { toggleCamera, toggleAudio } = store.actions;
    const { getCameraState, getAudioState } = store.getters;
    const camera = getCameraState();
    const audio = getAudioState();

    export let id;
    export let inMeet = false;
    export let name = "Anonymous";
    export let main_class = "w-100 h-100";
    export let main_style = "";
    export let user = false;
</script>

<style>
    video {
        object-fit: cover;
        border-radius: 9px 9px 0px 0px;
        background: black;
    }
</style>

<div class="mb-3 pb-4 position-relative {main_class}" style={main_style}>
    <video
        {id}
        aria-label="userVideo"
        class="w-100 h-100"
        autoplay
        playsInline />
    <div
        class="toggle w-100 d-flex justify-center position-absolute"
        style="bottom:20px">
        {#if user}
            <button
                id="toggleCamera"
                class="btn"
                on:click={() => toggleCamera()}
                class:btn-danger={$camera === 'off'}
                class:btn-success={$camera === 'on'}>video</button>
            <button
                id="toggleAudio"
                class="btn"
                on:click={() => toggleAudio()}
                class:btn-danger={$audio === 'off'}
                class:btn-success={$audio === 'on'}>audio</button>
        {/if}
    </div>
    <div
        class="item position-absolute w-100 bg-danger p-0"
        style="bottom:-11px">
        {#if !inMeet && user}
            <input
                id="p-name-input"
                class="form-control my-0 lead"
                type="text"
                placeholder="enter name"
                on:input={(ev) => {
                    store.dispatch('setUserName', ev.target['value']);
                }} />
        {:else}
            <p id="p-name" class="bg-info lead my-0 p-2 text-center">
                {name + (user ? '(Me)' : '')}
            </p>
        {/if}
    </div>
</div>
