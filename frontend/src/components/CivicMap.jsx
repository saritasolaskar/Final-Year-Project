import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Bhosari AC 207 & Spine Road Center Coordinates: Lat 18.6298, Lng 73.8477
export default function CivicMap({ issues = [], center = [18.6298, 73.8477], zoom = 13 }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      scrollWheelZoom: false,
    });
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; PCMC Bhosari AC 207 | OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // Plot Bhosari Incident Pins
    issues.forEach((issue) => {
      const lat = issue.latitude || center[0];
      const lng = issue.longitude || center[1];
      const color =
        issue.priorityScore >= 90 ? '#f43f5e' : issue.priorityScore >= 70 ? '#f59e0b' : '#3b82f6';

      const customIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; color: #0f172a; min-width: 155px;">
          <b style="font-size: 12px; display: block; margin-bottom: 2px;">${issue.category || 'Civic Issue'}</b>
          <span style="font-size: 10px; color: #64748b; display: block;">📍 ${issue.locationName || 'Bhosari Sector'}</span>
          <div style="margin-top: 6px; font-size: 10px; font-weight: bold; display: flex; justify-content: space-between;">
            <span style="color: ${color}; font-family: monospace;">AI Priority: ${issue.priorityScore || 50}/100</span>
            <span style="background: #e2e8f0; padding: 1px 5px; border-radius: 4px;">${issue.status || 'Reported'}</span>
          </div>
        </div>
      `;

      L.marker([lat, lng], { icon: customIcon }).addTo(map).bindPopup(popupHtml);

      if (issue.priorityScore >= 90) {
        L.circle([lat, lng], {
          color: '#f43f5e',
          fillColor: '#f43f5e',
          fillOpacity: 0.18,
          radius: 250,
          weight: 1,
        }).addTo(map);
      }
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [issues, center, zoom]);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative z-0">
      <div
        ref={mapContainerRef}
        style={{ height: '340px', width: '100%' }}
        className="bg-slate-900"
      />
    </div>
  );
}