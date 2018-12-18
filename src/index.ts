import "@babel/polyfill";
import * as posenet from "@tensorflow-models/posenet";
import { drawPose } from "./drawPose";
import * as media from "./media";

const canvasSize = 400;
const outputStride = 16;
const imageScaleFactor = 0.5;
const minPoseConfidence = 0.1;
const minPartConfidence = 0.5;
const flipHorizontal = true;

// elements
const canvas: any = document.getElementById("output");
canvas.width = canvasSize;
canvas.height = canvasSize;
const ctx = canvas.getContext("2d");

async function update(
  net: posenet.PoseNet,
  video: HTMLVideoElement
): Promise<void> {
  const pose = await net.estimateSinglePose(
    video,
    imageScaleFactor,
    flipHorizontal,
    outputStride
  );
  drawPose(ctx, video, pose, canvasSize, minPoseConfidence, minPartConfidence);
}

export async function main() {
  const net = await posenet.load();

  // setup media
  const cameras = await media.getCameras();
  const video = await media.loadVideo(cameras[0].deviceId);

  async function mainloop(): Promise<void> {
    update(net, video);
    requestAnimationFrame(mainloop);
  }

  mainloop();
}

main();
