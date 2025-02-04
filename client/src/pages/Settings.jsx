import React, { useState, useEffect } from "react";
import {
  addApp,
  getAllApps,
  getInstalledApps,
  removeApp,
} from "../services/apiService";
import { IoHome, IoTrashBin } from "react-icons/io5";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const Settings = () => {
  const [apps, setApps] = useState([]);
  const [newApp, setNewApp] = useState({ name: "", path: "", icon: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllApps();
      setApps(data);
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewApp({ ...newApp, [name]: value });
  };

  const handleAddApp = async () => {
    if (!newApp.name || !newApp.path || !newApp.icon) {
      alert("Please fill in both fields");
      return;
    }
    toast
      .promise(addApp(newApp), {
        pending: "Adding app...",
        success: "App added successfully!",
        error: "Failed to add app",
      })
      .then(async () => {
        const updatedApps = await getAllApps();
        setApps(updatedApps);
        setNewApp({ name: "", path: "", icon: "" });
      });
  };
  const navigateHome = () => {
    navigate("/");
  };

  const handleRemoveApp = async (name) => {
    toast
      .promise(removeApp({ name }), {
        pending: "Removing app...",
        success: "App removed successfully!",
        error: "Failed to remove app",
      })
      .then(async () => {
        const updatedApps = await getAllApps();
        setApps(updatedApps);
        setNewApp({ name: "", path: "", icon: "" });
      });
  };

  return (
    <div className="p-4 w-screen">
      <div className="flex justify-between items-center mb-4 w-full">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>

        <button
          onClick={navigateHome}
          className="mr-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          <IoHome />
        </button>
      </div>

      {/* Add New App */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Add New App</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newApp.name}
            onChange={handleInputChange}
            placeholder="App Name"
            className="border rounded p-2"
          />
          <input
            type="text"
            name="path"
            value={newApp.path}
            onChange={handleInputChange}
            placeholder="App Path"
            className="border rounded p-2"
          />
          <input
            type="text"
            name="icon"
            value={newApp.icon}
            onChange={handleInputChange}
            placeholder="App Icon"
            className="border rounded p-2"
          />
        </div>
        <button
          onClick={handleAddApp}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add App
        </button>
      </div>

      {/* Existing Apps */}
      <div>
        <h2 className="text-lg font-medium mb-2">Existing Apps</h2>
        <ul className="list-disc pl-6">
          {apps.map((app, index) => (
            <li key={index} className="mb-2">
              <span className="font-medium">{app.name}</span> -{" "}
              <span className="text-gray-500">{app.path}</span>
              <IoTrashBin
                className="inline-block ml-2 text-red-500 flex-end"
                onClick={() => handleRemoveApp(app.name)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Settings;
