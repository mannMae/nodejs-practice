const startButton = document.querySelector('#startRecordButton');
const video = document.querySelector('#preview');

let stream;
let recorder;
let videoFile;

const handleClickStart = () => {
  if (videoFile) {
    handleDownload();
  }
  if (recorder) {
    handleStop();
  } else {
    handleStart();
  }
};

const handleStart = () => {
  startButton.innerText = 'Stop Recording';
  recorder = new MediaRecorder(
    stream
    // ,{ mimeType: 'video/mp4' }
  );
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const handleDownload = () => {
  const anchor = document.createElement('a');
  anchor.href = videoFile;
  anchor.download = 'MyRecording.webm';
  document.body.appendChild(anchor);
  anchor.click();
  videoFile = null;
};

const handleStop = () => {
  startButton.innerText = 'Download Recording';
  recorder.stop();
  recorder = null;
};

const init = async () => {
  console.log(navigator);
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startButton.addEventListener('click', handleClickStart);
