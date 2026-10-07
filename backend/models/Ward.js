import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema({
  wardId: { type: String, required: true, unique: true, index: true },
  wardName: { type: String, required: true },
  corporation: { type: String, default: 'Pimpri-Chinchwad Municipal Corporation (PCMC)' },
  constituency: { type: String, default: 'Bhosari (AC 207)' },
  zone: { type: String, required: true },
  assistantCommissioner: { type: String, required: true },
  population: { type: Number, default: 110000 },
  areaSqKm: { type: Number, default: 16.5 },
  officeAddress: { type: String, default: 'PCMC Zone Office, Bhosari, Pune' },
  emergencyHelpline: { type: String, default: '020-28333333' },
  localitiesCovered: [{ type: String }],
  keyLandmarks: [{ type: String }],
  totalReported: { type: Number, default: 0 },
  totalResolved: { type: Number, default: 0 },
  avgResolutionDays: { type: Number, default: 2.1 },
  recurrenceRate: { type: Number, default: 3.2 },
  slaComplianceRate: { type: Number, default: 89.0 },
  wcpiScore: { type: Number, default: 86.5 },
  aiDiagnostic: { type: String, default: 'Nominal municipal operations in Bhosari sector.' },
}, { timestamps: true });

export default mongoose.model('Ward', wardSchema);