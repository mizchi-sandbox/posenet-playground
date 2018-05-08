/* @flow */
import * as posenet from '@tensorflow-models/posenet'
import { drawKeypoints, drawSkeleton, drawPose } from './screen'
import * as media from './media'
import { getPose, prepare } from './pose'

const maxVideoSize = 513
const canvasSize = 400
const outputStride = 16
const imageScaleFactor = 0.5
const minPoseConfidence = 0.1
const minPartConfidence = 0.5
const flipHorizontal = true

// elements
const body: any = document.body
const mainEl: any = document.getElementById('main')

const canvas: any = document.getElementById('output')
canvas.width = canvasSize
canvas.height = canvasSize
const ctx = canvas.getContext('2d')

function start(video, net) {
  async function mainloop(): Promise<void> {
    const pose = await getPose(
      net,
      video,
      imageScaleFactor,
      flipHorizontal,
      outputStride
    )
    drawPose(ctx, video, pose, canvasSize, minPoseConfidence, minPartConfidence)

    requestAnimationFrame((mainloop: any))
  }

  mainloop()
}

export async function main() {
  const net = await prepare()

  // setup media
  const cameras = await media.getCameras()
  if (cameras.length === 0) {
    alert('No webcams available.  Reload the page when a webcam is available.')
    return
  }
  const video = await media.loadVideo(cameras[0].deviceId)

  start(video, net)
}

// getUserMedia polyfill
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia

main()
