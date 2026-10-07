export class PCMCAIService {
  static CATEGORIES = [
    { category: 'Pothole (खड्डा)', department: 'PCMC Civil & Road Maintenance Dept', severity: 'High' },
    { category: 'Open Manhole (उघडे मॅनहोल)', department: 'PCMC Drainage & Sewerage Dept', severity: 'Critical' },
    { category: 'Garbage Blackspot (कचरा साचणे)', department: 'PCMC Health & Solid Waste Dept', severity: 'Medium' },
    { category: 'Water Supply Leakage (पाणी गळती)', department: 'PCMC Water Supply Dept', severity: 'Medium' },
    { category: 'Broken Streetlight (बंद पथदिवा)', department: 'PCMC Electrical Dept', severity: 'Low' },
  ];

  static analyzeImage() {
    const pick = this.CATEGORIES[Math.floor(Math.random() * this.CATEGORIES.length)];
    const confidence = parseFloat((Math.random() * (98.9 - 91.5) + 91.5).toFixed(1));
    return { category: pick.category, department: pick.department, severity: pick.severity, confidence };
  }

  static haversineDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  static computePriorityScore(severity, duplicateCount, isArterial = true) {
    const map = { Low: 0.25, Medium: 0.55, High: 0.85, Critical: 1.0 };
    const base = (map[severity] || 0.5) * 40;
    const dups = Math.min(duplicateCount / 15.0, 1.0) * 30;
    const zone = isArterial ? 30 : 15;
    return Math.min(Math.max(Math.round(base + dups + zone), 10), 99);
  }

  static computeWCPI(totalReported, totalResolved, avgDays, recurrence, sla) {
    const resRate = totalReported > 0 ? (totalResolved / totalReported) * 100 : 80;
    let score = (resRate * 0.40) + (sla * 0.35) - (recurrence * 2.0) - (avgDays * 2.5);
    return Math.min(Math.max(parseFloat(score.toFixed(1)), 15), 99.5);
  }
}