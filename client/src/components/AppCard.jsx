import React, { useState } from "react";
import { launchApp } from "../services/apiService";
import { useNavigate } from "react-router";

const AppCard = ({ app }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleLaunch = async () => {
    await launchApp({ appPath: app.path, args: inputValue });
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleNavigateOpen = () => {
    const path = app.path.split(".")[0];
    navigate(`/${path}`, { state: { app } });
  };
  return (
    <div>
      <div
        onClick={handleNavigateOpen}
        className=" p-4 rounded shadow hover:bg-gray-200 cursor-pointer flex flex-col items-center"
      >
        <img
          src={app.icon}
          alt={`${app.name} icon`}
          className="w-10 h-10 mr-2 inline-block"
        />
        <p className="font-medium inline-block text-sm">{app.name}</p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
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
                onClick={handleCloseModal}
                className="mr-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
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
      )}
    </div>
  );
};

export default AppCard;
