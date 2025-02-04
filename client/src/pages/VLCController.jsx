import React, { useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeDown,
  FaFastForward,
  FaFastBackward,
} from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { useNavigate } from "react-router";
import { WEB_SOCKET_URL } from "../constants";

const VLCController = () => {
  const [socket, setSocket] = useState(null);
  const [videoPath, setVideoPath] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const websocketurl = WEB_SOCKET_URL || "ws://localhost:2354";
    const newSocket = new WebSocket(websocketurl);

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      setSocket(newSocket);
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
      setSocket(null);
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  const sendCommand = (command, data = {}) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ action: command, ...data }));
    } else {
      console.error("WebSocket is not open");
    }
  };

  const handlePlay = () => {
    sendCommand("play", { payload: videoPath });
  };

  const handlePause = () => {
    sendCommand("pause");
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => sendCommand("next");
  const handlePrevious = () => sendCommand("previous");
  const handleVolumeUp = () => sendCommand("volumeUp");
  const handleVolumeDown = () => sendCommand("volumeDown");
  const handleSeekForward = () => sendCommand("seekForward");
  const handleSeekBackward = () => sendCommand("seekBackward");
  const handleSeek = (time) => sendCommand("seekToTime", { time });
  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center p-4 bg-gray-900 rounded-lg shadow-xl">
      <div className="w-full h-full p-4 bg-gray-900 rounded-lg shadow-xl">
        {/* Video Preview Placeholder */}
        <div className="bg-black aspect-video mb-4 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Video Preview</span>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-4">
          <div className="h-2 bg-gray-700 rounded-full">
            <div className="h-2 bg-blue-500 rounded-full w-1/3"></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>0:00</span>
            <span>3:00</span>
          </div>
        </div>

        {/* Video Path Input */}
        <div className="mb-6">
          <input
            type="text"
            value={videoPath}
            onChange={(e) => setVideoPath(e.target.value)}
            placeholder="Enter video path..."
            className="w-full px-3 py-2 bg-gray-800 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex justify-around mb-4">
          <button onClick={() => handlePlay()}>Play</button>
          <button onClick={() => setVideoPath("")}>Clear</button>
        </div>
        {/* Main Controls */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
          {/* Playback Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => handleSeekBackward()}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FaFastBackward className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrevious}
              className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FaStepBackward className="w-5 h-5" />
            </button>
            <button
              onClick={handlePause}
              className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 transition-colors duration-200"
            >
              {isPlaying ? (
                <FaPause className="w-6 h-6" />
              ) : (
                <FaPlay className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={handleNext}
              className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FaStepForward className="w-5 h-5" />
            </button>
            <div>
              <button
                onClick={() => handleSeekForward()}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <FaFastForward className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Volume Controls */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleVolumeDown}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <FaVolumeDown className="w-5 h-5" />
              </button>
              <input
                type="range"
                min="0"
                max="100"
                className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                disabled
              />
              <button
                onClick={handleVolumeUp}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <FaVolumeUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <button
            onClick={navigateHome}
            className="mr-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            <IoHome />
          </button>
        </div>

        {/* Quick Seek Controls */}
      </div>
    </div>
  );
};

export default VLCController;
