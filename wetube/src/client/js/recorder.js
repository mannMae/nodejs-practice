const startButton = document.querySelector('#startRecordButton');
const video = document.querySelector('#preview');

let stream;
let recorder;

const handleClickStart = () => {
  if (recorder) {
    handleStop();
  } else {
    handleStart();
  }
};

const handleStart = () => {
  startButton.innerText = 'Stop Recording';
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    console.log(e.data);
  };
  recorder.start();
};

const handleStop = () => {
  startButton.innerText = 'Start Recording';
  recorder.stop();
  recorder = null;
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startButton.addEventListener('click', handleClickStart);
