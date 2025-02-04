import axios from "axios";
import { SERVER_URL } from "../constants";

const BASE_URL = SERVER_URL || "http://localhost:2354/api";

export const launchApp = async (appData) => {
  try {
    const response = await axios.post(`${BASE_URL}/apps/launch`, appData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getInstalledApps = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/apps/installed`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllApps = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/apps/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const terminateApp = async (appData) => {
  try {
    const response = await axios.post(`${BASE_URL}/apps/terminate`, appData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addApp = async (appData) => {
  try {
    const response = await axios.post(`${BASE_URL}/apps/add`, appData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeApp = async (appData) => {
  try {
    const response = await axios.post(`${BASE_URL}/apps/remove`, appData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
