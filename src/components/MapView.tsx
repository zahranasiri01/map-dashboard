import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import type { Equipment } from "../types";
import { Feature } from "ol";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Overlay from "ol/Overlay";

interface MockEquipment {
  mockEquipment: Equipment[];
  selectedEquipmentId: number | null;
}

export default function MapView({ mockEquipment , selectedEquipmentId }: MockEquipment) {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<Overlay | null>(null);
  // const popupElementRef = useRef<HTMLDivElement | null>(null);

  const [selectedEquipment, setSelectedEquipment] =
    useState<Equipment | null>(null);
    const selectedEquipmentIdRef = useRef<number | null>(
  selectedEquipmentId
);

selectedEquipmentIdRef.current = selectedEquipmentId;



  const [showRouteReport, setShowRouteReport] = useState(false);

  const routeSourceRef = useRef(new VectorSource());
  const mapRef = useRef<Map>(null);

  useEffect(() => {
    if (!mapElement.current) return;

    // -----------------------------
    // Equipment Features
    // -----------------------------

    const features = mockEquipment.map((equipment) => {
      return new Feature({
        geometry: new Point(
          fromLonLat([
            equipment.location.longitude,
            equipment.location.latitude,
          ])
        ),
        equipmentId: equipment.id,
        status: equipment.status,
      });
    });

    const vectorSource = new VectorSource({
      features,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,

   style: (feature) => {
  const status = feature.get("status");
  const equipmentId = feature.get("equipmentId");

  const color =
    status === "active" ? "#16a34a" : "#dc2626";

  const isSelected =
    equipmentId === selectedEquipmentIdRef.current;

  return new Style({
    image: new CircleStyle({
      radius: isSelected ? 10 : 7,
      fill: new Fill({ color }),
      stroke: new Stroke({
        color: isSelected ? "#2563eb" : "#ffffff",
        width: isSelected ? 4 : 2,
      }),
    }),
  });
},


    });

    // -----------------------------
    // Route Layer
    // -----------------------------

    const routeLayer = new VectorLayer({
      source: routeSourceRef.current,

      style: (feature) => {
        const type = feature.get("type");

        if (type) {
          const color =
            type === "origin"
              ? "blue"
              : "orange";

          return new Style({
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({ color }),
              stroke: new Stroke({
                color: "#ffffff",
                width: 2,
              }),
            }),
          });
        }

        return new Style({
          stroke: new Stroke({
            color: "#2563eb",
            width: 4,
          }),
        });
      },
    });

    // -----------------------------
    // Create Map
    // -----------------------------

    const map = new Map({
      target: mapElement.current,

      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
        routeLayer,
      ],

      view: new View({
        center: fromLonLat([51.389, 35.689]),
        zoom: 11,
      }),
    });

    mapRef.current = map;

    // -----------------------------
    // Popup
    // -----------------------------

const popupElement = document.createElement("div");

popupElement.className =
  "min-w-[220px] rounded-xl bg-white p-4 shadow-lg";

popupElement.style.position = "relative";

    const popup = new Overlay({
      element: popupElement,
      positioning: "bottom-center",
      stopEvent: true,
    });

    popupRef.current = popup;

    map.addOverlay(popup);

    // -----------------------------
    // Initial Map Fit
    // -----------------------------

    if (features.length > 0) {
      const extent = vectorSource.getExtent();

      if (extent) {
        map.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          maxZoom: 14,
          duration: 500,
        });
      }
    }

    // -----------------------------
    // Map Click
    // -----------------------------

    map.on("click", (event) => {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );

      if (!feature) {
        setSelectedEquipment(null);
        popup.setPosition(undefined);
        return;
      }

      const equipmentId = feature.get("equipmentId");

      const equipment = mockEquipment.find(
        (item) => item.id === equipmentId
      );

      if (!equipment) return;

      setSelectedEquipment(equipment);

      // Popup content
      popupElement.innerHTML = "";

      const title = document.createElement("h3");
title.textContent = equipment.name;
title.className =
  "mb-3 pr-6 text-base font-semibold text-gray-900";

const type = document.createElement("p");
type.textContent = `Type: ${equipment.type}`;
type.className = "mb-1 text-sm text-gray-600";

const status = document.createElement("p");
status.textContent = `Status: ${equipment.status}`;
status.className = "mb-1 text-sm font-medium";

status.classList.add(
  equipment.status === "active"
    ? "text-green-600"
    : "text-red-600"
);

const location = document.createElement("p");
location.textContent =
  `Location: ${equipment.location.address}`;
location.className = "mb-1 text-sm text-gray-600";

const distance = document.createElement("p");
distance.textContent =
  `Distance: ${equipment.distanceTraveled} / ${equipment.totalDistance}`;
distance.className =
  "mb-4 text-sm text-gray-600";
    const closeButton = document.createElement("button");

closeButton.textContent = "×";

closeButton.className =
  "absolute right-3 top-2 text-xl text-gray-400 transition hover:text-gray-700";

closeButton.setAttribute(
  "aria-label",
  "Close popup"
);

      closeButton.onclick = () => {
        setSelectedEquipment(null);
        setShowRouteReport(false);
        popup.setPosition(undefined);
      };

      const routeButton = document.createElement("button");

routeButton.textContent = "گزارش مسیر";

routeButton.className =
  "w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700";
      routeButton.onclick = () => {
        const coordinates =
          getRouteCoordinates(equipment);

        const {
          line,
          origin,
          destination,
        } = createRouteFeatures(
          coordinates,
          equipment.id
        );

        showRouteOnMap({
          line,
          origin,
          destination,
        });

        setShowRouteReport(true);
      };

      popupElement.appendChild(closeButton);
      popupElement.appendChild(title);
      popupElement.appendChild(type);
      popupElement.appendChild(status);
      popupElement.appendChild(location);
      popupElement.appendChild(distance);
      popupElement.appendChild(routeButton);

      popup.setPosition(event.coordinate);
    });

    return () => {
      map.setTarget(undefined);
      popup.setPosition(undefined);
    };
  }, [mockEquipment]);
