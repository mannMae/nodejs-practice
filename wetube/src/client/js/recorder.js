import FFmpeg, { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const startButton = document.querySelector('#startRecordButton');
const video = document.querySelector('#preview');

let stream;
let recorder;
let videoFile;

const files = {
  input: 'recording.webm',
  output: 'output.mp4',
  thumb: 'thumbnail.jpg',
};

const downloadFile = (fileUrl, fileName) => {
  const anchor = document.createElement('a');
  anchor.href = fileUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
};

const handleClickStart = () => {
  if (videoFile) {
    handleDownload();
  } else if (recorder) {
    handleStop();
  } else {
    handleStart();
  }
};

const handleStart = () => {
  console.log('starting');
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
  console.log('Downloading');
  startButton.removeEventListener('click', handleClickStart);
  startButton.innerText = 'Transcoding...';
  startButton.disabled = true;
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  ffmpeg.FS('writeFile', 'recording.webm', await fetchFile(videoFile));

  await ffmpeg.run('-i', 'recording.webm', '-r', '60', files.input);
  await ffmpeg.run(
    '-i',
    'recording.webm',
    '-ss',
    '00:00:01',
    '-frames:v',
    '1',
    files.thumb
  );

  const mp4File = ffmpeg.FS('readFile', files.ouput);
  const thumbFile = ffmpeg.FS('readFile', files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: 'video/mp4' });
  const thumbBlob = new Blob([thumbFile.buffer], { type: 'image/jpg' });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const jpgUrl = URL.createObjectURL(thumbBlob);

  console.log(mp4Url);
  // anchor.href = videoFile;
  // anchor.download = 'MyRecording.webm';
  downloadFile(mp4Url, 'MyRecording.mp4');
  downloadFile(jpgUrl, 'MyThumbnail.jpg');

  ffmpeg.FS('unlink', files.input);
  ffmpeg.FS('unlink', files.output);
  ffmpeg.FS('unlink', files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(jpgUrl);
  URL.revokeObjectURL(videoFile);

  videoFile = null;
};

const handleStop = () => {
  console.log('stop');
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
