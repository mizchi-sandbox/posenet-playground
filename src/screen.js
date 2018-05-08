/* @flow */
import * as tf from '@tensorflow/tfjs-core'
import * as posenet from '@tensorflow-models/posenet'
import { type Pose, type KeyPoint, getAdjacentKeyPoints } from './pose'

const color = 'aqua'
const lineWidth = 2

function toTuple({ y, x }) {
  return [y, x]
}

function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath()
  ctx.moveTo(ax * scale, ay * scale)
  ctx.lineTo(bx * scale, by * scale)
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = color
  ctx.stroke()
}

export function drawSkeleton(
  keypoints: Array<KeyPoint>,
  minConfidence: number,
  ctx: any,
  scale: number = 1
) {
  const adjacentKeyPoints = getAdjacentKeyPoints(keypoints, minConfidence)

  adjacentKeyPoints.forEach(keypoints => {
    drawSegment(
      toTuple(keypoints[0].position),
      toTuple(keypoints[1].position),
      color,
      scale,
      ctx
    )
  })
}

export function drawKeypoints(
  keypoints: Array<KeyPoint>,
  minConfidence: number,
  ctx: any,
  scale: number = 1
) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i]

    if (keypoint.score < minConfidence) {
      continue
    }

    const { y, x } = keypoint.position
    ctx.beginPath()
    ctx.arc(x * scale, y * scale, 3, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
  }
}

export function drawPose(
  ctx: any,
  video: HTMLVideoElement,
  pose: Pose,
  canvasSize: number,
  minPoseConfidence: number,
  minPartConfidence: number
) {
  ctx.clearRect(0, 0, canvasSize, canvasSize)
  // show video
  ctx.save()
  ctx.scale(-1, 1)
  ctx.drawImage(video, 0, 0, canvasSize * -1, canvasSize)
  ctx.restore()

  const scale = canvasSize / video.width

  const { score, keypoints } = pose
  if (score >= minPoseConfidence) {
    // show points
    drawKeypoints(keypoints, minPartConfidence, ctx, scale)
    // show skeleton
    drawSkeleton(keypoints, minPartConfidence, ctx, scale)
  }
}
