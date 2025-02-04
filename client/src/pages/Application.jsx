import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { launchApp, terminateApp } from "../services/apiService";
import toast from "react-hot-toast";
import { IoHome } from "react-icons/io5";

const AppPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [inputValue, setInputValue] = useState("");
  const app = location.state?.app;

  const handleLaunch = async () => {
    toast.promise(launchApp({ appPath: app.path, args: inputValue }), {
      pending: "Launching app...",
      success: "App launched successfully!",
      error: "Failed to launch app",
    });
  };

  const handleHome = async () => {
    toast.promise(terminateApp({ appName: id }), {
      pending: "Terminating app...",
      success: "App terminated successfully!",
      error: "Failed to terminate app",
    });
  };

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div className="p-4 bg-gray-800 bg-opacity-50 h-screen w-screen flex flex-col ">
      <h1 className="text-xl font-bold mb-4 text-center">{id}</h1>
      {/* Add more content related to the app here */}

      <div className="flex items-center justify-center mt-5">
        <div className="bg-black p-6 rounded shadow-lg">
          <h2 className="text-xl font-bold mb-4">Launch {app.name}</h2>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter arguments"
            className="border rounded p-2 mb-4 w-full"
          />
          <div className="flex justify-end">
            <button
              onClick={handleHome}
              className="mr-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Home
            </button>
            <button
              onClick={handleLaunch}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Open
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
    </div>
  );
};

export default AppPage;
