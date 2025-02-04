import React, { useEffect, useState } from "react";
import AppCard from "../components/AppCard";
import { getInstalledApps, getAllApps } from "../services/apiService";
import { IoSettings } from "react-icons/io5";
import { useNavigate } from "react-router";

const Home = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("all"); // 'all' or 'installed'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data =
        view === "all" ? await getAllApps() : await getInstalledApps();
      setApps(data);
      setLoading(false);
    };
    fetchData();
  }, [view]);

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col flex-start h-screen w-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 text-center">OpeZee</h1>

        <div
          onClick={() => navigate("/settings")}
          className="cursor-pointer flex justify-center mb-4"
        >
          <IoSettings size={30} />
        </div>
      </div>
      <nav className="flex space-x-4 mb-3">
        <a
          onClick={() => setView("all")}
          className={`text-gray-700 hover:text-blue-500 ${
            view === "all" ? "font-bold" : ""
          }`}
        >
          Existing Apps
        </a>
        <a
          onClick={() => setView("installed")}
          className={`text-gray-700 hover:text-blue-500 ${
            view === "installed" ? "font-bold" : ""
          }`}
        >
          Installed Apps
        </a>

        <a
          onClick={() => navigate("/videoplayer")}
          className={`text-gray-700 hover:text-blue-500 ${
            view === "installed" ? "font-bold" : ""
          }`}
        >
          Video Player
        </a>
      </nav>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search apps"
        className="border rounded p-2 mb-4"
      />
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <p>Loading</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredApps.map((app, index) => (
            <AppCard key={index} app={app} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
