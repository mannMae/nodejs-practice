const video = document.querySelector('video');
const playButton = document.querySelector('#play');
const muteButton = document.querySelector('#mute');
const time = document.querySelector('#time');
const volume = document.querySelector('#volume');

const currentTime = document.querySelector('#currentTime');
const totalTime = document.querySelector('#totalTime');
const timeline = document.querySelector('#timeline');

const fullScreenButton = document.querySelector('#fullScreen');
const videoContainer = document.querySelector('#videoContainer');

const handleClickPlay = (e) => {
  if (video.paused) {
    handlePlay();
  } else {
    handlePause();
  }
};

const handlePlay = () => {
  video.play();
  playButton.innerText = 'Pause';
};

const handlePause = () => {
  video.pause();
  playButton.innerText = 'Play';
};

let volumeValue = '0.5';

const handleClickMute = () => {
  if (video.muted) {
    handleUnmute();
  } else {
    handleMute();
  }
};

const handleMute = () => {
  video.muted = true;
  muteButton.innerText = 'Unmute';
  volume.value = 0;
};
const handleUnmute = () => {
  video.muted = false;
  muteButton.innerText = 'Mute';
  volume.value = volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    handleUnmute();
  }
  if (value === '0') {
    handleMute();
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (milliseconds) => {
  return new Date(milliseconds * 1000).toISOString().substr(11, 8);
};

const handleLoadedMetadata = () => {
  const duration = Math.floor(video.duration);
  totalTime.innerText = formatTime(duration);
  timeline.max = duration;
};

const handleTimeUpdate = () => {
  const current = Math.floor(video.currentTime);
  currentTime.innerText = formatTime(current);
  timeline.value = current;
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleClickFullScreen = () => {
  // video.requestFullscreen();
  const currentFullscreen = document.fullscreenElement;
  if (!currentFullscreen) {
    handleActivateFullScreen();
  } else {
    handleDeactivateFullScreen();
  }
};

const handleActivateFullScreen = () => {
  videoContainer.requestFullscreen();
  fullScreenButton.innerText = 'Finish Full Screen';
};

const handleDeactivateFullScreen = () => {
  document.exitFullscreen();
  fullScreenButton.innerText = 'Full Screen';
};

playButton.addEventListener('click', handleClickPlay);
muteButton.addEventListener('click', handleClickMute);
volume.addEventListener('input', handleVolumeChange);
video.addEventListener('loadedmetadata', handleLoadedMetadata);
video.addEventListener('timeupdate', handleTimeUpdate);
timeline.addEventListener('input', handleTimelineChange);
fullScreenButton.addEventListener('click', handleClickFullScreen);
