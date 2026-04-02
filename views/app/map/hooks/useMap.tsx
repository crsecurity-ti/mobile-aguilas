import React, { useEffect, useRef, useState } from "react";
import { Round } from "../../../../types";
import { Contractor } from "../../../../types";

const useMap = ({
  roundData,
  contractorData,
  currentLocation,
}: {
  roundData: Round | undefined;
  contractorData: Contractor | undefined;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
}) => {
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>();

  useEffect(() => {
    if (mapReady) {
      mapFitToCoordinates();
    }
  }, [mapReady]);

  const goToCurrentLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    }
  };

  const mapFitToCoordinates = () => {
    if (roundData && contractorData && mapRef.current) {
      mapRef.current.fitToCoordinates(
        roundData.locations.map((l) => ({ latitude: l.lat, longitude: l.lng })),
        {
          edgePadding: {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40,
          },
        }
      );
    }
  };

  return { mapFitToCoordinates, setMapReady, mapRef, goToCurrentLocation };
};

export default useMap;
