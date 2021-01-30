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
      state.cameraState.set(state.cameraState.get() === 'on' ? 'off' : 'on');
    },
    toggleMicState(state) {
      state.micState.set(state.micState.get() === 'on' ? 'off' : 'on');
    },
    setUserVideoProp(state, props: object) {
      const video: HTMLVideoElement = state.userVideo.get();
      for (let prop in props) video[prop] = props[prop];
      return video;
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
      const video = commit('setUserVideoProp', { srcObject: fake_stream, muted: true });
      try {
        if (video.paused) video.play();
      } catch (error) {}
    },
    showRequestDeviceError({ state }, err, device) {
      let msg = err.message;
      if (err.name === 'AbortError') msg = 'It seems some other app is using your ' + device;
      if (err.name === 'TypeError') msg = 'Please try to use HTTPS if not already using it';
      state.notify.danger(`${err.name}: ${msg}`, 7000);
      // console.error(err.name, err.message);
    },

    //togglers
    toggleCamera({ state, dispatch }) {
      dispatch('enableCamera', state.cameraState.get() === 'off');
    },
    toggleMic({ state, dispatch }) {
      dispatch('enableMic', state.micState.get() === 'off');
    },
    toggleShareScreen({ state, dispatch }) {
      if (!state.sharingScreen.get()) dispatch('startScreenShare');
      else dispatch('endScreenShare');
    },
    //camera && mic streams
    async startMediaStream({ state, dispatch }, { video = false, audio = false } = {}) {
      if (!!audio && state.startedAudioStream.get()) return;
      if (!!video && state.startedVideoStream.get()) return;

      if (video === false && audio === false) return;

      let newStream: MediaStream = await navigator.mediaDevices.getUserMedia({ video, audio });

      if (!state.startedVideoStream.get()) dispatch('setStartedVideoStream', !!video);
      if (!state.startedAudioStream.get()) dispatch('setStartedAudioStream', !!audio);

      const stream: MediaStream = state.stream.get();
      const peers: Array<any> = state.peers.get();

      if (video) {
        peers.forEach((p) => {
          p.peer.replaceTrack(stream.getVideoTracks()[0], newStream.getVideoTracks()[0], stream);
        });
        stream.removeTrack(stream.getVideoTracks()[0]);
        stream.addTrack(newStream.getVideoTracks()[0]);
      } else {
        peers.forEach((p) => {
          p.peer.replaceTrack(stream.getAudioTracks()[0], newStream.getAudioTracks()[0], stream);
        });
        stream.removeTrack(stream.getAudioTracks()[0]);
        stream.addTrack(newStream.getAudioTracks()[0]);
      }
    },
    enableMic({ state, dispatch, commit }, v = true) {
      dispatch('startMediaStream', {
        audio: true,
      })
        .then(() => {
          state.stream
            .get()
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
          state.stream
            .get()
            ['getVideoTracks']()
            .forEach((track) => (track.enabled = v));
          commit('setCameraState', v ? 'on' : 'off');
        })
        .catch((err) => dispatch('showRequestDeviceError', err, 'Camera'));
    },
    endMediaStream({ state, dispatch, commit }) {
      state.stream
        .get()
        ['getTracks']()
        .forEach((track) => {
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
      const newScreenStream = await navigator.mediaDevices['getDisplayMedia']({ video: true });

      state.screens.update((set) =>
        set.add({
          id: 'userVideo-share-screen',
          name: 'My' + ' Screen',
        })
      );
      const screenStream: MediaStream = state.screenStream.get();

      state.peers.get()['forEach']((p) => {
        p.peer.replaceTrack(
          screenStream.getVideoTracks()[0],
          newScreenStream.getVideoTracks()[0],
          screenStream
        );
        p.peer.send(state.socket['id'] + ' sharing screen');
      });

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
            document.getElementById('userVideo-share-screen')[
              'srcObject'
            ] = state.screenStream.get();
          }, 100);
        })
        .catch((err) => dispatch('showRequestDeviceError', err));
    },
    endScreenShare({ state, dispatch }) {
      const screenStream: MediaStream = state.screenStream.get();
      screenStream.getTracks().forEach((track) => track.stop());
      document.getElementById('userVideo-share-screen')['srcObject'] = null;
      dispatch('endedSharing');
    },
    endedSharing({ state, dispatch }) {
      state.peers.get()['forEach']((p) => {
        p.peer.send(state.socket['id'] + 'stopped sharing screen');
      });

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
