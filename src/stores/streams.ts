import type { Stream } from 'stream';
import { get } from 'svelte/store';

export default {
  state: {
    startedVideoStream: false,
    startedAudioStream: false,
    cameraState: 'off',
    audioState: 'off',
    stream: null,
    fakeVideoStream: null,
    userVideo: null,
    userName: '',
    hasLeftWillingly: false,
  },

  getters: {},

  mutations: {
    toggleCameraState(state) {
      state.cameraState.set(get(state.cameraState) === 'on' ? 'off' : 'on');
    },
    toggleAudioState(state) {
      state.audioState.set(get(state.audioState) === 'on' ? 'off' : 'on');
    },
    setStream(state, stream) {
      state.stream.set(stream);
    },
    setStreamingVideo(state, val) {
      state.startedVideoStream.set(val);
    },
    setStreamingAudio(state, val) {
      state.startedAudioStream.set(val);
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
    toggleAudio({ state, dispatch }) {
      dispatch('enableAudio', get(state.audioState) === 'off');
    },
    fakeStream: ({ commit, dispatch }) => {
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
      dispatch('setStream', fake_stream);
      dispatch('setFakeVideoStream', fake_stream.getVideoTracks()[0]);
      // userVideo = createVideo();
      commit('setUserVideoProp', { srcObject: fakeVideoAudio(), muted: true });
    },
    startStreaming: ({ state, commit, dispatch }, { video = false, audio = false } = {}) => {
      if (video === false && audio === false) return;

      try {
        navigator.mediaDevices.getUserMedia({ video, audio }).then((newStream) => {
          if (!get(state.startedVideoStream)) dispatch('setStartedVideoStream', !!video);
          if (!get(state.startedAudioStream)) dispatch('setStartedAudioStream', !!audio);
          const stream: MediaStream = get(state.stream);
          const peers: Set<any> = get(state.peers);
          if (video) {
            peers.forEach((p) => {
              p.peer.replaceTrack(
                stream.getVideoTracks()[0],
                newStream.getVideoTracks()[0],
                stream
              );
              console.log(p.peer);
            });
            stream.removeTrack(stream.getVideoTracks()[0]);
            stream.addTrack(newStream.getVideoTracks()[0]);
          } else {
            peers.forEach((p) => {
              p.peer.replaceTrack(
                stream.getAudioTracks()[0],
                newStream.getAudioTracks()[0],
                stream
              );
            });
            stream.removeTrack(stream.getAudioTracks()[0]);
            stream.addTrack(newStream.getAudioTracks()[0]);
          }
          commit('setUserVideoProp', { srcObject: stream, muted: true });
        });
      } catch (err) {
        console.log(err.name, err.message);
      }
    },
    enableAudio: ({ state, dispatch }, v = true) => {
      if (!get(state.startedAudioStream)) dispatch('startStreaming', { audio: true });
      get(state.stream)
        ['getAudioTracks']()
        .forEach((track) => (track.enabled = v));
      dispatch('setAudioState', v ? 'on' : 'off');
    },
    enableCamera: ({ state, dispatch }, v = true) => {
      if (!get(state.startedVideoStream)) dispatch('startStreaming', { video: true });
      get(state.stream)
        ['getVideoTracks']()
        .forEach((track) => (track.enabled = v));
      dispatch('setCameraState', v ? 'on' : 'off');
    },
  },
};
