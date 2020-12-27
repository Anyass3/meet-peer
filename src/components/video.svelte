<script lang="ts">
    import store from "../stores";
    const { toggleCamera, toggleMic } = store.actions;
    const { getCameraState, getMicState } = store.getters;
    const camera = getCameraState();
    const mic = getMicState();
    export let id;
    export let inMeet = false;
    export let name;
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
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
        {id}
        aria-label={user ? 'userVideo' : 'peerVideo'}
        class="w-100 h-100"
        autoplay
        playsInline />
    <div class="position-absolute w-100" style="bottom:-16px">
        <div class="toggle w-100 d-flex justify-center">
            {#if user}
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
            {/if}
        </div>
        <div class="item w-100 bg-danger p-0">
            {#if !inMeet && user}
                <input
                    id="p-name-input"
                    class="form-control my-0 lead text-center"
                    type="text"
                    placeholder="Input Your Name"
                    on:input={(ev) => {
                        store.dispatch('setUserName', ev.target['value']);
                    }} />
            {:else}
                <p id="p-name" class="bg-info lead my-0 p-2 text-center">
                    {(name || 'Anonymous') + (user ? '(Me)' : '')}
                </p>
            {/if}
        </div>
    </div>
</div>
