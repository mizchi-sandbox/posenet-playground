/* @flow */
import * as posenet from '@tensorflow-models/posenet'

type KeyPointPart =
  | 'nose'
  | 'leftEye'
  | 'rightEye'
  | 'leftEar'
  | 'rightEar'
  | 'leftShoulder'
  | 'rightShoulder'
  | 'leftElbow'
  | 'rightElbow'
  | 'leftWrist'
  | 'rightWrist'
  | 'leftHip'
  | 'rightHip'
  | 'leftKnee'
  | 'rightKnee'
  | 'leftAnkle'
  | 'rightAnkle'

export type KeyPoint = {
  part: KeyPointPart,
  score: number,
  position: {
    x: number,
    y: number
  }
}

export type Pose = {
  score: number,
  keypoints: KeyPoint[]
}

export type Posenet = {
  estimateSinglePose(
    video: HTMLVideoElement,
    imageScaleFactor: number,
    flipHorizontal: boolean,
    outputStride: number
  ): Promise<Pose>
}

export function prepare(): Promise<Posenet> {
  return posenet.load()
}

export function getPose(
  net: Posenet,
  video: any,
  imageScaleFactor: number,
  flipHorizontal: boolean,
  outputStride: number
): Promise<Pose> {
  return net.estimateSinglePose(
    video,
    imageScaleFactor,
    flipHorizontal,
    outputStride
  )
}

export function getAdjacentKeyPoints(
  keypoints: KeyPoint[],
  minConfidence: number
): KeyPoint[] {
  return posenet.getAdjacentKeyPoints(keypoints, minConfidence)
}
