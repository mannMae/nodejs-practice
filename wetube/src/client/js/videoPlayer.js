const video = document.querySelector('video');
const playButton = document.querySelector('#play');
const muteButton = document.querySelector('#mute');
const time = document.querySelector('#time');
const volume = document.querySelector('#volume');

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

playButton.addEventListener('click', handleClickPlay);
muteButton.addEventListener('click', handleClickMute);
volume.addEventListener('input', handleVolumeChange);