//end of use effect 1

useEffect(() => {
  if (selectedEquipmentId === null || !mapRef.current) {
    return;
  }

  const equipment = mockEquipment.find(
    (item) => item.id === selectedEquipmentId
  );

  if (!equipment) {
    return;
  }

  const center = fromLonLat([
    equipment.location.longitude,
    equipment.location.latitude,
  ]);

  mapRef.current.getView().animate({
    center,
    zoom: 14,
    duration: 700,
  });
}, [selectedEquipmentId, mockEquipment]);
// end of use effect 2



useEffect(() => {
  if (selectedEquipmentId === null || !mapRef.current) {
    return;
  }

  const map = mapRef.current;

  const equipment = mockEquipment.find(
    (item) => item.id === selectedEquipmentId
  );

  if (!equipment) return;

  const coordinate = fromLonLat([
    equipment.location.longitude,
    equipment.location.latitude,
  ]);

  let animation: Animation | undefined;
  let pulseOverlay: Overlay | undefined;
  let cancelled = false;

  // First, move and zoom the map
  map.getView().animate(
    {
      center: coordinate,
      zoom: 14,
      duration: 700,
    },
    (completed) => {
      if (!completed || cancelled) return;

      // Start pulse only after zoom finishes
      const pulseElement = document.createElement("div");

      pulseElement.style.width = "20px";
      pulseElement.style.height = "20px";
      pulseElement.style.border = "3px solid #2563eb";
      pulseElement.style.borderRadius = "50%";
      pulseElement.style.boxSizing = "border-box";
      pulseElement.style.pointerEvents = "none";

      pulseOverlay = new Overlay({
        element: pulseElement,
        positioning: "center-center",
        stopEvent: false,
      });

      map.addOverlay(pulseOverlay);
      pulseOverlay.setPosition(coordinate);

      animation = pulseElement.animate(
        [
          { transform: "scale(1)", opacity: 0.9 },
          { transform: "scale(4)", opacity: 0 },
        ],
        {
          duration: 800,
          iterations: 3,
          easing: "ease-out",
        }
      );

      animation.onfinish = () => {
        if (pulseOverlay) {
          map.removeOverlay(pulseOverlay);
        }
      };
    }
  );

  return () => {
    cancelled = true;
    animation?.cancel();

    if (pulseOverlay) {
      map.removeOverlay(pulseOverlay);
    }
  };
}, [selectedEquipmentId, mockEquipment]);


 
//end of use effect 3


  // -----------------------------
  // Route Coordinates
  // -----------------------------

  const getRouteProgress = (equipment: Equipment) => {
  return Math.round(
    (equipment.distanceTraveled / equipment.totalDistance) * 100
  );
};
  const getRouteCoordinates = (
    equipment: Equipment
  ) => {
    return [
      fromLonLat([
        equipment.origin.longitude,
        equipment.origin.latitude,
      ]),

      fromLonLat([
        equipment.location.longitude,
        equipment.location.latitude,
      ]),

      fromLonLat([
        equipment.destination.longitude,
        equipment.destination.latitude,
      ]),
    ];
  };

  // -----------------------------
  // Create Route Features
  // -----------------------------

 const createRouteFeatures = (
  coordinates: number[][],
  equipmentId: number
): {
  line: LineString;
  origin: Feature<Point>;
  destination: Feature<Point>;
} => {
    const line = new LineString(coordinates);

    const origin = new Feature({
      geometry: new Point(coordinates[0]),
      equipmentId: equipmentId,
      type: "origin",
    });

    const destination = new Feature({
      geometry: new Point(coordinates[2]),
      equipmentId: equipmentId,
      type: "destination",
    });

    return {
      line,
      origin,
      destination,
    };
  };

  // -----------------------------
  // Show Route On Map
  // -----------------------------

  const showRouteOnMap = ({
  line,
  origin,
  destination,
}: ReturnType<typeof createRouteFeatures>) => {
  routeSourceRef.current.clear();

  routeSourceRef.current.addFeature(
    new Feature({
      geometry: line,
    })
  );

  routeSourceRef.current.addFeature(origin);
  routeSourceRef.current.addFeature(destination);

  const extent = routeSourceRef.current.getExtent();

  if (extent) {
    mapRef.current?.getView().fit(extent, {
      padding: [80, 80, 80, 80],
      maxZoom: 14,
      duration: 800,
    });
  }
};

 return (
  <div className="space-y-4">
    {/* Map */}
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div
        ref={mapElement}
        className="h-[350px] w-full sm:h-[420px] lg:h-[500px]"
      />
    </div>

    {/* Route Report */}
    {showRouteReport && selectedEquipment && (
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Route Report
          </h3>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {getRouteProgress(selectedEquipment)}%
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">
              Origin
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {selectedEquipment.origin.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-gray-500">
              Destination
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {selectedEquipment.destination.name}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-500">Distance</span>
            <span className="font-medium text-gray-900">
              {selectedEquipment.distanceTraveled} /{" "}
              {selectedEquipment.totalDistance} km
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${getRouteProgress(selectedEquipment)}%`,
              }}
            />
          </div>
        </div>
      </div>
    )}
  </div>
);
}