import { get } from 'svelte/store';

export default {
  state: {
    startedVideoStream: false,
    startedAudioStream: false,
    cameraState: 'off',
    micState: 'off',
    stream: null,
    fakeVideoStream: null,
    userVideo: null,
  },
  mutations: {
    toggleCameraState(state) {
      state.cameraState.set(get(state.cameraState) === 'on' ? 'off' : 'on');
    },
    toggleMicState(state) {
      state.micState.set(get(state.micState) === 'on' ? 'off' : 'on');
    },
    setUserVideoProp(state, props: object) {
      const video: HTMLVideoElement = get(state.userVideo);
      for (let prop in props) video[prop] = props[prop];
    },
  },

  actions: {
    toggleCamera({ state, dispatch }) {
      dispatch('enableCamera', get(state.cameraState) === 'off');
    },
    toggleMic({ state, dispatch }) {
      dispatch('enableMic', get(state.micState) === 'off');
    },
    fakeStream: ({ commit }) => {
      let fakeAudio = () => {
        let ctx = new AudioContext(),
          oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        return Object.assign(dst['stream'].getAudioTracks()[0], { enabled: false });
      };

      let fakeVideo = ({ width = 640, height = 480 } = {}) => {
        let canvas = document.createElement('canvas');
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas['captureStream']();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
      };
      let fakeVideoAudio = (...args) => new MediaStream([fakeVideo(...args), fakeAudio()]);
      const fake_stream = fakeVideoAudio();
      commit('setStream', fake_stream);
      commit('setFakeVideoStream', fake_stream.getVideoTracks()[0]);
      // userVideo = createVideo();
      commit('setUserVideoProp', { srcObject: fake_stream, muted: true });
    },
    startStreaming: ({ state, dispatch }, { video = false, audio = false } = {}) => {
      if (video === false && audio === false) return;

      try {
        navigator.mediaDevices.getUserMedia({ video, audio }).then((newStream) => {
          if (!get(state.startedVideoStream)) dispatch('setStartedVideoStream', !!video);
          if (!get(state.startedAudioStream)) dispatch('setStartedAudioStream', !!audio);
          let stream: MediaStream = get(state.stream);
          if (video) {
            state.peers.subscribe((peers) =>
              peers.forEach((p) => {
                p.peer.replaceTrack(
                  stream.getVideoTracks()[0],
                  newStream.getVideoTracks()[0],
                  stream
                );
              })
            )();
            stream.removeTrack(stream.getVideoTracks()[0]);
            stream.addTrack(newStream.getVideoTracks()[0]);
          } else {
            state.peers.subscribe((peers) =>
              peers.forEach((p) => {
                p.peer.replaceTrack(
                  stream.getAudioTracks()[0],
                  newStream.getAudioTracks()[0],
                  stream
                );
              })
            )();
            stream.removeTrack(stream.getAudioTracks()[0]);
            stream.addTrack(newStream.getAudioTracks()[0]);
          }
        });
      } catch (err) {
        console.log(err.name, err.message);
      }
    },
    async enableMic({ state, dispatch, commit }, v = true) {
      if (!get(state.startedAudioStream)) await dispatch('startStreaming', { mic: true });
      get(state.stream)
        ['getAudioTracks']()
        .forEach((track) => (track.enabled = v));
      commit('setMicState', v ? 'on' : 'off');
    },
    async enableCamera({ state, dispatch, commit }, v = true) {
      if (!get(state.startedVideoStream)) await dispatch('startStreaming', { video: true });
      get(state.stream)
        ['getVideoTracks']()
        .forEach((track) => (track.enabled = v));
      commit('setCameraState', v ? 'on' : 'off');
    },
  },
};
