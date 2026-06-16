import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "../../styles/map.css";

import L from "leaflet";

import {
  useEffect,
  useState,
} from "react";

import api from "../../services/api";

const conflictIcon =
  L.divIcon({
    html: `
      <div class="pulse-marker">
      </div>
    `,
    className: "",
    iconSize: [20, 20],
  });

export default function IntelligenceMap() {
  const [regions, setRegions] =
    useState([]);

  const [conflicts, setConflicts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchRegions();
    fetchConflicts();
  }, []);

  const fetchRegions =
    async () => {
      try {
        const response =
          await api.get(
            "/regions"
          );

        setRegions(
          response.data
        );
      } catch (error) {
        console.error(error);
      }
    };

  const fetchConflicts =
    async () => {
      try {
        const response =
          await api.get(
            "/conflicts"
          );

        setConflicts(
          response.data
        );
      } catch (error) {
        console.error(error);
      }
    };

  const coordinates = {
    "North America": [40, -100],
    "South America": [-15, -60],
    Europe: [52, 15],
    Africa: [5, 20],
    "Middle East": [30, 45],
    "South Asia": [22, 78],
    "East Asia": [35, 110],
    Oceania: [-25, 135],
  };

  const getColor =
    (score) => {
      if (score >= 70)
        return "#ff3b30";

      if (score >= 45)
        return "#ff9500";

      if (score >= 25)
        return "#ffd60a";

      return "#22c55e";
    };

  const filteredRegions =
    regions.filter(
      (region) =>
        region.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <>
      <input
        type="text"
        placeholder="Search region..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="
        mb-6
        px-4
        py-3
        rounded-xl
        bg-[#0F172A]
        border
        border-cyan-500/20
        text-white
        w-full
        md:w-96
        "
      />

      <div
        className="
        relative
        rounded-3xl
        overflow-hidden
        border
        border-cyan-500/20
        shadow-[0_0_40px_rgba(34,211,238,0.15)]
        "
      >
        <div
          className="
          absolute
          top-6
          right-6
          z-[1000]
          bg-black/40
          backdrop-blur-xl
          border
          border-cyan-500/20
          rounded-2xl
          p-4
          w-72
          "
        >
          <div
            className="
            mt-4
            text-sm
            text-slate-300
            "
          >
            Active Conflicts:
            {" "}
            {conflicts.length}
          </div>

          <div
            className="
            mt-2
            text-sm
            text-slate-300
            "
          >
            Monitored Regions:
            {" "}
            {regions.length}
          </div>
        </div>

        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{
            height: "800px",
            width: "100%",
          }}
        >
          <TileLayer
            url="https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          />

          {filteredRegions.map(
            (region) => (
              <CircleMarker
                key={region._id}
                center={
                  coordinates[
                    region.name
                  ]
                }
                radius={
                  Math.max(
                    8,
                    region.riskScore / 8
                  )
                }
                pathOptions={{
                  color:
                    getColor(
                      region.riskScore
                    ),
                  fillColor:
                    getColor(
                      region.riskScore
                    ),
                  fillOpacity: 0.7,
                  weight: 3,
                }}
              >
                <Popup>
                  <div
                    className="
                    tactical-popup
                    "
                  >
                    <div
                      className="
                      tactical-title
                      "
                    >
                      REGIONAL INTELLIGENCE
                    </div>

                    <h2
                      className="
                      font-bold
                      text-lg
                      "
                    >
                      {region.name}
                    </h2>

                    <p>
                      Risk Score:
                      {" "}
                      {region.riskScore}
                    </p>

                    <p>
                      Active Conflicts:
                      {" "}
                      {region.activeConflicts}
                    </p>

                    <p>
                      News Articles:
                      {" "}
                      {region.newsCount}
                    </p>

                    {region.assessment && (
                      <div
                        className="
                        mt-3
                        border-t
                        border-slate-700
                        pt-3
                        "
                      >
                        <div
                          className="
                          tactical-label
                          "
                        >
                          AI ASSESSMENT
                        </div>

                        <p
                          className="
                          mt-2
                          text-sm
                          "
                        >
                          {
                            region.assessment
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            )
          )}

          {conflicts
            .filter(
              (conflict) =>
                !(
                  conflict.lat ===
                    22 &&
                  conflict.lng ===
                    78
                )
            )
            .map(
              (conflict) => (
                <Marker
                  key={
                    conflict._id
                  }
                  icon={
                    conflictIcon
                  }
                  position={[
                    conflict.lat ||
                      30,
                    conflict.lng ||
                      45,
                  ]}
                >
                  <Popup>
                    <div
                      className="
                      tactical-popup
                      "
                    >
                      <div
                        className="
                        tactical-title
                        "
                      >
                        HOSTILE CONTACT
                      </div>

                      <h2
                        className="
                        font-bold
                        text-lg
                        "
                      >
                        {
                          conflict.name
                        }
                      </h2>

                      <p
                        className="
                        tactical-label
                        "
                      >
                        {
                          conflict.region
                        }
                      </p>

                      <div className="mt-3">
                        <p>
                          Severity:
                          {" "}
                          {
                            conflict.severity
                          }
                        </p>

                        <p>
                          Status:
                          {" "}
                          {
                            conflict.status
                          }
                        </p>
                      </div>

                      <p
                        className="
                        mt-3
                        text-sm
                        "
                      >
                        {
                          conflict.summary
                        }
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )
            )}
        </MapContainer>
      </div>
    </>
  );
}