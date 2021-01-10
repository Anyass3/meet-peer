import { get } from 'svelte/store';

export default {
  state: {
    startedVideoStream: false,
    startedAudioStream: false,
    cameraState: 'off',
    micState: 'off',
    stream: null,
    userVideo: null,
    aspectRatio: 1,
    sharingScreen: false,
    screenStream: null,
    screens: new Set(),
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
      video.play();
    },
  },

  actions: {
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
      commit('setScreenStream', new MediaStream([fakeVideo()]));
      commit('setUserVideoProp', { srcObject: fake_stream, muted: true });
    },
    showRequestDeviceError({ state }, err, device) {
      let msg = err.message;
      if (err.name === 'AbortError') msg = 'It seems some other app is using your ' + device;
      if (err.name === 'TypeError') msg = 'Please try to use HTTPS if not already using it';
      state.notify.danger(`${err.name}: ${msg}`, 7000);
      console.error(err.name, err.message);
    },

    //togglers
    toggleCamera({ state, dispatch }) {
      dispatch('enableCamera', get(state.cameraState) === 'off');
    },
    toggleMic({ state, dispatch }) {
      dispatch('enableMic', get(state.micState) === 'off');
    },
    toggleShareScreen({ state, dispatch }) {
      if (!get(state.sharingScreen)) dispatch('startScreenShare');
      else dispatch('endScreenShare');
    },
    //camera && mic streams
    async startMediaStream({ state, dispatch }, { video = false, audio = false } = {}) {
      if (!!audio && get(state.startedAudioStream)) return;
      if (!!video && get(state.startedVideoStream)) return;
      if (video === false && audio === false) return;
      let newStream: MediaStream = await navigator.mediaDevices.getUserMedia({ video, audio });
      if (!get(state.startedVideoStream)) dispatch('setStartedVideoStream', !!video);
      if (!get(state.startedAudioStream)) dispatch('setStartedAudioStream', !!audio);
      const stream: MediaStream = get(state.stream);
      if (video) {
        state.peers.subscribe((peers) =>
          peers.forEach((p) => {
            p.peer.replaceTrack(stream.getVideoTracks()[0], newStream.getVideoTracks()[0], stream);
          })
        )();
        stream.removeTrack(stream.getVideoTracks()[0]);
        stream.addTrack(newStream.getVideoTracks()[0]);
      } else {
        state.peers.subscribe((peers) =>
          peers.forEach((p) => {
            p.peer.replaceTrack(stream.getAudioTracks()[0], newStream.getAudioTracks()[0], stream);
          })
        )();
        stream.removeTrack(stream.getAudioTracks()[0]);
        stream.addTrack(newStream.getAudioTracks()[0]);
      }
    },
    enableMic({ state, dispatch, commit }, v = true) {
      dispatch('startMediaStream', {
        audio: true,
      })
        .then(() => {
          get(state.stream)
            ['getAudioTracks']()
            .forEach((track) => (track.enabled = v));
          commit('setMicState', v ? 'on' : 'off');
        })
        .catch((err) => dispatch('showRequestDeviceError', err, 'Microphone'));
    },
    enableCamera({ state, dispatch, commit }, v = true) {
      const aspect_ratio = outerWidth / outerHeight;
      const ideal_width = aspect_ratio < 1 ? 900 : 4096;
      dispatch('startMediaStream', {
        video: {
          width: { ideal: ideal_width },
          aspectRatio: aspect_ratio < 1 ? 1 : aspect_ratio,
        },
      })
        .then(() => {
          get(state.stream)
            ['getVideoTracks']()
            .forEach((track) => (track.enabled = v));
          commit('setCameraState', v ? 'on' : 'off');
        })
        .catch((err) => dispatch('showRequestDeviceError', err, 'Camera'));
    },
    endMediaStream({ state, dispatch, commit }) {
      const stream: MediaStream = get(state.stream);
      stream.getTracks().forEach((track) => {
        track.enabled = false;
        track.stop();
      });
      commit('setCameraState', 'off');
      commit('setMicState', 'off');
      dispatch('setStartedVideoStream', false);
      dispatch('setStartedAudioStream', false);
      dispatch('fakeStream').then(() => state.notify.info('All Streams are stopped'));
    },

    //screen share stream
    async captureScreen({ state, dispatch }) {
      let newScreenStream = await navigator.mediaDevices['getDisplayMedia']({ video: true });
      state.screens.update((set) =>
        set.add({
          id: 'userVideo-share-screen',
          name: 'My' + ' Screen',
        })
      );
      let screenStream: MediaStream = get(state.screenStream);

      state.peers.subscribe((peers) =>
        peers.forEach((p) => {
          p.peer.replaceTrack(
            screenStream.getVideoTracks()[0],
            newScreenStream.getVideoTracks()[0],
            screenStream
          );
          p.peer.send(get(state.socket)['id'] + ' sharing screen');
        })
      )();
      screenStream.removeTrack(screenStream.getVideoTracks()[0]);
      screenStream.addTrack(newScreenStream.getVideoTracks()[0]);

      // console.log(stream.getVideoTracks());

      newScreenStream.getVideoTracks()[0].addEventListener('ended', () => {
        dispatch('endedSharing');
      });
    },
    startScreenShare({ state, dispatch }) {
      dispatch('captureScreen')
        .then(() => {
          dispatch('setSharingScreen', true);
          state.notify.success('You are sharing your screen');

          setTimeout(() => {
            document.getElementById('userVideo-share-screen')['srcObject'] = get(
              state.screenStream
            );
          }, 100);
        })
        .catch((err) => dispatch('showRequestDeviceError', err));
    },
    endScreenShare({ state, dispatch }) {
      const screenStream: MediaStream = get(state.screenStream);
      screenStream.getTracks().forEach((track) => track.stop());
      document.getElementById('userVideo-share-screen')['srcObject'] = null;
      dispatch('endedSharing');
    },
    endedSharing({ state, dispatch }) {
      state.peers.subscribe((peers) =>
        peers.forEach((p) => {
          p.peer.send(get(state.socket)['id'] + 'stopped sharing screen');
        })
      )();
      state.screens.update((set) => {
        const screen = Array.from(set).find((i) => i['id'] === 'userVideo-share-screen');
        set.delete(screen);
        return set;
      });
      dispatch('setSharingScreen', false);
      state.notify.info('You have stopped sharing your screen');
    },
  },
};
