import FFmpeg, { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

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

const handleDownload = async () => {
  console.log('download!');
  const ffmpeg = createFFmpeg({ log: true });
  console.log('create!');
  await ffmpeg.load();
  console.log('Load!');

  ffmpeg.FS('writeFile', 'recording.webm', await fetchFile(videoFile));
  console.log('File System');

  await ffmpeg.run('-i', 'recording.webm', '-r', '60', 'output.mp4');
  console.log('Run');

  const mp4File = ffmpeg.FS('readFile', 'output.mp4');
  console.log(mp4File);

  const mp4Blob = new Blob([mp4File.buffer], { type: 'video/mp4' });

  const mp4Url = URL.createObjectURL(mp4Blob);

  console.log(mp4Url);
  const anchor = document.createElement('a');
  // anchor.href = videoFile;
  // anchor.download = 'MyRecording.webm';
  anchor.href = mp4Url;
  anchor.download = 'MyRecording.mp4';
  document.body.appendChild(anchor);
  anchor.click();
  videoFile = null;
  console.log(anchor);
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
