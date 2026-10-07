import React, { useState } from 'react';
import { Building2, Layers, MapPin, ChevronDown, ChevronRight, Phone, ShieldCheck } from 'lucide-react';

export default function JurisdictionExplorer({ wards = [] }) {
  const [expandedZone, setExpandedZone] = useState('Zone E (Bhosari-Charholi-Dighi)');
  const [selectedWard, setSelectedWard] = useState(wards[0] || null);

  // Group wards by zone within Bhosari Constituency
  const zones = wards.reduce((acc, ward) => {
    const zoneName = ward.zone || 'Zone E (Bhosari-Charholi-Dighi)';
    if (!acc[zoneName]) acc[zoneName] = [];
    acc[zoneName].push(ward);
    return acc;
  }, {});

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="text-amber-400 w-5 h-5" />
            <h3 className="text-base font-black text-white">Bhosari Constituency (AC 207) • PCMC Territorial Divisions</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pimpri-Chinchwad Municipal Corporation • Zonal Prabhags, Industrial MIDC & Localities
          </p>
        </div>
        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-mono font-bold border border-amber-500/30">
          AC 207 • 3 PCMC Zones • {wards.length} Wards • 26 Localities
        </span>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Left Side: Zonal & Ward Tree Explorer */}
        <div className="md:col-span-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" /> PCMC Administrative Hierarchy
          </h4>

          <div className="space-y-2">
            {Object.keys(zones).map((zoneName) => {
              const isZoneOpen = expandedZone === zoneName;
              return (
                <div key={zoneName} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedZone(isZoneOpen ? null : zoneName)}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-800/80 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🗺️</span>
                      <span className="text-xs font-bold text-white">{zoneName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                        {zones[zoneName].length} Wards
                      </span>
                      {isZoneOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {isZoneOpen && (
                    <div className="p-2 space-y-1.5 bg-slate-950/40 border-t border-slate-800">
                      {zones[zoneName].map((w) => {
                        const isSelected = (selectedWard?.wardId || selectedWard?.wardName) === (w.wardId || w.wardName);
                        return (
                          <div
                            key={w.wardId}
                            onClick={() => setSelectedWard(w)}
                            className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition ${
                              isSelected
                                ? 'bg-amber-500/20 border border-amber-500 text-white'
                                : 'hover:bg-slate-800/60 border border-transparent text-slate-300'
                            }`}
                          >
                            <div>
                              <p className="text-xs font-bold">{w.wardName}</p>
                              <p className="text-[10px] text-slate-400">{w.localitiesCovered?.length || 5} Covered Localities</p>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">
                              WCPI: {w.wcpiScore}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Locality & Territorial Breakdown Card */}
        <div className="md:col-span-7">
          {selectedWard ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-5">
              <div className="flex justify-between items-start border-b border-slate-700/60 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider bg-amber-900/50 px-2 py-0.5 rounded">
                    {selectedWard.zone} • {selectedWard.wardId}
                  </span>
                  <h4 className="text-base font-black text-white mt-1">{selectedWard.wardName}</h4>
                  <p className="text-xs text-slate-400">Assistant Commissioner: <span className="text-slate-200 font-semibold">{selectedWard.assistantCommissioner}</span></p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black font-mono text-emerald-400">{selectedWard.wcpiScore}</span>
                  <span className="text-[10px] text-slate-500 block">WCPI Score</span>
                </div>
              </div>

              {/* Geographic Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Covered Area</span>
                  <span className="font-bold text-white font-mono">{selectedWard.areaSqKm || 18.5} km²</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Population</span>
                  <span className="font-bold text-white font-mono">{(selectedWard.population || 140000).toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Active Complaints</span>
                  <span className="font-bold text-rose-400 font-mono">{selectedWard.totalReported - selectedWard.totalResolved} Open</span>
                </div>
              </div>

              {/* Localities / Prabhags Covered in Bhosari */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="text-rose-400 w-3.5 h-3.5" /> Covered Localities & Sectors in Bhosari AC 207
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedWard.localitiesCovered && selectedWard.localitiesCovered.map((loc, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-900 text-slate-200 border border-slate-700/80 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium"
                    >
                      <span className="text-[9px] text-amber-400">●</span> {loc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Critical Landmarks & Assets in Bhosari */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="text-emerald-400 w-3.5 h-3.5" /> Key Civic Assets & Landmarks
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedWard.keyLandmarks && selectedWard.keyLandmarks.map((lm, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 px-2.5 py-1 rounded-lg"
                    >
                      🏛️ {lm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Emergency Contact & PCMC Ward Office */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="text-slate-400 text-[10px]">PCMC Zonal Office Address:</p>
                  <p className="text-slate-200 font-medium">{selectedWard.officeAddress}</p>
                </div>
                <a
                  href={`tel:${selectedWard.emergencyHelpline}`}
                  className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 px-3 py-1.5 rounded-lg font-mono text-[11px] flex items-center gap-1 font-bold transition"
                >
                  <Phone className="w-3 h-3" /> {selectedWard.emergencyHelpline}
                </a>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              Select a ward from the Bhosari tree on the left to view covered localities.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}