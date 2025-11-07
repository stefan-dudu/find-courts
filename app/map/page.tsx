import React from "react";
import MapComponent from "@/components/MapComponent";

// const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

type Props = {};

const Map = (props: Props) => {
  return (
    <div>
      <h1>Map page</h1>
      <MapComponent />
    </div>
  );
};

export default Map;
