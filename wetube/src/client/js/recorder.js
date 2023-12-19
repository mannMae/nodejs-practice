const startButton = document.querySelector('#startRecordButton');
const video = document.querySelector('#preview');

const handleClickStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

startButton.addEventListener('click', handleClickStart);
