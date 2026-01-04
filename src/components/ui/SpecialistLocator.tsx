import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const opencageApi = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

const SpecialistLocator: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [areaName, setAreaName] = useState<string>("");

  const fetchAreaName = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${opencageApi}`
      );
      const data = await res.json();
      console.log("OpenCageData response:", data); // Log full response for testing
      const components = data.results[0]?.components;
      // Compose area as 'city, country' (e.g., 'Kicukiro, Rwanda')
      const city =
        components?._normalized_city ||
        components?.city ||
        components?.town ||
        components?.village ||
        components?.county ||
        components?.state;
      const country = components?.country;
      const area =
        city && country ? `${city}, ${country}` : country || city || "";
      setAreaName(area || "");
    } catch (error) {
      console.error("Error fetching area name:", error);
      setAreaName("");
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError("");
        console.log(
          "User location:",
          position.coords.latitude,
          position.coords.longitude
        );
        fetchAreaName(position.coords.latitude, position.coords.longitude);
      },
      (error: GeolocationPositionError) => {
        setLocationError("Unable to retrieve your location.");
      }
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-center">
        <Button
        variant="outline"
        size="default"
        onClick={() => handleLocate()}
        className="text-small hover:bg-gray-200 bg-white text-black"
      > 
        Locate Me
      </Button>
      </div>
    </div>
  );
};

export default SpecialistLocator;
