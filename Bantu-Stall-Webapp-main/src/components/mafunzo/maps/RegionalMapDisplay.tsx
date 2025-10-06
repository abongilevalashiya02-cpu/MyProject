
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DestinationType, ViewMode, MapFilter, Destination, Route } from "./RegionalMapsContainer";

interface Props {
  viewMode: ViewMode;
  filter: MapFilter;
  onDestinationClick: (destination: Destination) => void;
  getDestinationColor: (type: DestinationType) => string;
  destinations: Destination[];
  routes: Route[];
}

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNsdHg3ZW4wZzAyMG8yanFxdGdrYXY3dnMifQ.a_cF2vM7sRqaBT1BzGfYLQ';

const RegionalMapDisplay: React.FC<Props> = ({
  viewMode,
  filter,
  onDestinationClick,
  getDestinationColor,
  destinations,
  routes,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);

  // Map init and event logic
  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [25, -15],
      zoom: 3.5,
      minZoom: 2,
      maxZoom: 10,
    });
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    popup.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: "300px",
      offset: 15,
    });
    map.current.on("load", () => {
      if (!map.current) return;
      // Destinations source/layer
      map.current.addSource("destinations", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: destinations.map((dest) => ({
            type: "Feature",
            properties: {
              id: dest.id,
              name: dest.name,
              country: dest.country,
              type: dest.type,
              description: dest.description,
            },
            geometry: { type: "Point", coordinates: dest.coordinates },
          })),
        },
      });
      map.current.addSource("routes", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: routes.map((route) => ({
            type: "Feature",
            properties: {
              id: route.id,
              name: route.name,
              description: route.description,
            },
            geometry: { type: "LineString", coordinates: route.coordinates },
          })),
        },
      });
      // Destinations layer
      map.current.addLayer({
        id: "destinations-layer",
        type: "circle",
        source: "destinations",
        paint: {
          "circle-radius": 8,
          "circle-color": [
            "match",
            ["get", "type"],
            "Nature",
            "#fbb040",
            "Culture",
            "#e45325",
            "Adventure",
            "#e76f51",
            "Retreat",
            "#2a9d8f",
            "#666666",
          ],
          "circle-opacity": 0.8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });
      // Labels
      map.current.addLayer({
        id: "destination-labels",
        type: "symbol",
        source: "destinations",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1.5],
          "text-anchor": "top",
          "text-size": 12,
        },
        paint: {
          "text-color": "#333",
          "text-halo-color": "#fff",
          "text-halo-width": 1,
        },
      });
      // Routes
      map.current.addLayer({
        id: "routes-layer",
        type: "line",
        source: "routes",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#3887be",
          "line-width": 3,
          "line-dasharray": [2, 1],
          "line-opacity": 0.7,
        },
      });

      // Events: mouse enter/leave/click
      map.current.on("mouseenter", "destinations-layer", (e) => {
        if (!map.current || !popup.current || !e.features || e.features.length === 0) return;
        map.current.getCanvas().style.cursor = "pointer";
        const feature = e.features[0];
        const props = feature.properties;
        if (!props) return;
        const coordinates =
          feature.geometry.type === "Point"
            ? (feature.geometry as any).coordinates.slice()
            : [0, 0];
        const type = props.type as DestinationType;
        const color = getDestinationColor(type);
        const html = `
          <div class="p-2">
            <h3 class="font-bold text-base mb-1">${props.name}</h3>
            <div class="mb-1">
              <span style="background-color: ${color}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">
                ${props.type}
              </span>
            </div>
            <p class="text-sm text-gray-700 mb-2">${props.description}</p>
          </div>
        `;
        popup.current.setLngLat(coordinates).setHTML(html).addTo(map.current);
      });
      map.current.on("mouseleave", "destinations-layer", () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "";
        if (popup.current) popup.current.remove();
      });
      map.current.on("click", "destinations-layer", (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const props = feature.properties;
        if (!props) return;
        const destId = props.id;
        const dest = destinations.find((d) => d.id === destId);
        if (dest) onDestinationClick(dest);
      });
      map.current.on("click", "routes-layer", (e) => {
        if (!map.current || !popup.current || !e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const props = feature.properties;
        if (!props) return;
        const coordinates = e.lngLat;
        const html = `
          <div class="p-2">
            <h3 class="font-bold text-base mb-1">${props.name}</h3>
            <p class="text-sm text-gray-700">${props.description}</p>
          </div>
        `;
        popup.current.setLngLat(coordinates).setHTML(html).addTo(map.current);
      });
    });
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Only runs on mount

  // Filtering/fitting
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    let filterExpr: any[] = ["all"];
    if (viewMode === "country" && filter !== "all") {
      filterExpr.push(["==", ["get", "country"], filter]);
    } else if (viewMode === "theme" && filter !== "all") {
      filterExpr.push(["==", ["get", "type"], filter]);
    }
    map.current.setFilter("destinations-layer", filterExpr);
    map.current.setFilter("destination-labels", filterExpr);
    // Fit to bounds
    if (viewMode === "country" && filter !== "all") {
      const countryDests = destinations.filter((d) => d.country === filter);
      if (countryDests.length > 0) {
        const coords = countryDests.map((d) => d.coordinates);
        const lngList = coords.map((c) => c[0]);
        const latList = coords.map((c) => c[1]);
        const sw = [Math.min(...lngList) - 2, Math.min(...latList) - 2];
        const ne = [Math.max(...lngList) + 2, Math.max(...latList) + 2];
        map.current.fitBounds([sw, ne] as mapboxgl.LngLatBoundsLike, { padding: 50, duration: 1000 });
      }
    } else if (filter === "all") {
      map.current.flyTo({ center: [25, -15], zoom: 3.5, duration: 1000 });
    }
  }, [viewMode, filter, destinations]);

  return <div ref={mapContainer} className="h-[500px] w-full"></div>;
};

export default RegionalMapDisplay;
