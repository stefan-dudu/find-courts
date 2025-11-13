import React from "react";
import MapComponent from "@/components/MapComponent";

// const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

type Props = {};

const Map = (props: Props) => {
  return (
    <div>
      <MapComponent />
    </div>
  );
};

export default Map;
