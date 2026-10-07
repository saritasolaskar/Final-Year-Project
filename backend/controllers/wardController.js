import Ward from '../models/Ward.js';
import { PCMCAIService } from '../services/aiService.js';

export const getWardAnalytics = async (req, res) => {
  try {
    const wards = await Ward.find({ constituency: 'Bhosari (AC 207)' });
    const scoredWards = wards.map((w) => {
      const liveScore = PCMCAIService.computeWCPI(
        w.totalReported,
        w.totalResolved,
        w.avgResolutionDays,
        w.recurrenceRate,
        w.slaComplianceRate
      );
      return { ...w.toObject(), wcpiScore: liveScore };
    });

    scoredWards.sort((a, b) => b.wcpiScore - a.wcpiScore);
    res.json(scoredWards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getJurisdictionHierarchy = async (req, res) => {
  try {
    const wards = await Ward.find({ constituency: 'Bhosari (AC 207)' });
    const hierarchy = {
      corporationName: 'Pimpri-Chinchwad Municipal Corporation (PCMC)',
      constituencyName: 'Bhosari Assembly Constituency (AC 207)',
      headquarters: 'PCMC Main Building, Pimpri / Zone E Office, Bhosari',
      helpline: '1800 1030 222 / 020-67333333 (PCMC Smart Sarathi)',
      totalZones: 3,
      totalWards: wards.length,
      zones: {},
    };

    wards.forEach((w) => {
      if (!hierarchy.zones[w.zone]) {
        hierarchy.zones[w.zone] = {
          zoneName: w.zone,
          wards: [],
        };
      }
      hierarchy.zones[w.zone].wards.push(w);
    });

    res.json(hierarchy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};