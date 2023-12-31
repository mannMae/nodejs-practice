const video = document.querySelector('video');
const playButton = document.querySelector('#play');
const playButtonIcon = playButton.querySelector('i');
const muteButton = document.querySelector('#mute');
const muteButtonIcon = muteButton.querySelector('i');
const time = document.querySelector('#time');
const volume = document.querySelector('#volume');

const currentTime = document.querySelector('#currentTime');
const totalTime = document.querySelector('#totalTime');
const timeline = document.querySelector('#timeline');

const fullScreenButton = document.querySelector('#fullScreen');
const fullScreenIcon = fullScreenButton.querySelector('i');

const videoContainer = document.querySelector('#videoContainer');
const videoControls = document.querySelector('#videoControls');

const handleClickPlay = (e) => {
  if (video.paused) {
    handlePlay();
  } else {
    handlePause();
  }
};

const handlePlay = () => {
  video.play();
  playButtonIcon.classList = 'fas fa-pause';
};

const handlePause = () => {
  video.pause();
  playButtonIcon.classList = 'fas fa-play';
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
  muteButtonIcon.classList = 'fas fa-volume-mute';
  volume.value = 0;
};
const handleUnmute = () => {
  video.muted = false;
  muteButtonIcon.classList = 'fas fa-volume-up';
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
  fullScreenIcon.classList = 'fas fa-compress';
};

const handleDeactivateFullScreen = () => {
  document.exitFullscreen();
  fullScreenIcon.classList = 'fas fa-expand';
};

let controlsTimeout = null;
let controlsMovementTimeout = null;

const hideControls = () => {
  videoControls.classList.remove('showing');
};

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add('showing');
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: 'POST',
  });
};

playButton.addEventListener('click', handleClickPlay);
muteButton.addEventListener('click', handleClickMute);
volume.addEventListener('input', handleVolumeChange);
video.addEventListener('loadeddata', handleLoadedMetadata);
video.addEventListener('timeupdate', handleTimeUpdate);
video.addEventListener('ended', handleEnded);
timeline.addEventListener('input', handleTimelineChange);
fullScreenButton.addEventListener('click', handleClickFullScreen);
videoContainer.addEventListener('mousemove', handleMouseMove);
videoContainer.addEventListener('mouseleave', handleMouseLeave);
