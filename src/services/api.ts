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
    
    // Ensure required fields exist and provide defaults if needed
    const networkData: NetworkHeaderData = {
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
      // Update the server with the new time offset
      await fetch(`${API_BASE_URL}/networkHeader`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timeOffset: newTimeOffset,
          currentTime: updatedTime
        })
      });
    } catch (patchError) {
      console.warn('Failed to update server with new time offset:', patchError);
      // Continue execution even if PATCH fails
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
    throw error;
  }
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