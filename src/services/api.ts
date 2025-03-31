import { NetworkHeaderData } from "../types/networkDashboard";

const API_BASE_URL = 'http://localhost:3001';

// Helper function to get a random fluctuation value
const getRandomFluctuation = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Format the time string based on a base time and an offset in minutes
const formatTimeWithOffset = (baseTimeStr: string, offsetMinutes: number): string => {
  // Parse base time (format: "09:05 HRS")
  const [timeStr] = baseTimeStr.split(' ');
  const [hoursStr, minutesStr] = timeStr.split(':');
  
  let hours = parseInt(hoursStr, 10);
  let minutes = parseInt(minutesStr, 10) + offsetMinutes;
  
  // Handle minute overflow
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes %= 60;
  }
  
  // Handle hour overflow (24-hour format)
  hours %= 24;
  
  // Format the time string
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} HRS`;
};

export const fetchNetworkHeaderData = async (): Promise<NetworkHeaderData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/networkHeader`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the actual network data, handling potentially nested data structure
    let networkData: NetworkHeaderData;
    
    // Check if we have nested item structure and attempt to extract the real data
    if (data.item) {
      // Find the deepest item that contains our real data
      let currentObject = data;
      while (currentObject.item && typeof currentObject.item === 'object') {
        currentObject = currentObject.item;
      }
      
      // If we found something with domains, use it, otherwise use the original data
      if (currentObject.domains || 
          (currentObject.item && Array.isArray(currentObject.item.domains))) {
        networkData = {
          location: currentObject.location || "CALIFORNIA",
          timeRange: currentObject.timeRange || "1HR - 8:00 AM TO 9:00 AM",
          utc: currentObject.utc || "UTC 8:00",
          currentTime: currentObject.currentTime || "09:05 HRS",
          date: currentObject.date || "22 MAY 2014 TUESDAY",
          timeOffset: currentObject.timeOffset || 0,
          baseServices: currentObject.baseServices || {
            "I": 120,
            "II": 430,
            "III": 45,
            "IV": 84
          },
          baseCritical: currentObject.baseCritical || {
            "I": 12,
            "II": 8,
            "III": 32,
            "IV": 16
          },
          domains: Array.isArray(currentObject.domains) ? currentObject.domains : [
            { id: "I", name: "Domain Enterprise", services: 120, critical: 12 },
            { id: "II", name: "Domain name text", services: 430, critical: 8 },
            { id: "III", name: "Domain 3", services: 45, critical: 32 },
            { id: "IV", name: "Domain 1", services: 84, critical: 16 }
          ]
        };
      } else {
        // Reset to default if structure is too corrupt
        networkData = getDefaultNetworkData();
      }
    } else {
      // Use the data directly if it doesn't have nested items
      networkData = {
        location: data.location || "CALIFORNIA",
        timeRange: data.timeRange || "1HR - 8:00 AM TO 9:00 AM",
        utc: data.utc || "UTC 8:00",
        currentTime: data.currentTime || "09:05 HRS",
        date: data.date || "22 MAY 2014 TUESDAY",
        timeOffset: data.timeOffset || 0,
        baseServices: data.baseServices || {
          "I": 120,
          "II": 430,
          "III": 45,
          "IV": 84
        },
        baseCritical: data.baseCritical || {
          "I": 12,
          "II": 8,
          "III": 32,
          "IV": 16
        },
        domains: Array.isArray(data.domains) ? data.domains : [
          { id: "I", name: "Domain Enterprise", services: 120, critical: 12 },
          { id: "II", name: "Domain name text", services: 430, critical: 8 },
          { id: "III", name: "Domain 3", services: 45, critical: 32 },
          { id: "IV", name: "Domain 1", services: 84, critical: 16 }
        ]
      };
    }
    
    // Increment time offset by 5 minutes (since we refresh every 5 seconds in our simulation)
    const newTimeOffset = networkData.timeOffset + 5;
    
    // Update the current time based on the offset
    const updatedTime = formatTimeWithOffset(networkData.currentTime, 5); // Always add 5 minutes
    
    // Generate random fluctuations for services and critical values
    const updatedDomains = networkData.domains.map(domain => {
      // Get base values
      const baseServiceValue = networkData.baseServices[domain.id] || domain.services;
      const baseCriticalValue = networkData.baseCritical[domain.id] || domain.critical;
      
      // Apply random fluctuations around the base values
      const newServices = Math.max(0, baseServiceValue + getRandomFluctuation(-10, 10));
      const newCritical = Math.max(0, baseCriticalValue + getRandomFluctuation(-5, 5));
      
      return {
        ...domain,
        services: newServices,
        critical: newCritical
      };
    });
    
    try {
      // Reset the data structure to a clean state before updating
      await fetch(`${API_BASE_URL}/networkHeader`, {
        method: 'PUT', // Use PUT instead of PATCH to replace the entire object
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: networkData.location,
          timeRange: networkData.timeRange,
          utc: networkData.utc,
          currentTime: updatedTime,
          date: networkData.date,
          timeOffset: newTimeOffset,
          baseServices: networkData.baseServices,
          baseCritical: networkData.baseCritical,
          domains: updatedDomains
        })
      });
    } catch (putError) {
      console.warn('Failed to update server with new time offset:', putError);
      // Continue execution even if PUT fails
    }
    
    // Return updated data
    return {
      ...networkData,
      timeOffset: newTimeOffset,
      currentTime: updatedTime,
      domains: updatedDomains
    };
  } catch (error) {
    console.error('Error fetching network header data:', error);
    // Return default data in case of error
    return getDefaultNetworkData();
  }
};

// Function to get default network data
const getDefaultNetworkData = (): NetworkHeaderData => {
  return {
    location: "CALIFORNIA",
    timeRange: "1HR - 8:00 AM TO 9:00 AM",
    utc: "UTC 8:00",
    currentTime: "09:05 HRS",
    date: "22 MAY 2014 TUESDAY",
    timeOffset: 0,
    baseServices: {
      "I": 120,
      "II": 430,
      "III": 45,
      "IV": 84
    },
    baseCritical: {
      "I": 12,
      "II": 8,
      "III": 32,
      "IV": 16
    },
    domains: [
      { id: "I", name: "Domain Enterprise", services: 120, critical: 12 },
      { id: "II", name: "Domain name text", services: 430, critical: 8 },
      { id: "III", name: "Domain 3", services: 45, critical: 32 },
      { id: "IV", name: "Domain 1", services: 84, critical: 16 }
    ]
  };
};

// Add additional functions to fetch domains and services
export const fetchDomains = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/domains`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching domains:', error);
    throw error;
  }
};

export const fetchServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};