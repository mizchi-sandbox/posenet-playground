/* @flow */
let currentStream = null
const maxVideoSize = 513

function stopCurrentVideoStream() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => {
      track.stop()
    })
  }
}

export async function getCameras() {
  const devices = await (navigator.mediaDevices: any).enumerateDevices()
  return devices.filter(({ kind }) => kind === 'videoinput')
}

export function loadVideo(cameraId: any) {
  stopCurrentVideoStream()
  const video: any = document.getElementById('video')
  video.width = maxVideoSize
  video.height = maxVideoSize

  return new Promise((resolve, reject) => {
    ;(navigator: any).getUserMedia(
      {
        video: {
          width: maxVideoSize,
          height: maxVideoSize,
          deviceId: { exact: cameraId }
        }
      },
      handleVideo,
      videoError
    )

    function handleVideo(stream) {
      currentStream = stream
      video.srcObject = stream

      resolve(video)
    }

    function videoError(e) {
      reject(e)
    }
  })
}
