import React, { useState } from "react";
import { workers, Worker } from "@/app/utils/fakes/workersFakes";
import { Badge } from "./badge";
import Button from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import SpecialistModal from "./SpecialistModal";




const SPECIALIST_TYPES = [
  "Architect",
  "Plumber",
  "Painter",
  "Electrician",
  "Contractor",
  "Landscaper",
  "Interior Designer",
  "General Contractor",
];

const opencageApi = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  // Haversine formula
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const SpecialistLocator: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [areaName, setAreaName] = useState<string>("");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  // Filter workers by type and proximity (within 10km) or by area if available
  const filteredWorkers = workers.filter((worker) => {
    if (
      selectedType &&
      worker.specialist.toLowerCase() !== selectedType.toLowerCase()
    ) {
      return false;
    }
    if (areaName) {
      // Only show workers whose area matches the detected area (case-insensitive)
      const detectedArea = areaName.split(",")[0].trim().toLowerCase();
      return worker.location.area.toLowerCase() === detectedArea;
    }
    if (userLocation) {
      const dist = getDistance(
        userLocation.lat,
        userLocation.lng,
        worker.location.lat,
        worker.location.lng
      );
      return dist <= 10; // 10km radius
    }
    return true;
  });

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-center">
        <Button
          text="📍 Locate Me"
          texSize="text-base"
          hoverBg="hover:bg-amber-600"
          borderCol="border-amber-500"
          bgCol="bg-amber-500"
          textCol="text-white"
          border="border"
          padding="px-4 py-2"
          round="rounded"
          handleButton={handleLocate}
        />
        <select
          className="border border-amber-300 bg-white text-amber-900 rounded px-3 py-2 text-sm focus:border-amber-500"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Specialists</option>
          {SPECIALIST_TYPES.map((type) => (
            <option key={type} value={type} className="text-amber-900 bg-white">
              {type}
            </option>
          ))}
        </select>
        {userLocation && (
          <span className="text-amber-700 text-xs ml-2">Location found!</span>
        )}
        {areaName && (
          <span className="text-amber-900 text-xs ml-2 font-bold">
            Area: {areaName}
          </span>
        )}
        {locationError && (
          <span className="text-amber-600 text-xs ml-2">{locationError}</span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWorkers.length === 0 && (
          <div className="col-span-full text-amber-700">
            No specialists found in this area.
          </div>
        )}
        {filteredWorkers.map((worker) => (
          <div
            key={worker.id}
            className="flex items-center gap-4 p-4 border border-amber-200 rounded-lg bg-white shadow-sm cursor-pointer"
            onClick={() => {
              setSelectedWorker(worker);
              setModalOpen(true);
            }}
          >
            <Avatar>
              <AvatarImage src={worker.avatar} alt={worker.name} />
              <AvatarFallback>{worker.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-amber-900 flex items-center gap-2">
                {worker.name}
              </div>
              <div className="text-xs text-amber-700 mb-1">
                {worker.specialist}
              </div>
              <div className="text-xs text-amber-700 mb-1">{worker.email}</div>
              <div className="text-xs text-amber-700 mb-1">{worker.phone}</div>
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center text-xs mt-1">
                <Badge
                  variant="outline"
                  className="border-amber-500 text-amber-700 bg-white"
                >
                  Certified:{" "}
                  {worker.certified ? <span>✔️ Yes</span> : <span>❌ No</span>}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    worker.available
                      ? "border-amber-500 text-amber-700 bg-white"
                      : "border-amber-200 text-amber-300 bg-white"
                  }
                >
                  Available:{" "}
                  {worker.available ? <span>✔️ Yes</span> : <span>❌ No</span>}
                </Badge>
              </div>
            </div>
          </div>
        ))}
        <SpecialistModal
          worker={selectedWorker}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default SpecialistLocator;
