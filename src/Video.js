import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";
import { v4 as uuid } from "uuid";
import Webcam from "react-webcam";

const Video = () => {
  return (
    <div>
      <video src="https://dl6.webmfiles.org/big-buck-bunny_trailer.webm" controls={true}></video>
    </div>
  );
};

export default Video;
