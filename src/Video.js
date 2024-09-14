import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";
import { v4 as uuid } from "uuid";
import Webcam from "react-webcam";

const Video = () => {
  return (
    <div>
      <video src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" controls={true}></video>
    </div>
  );
};

export default Video;
