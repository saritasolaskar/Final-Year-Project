import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true, index: true },
  department: { type: String, default: 'PCMC Civil & Road Maintenance Dept' },
  aiConfidence: { type: Number, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  priorityScore: { type: Number, required: true, index: true },
  constituency: { type: String, default: 'Bhosari (AC 207)' },
  ward: { type: String, required: true, default: 'Prabhag 01 - Bhosari Gaothan / Landewadi', index: true },
  locationName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  // Native MongoDB GeoJSON Point format for 2dsphere spatial queries
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  duplicateCount: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['Reported', 'Assigned', 'In-Progress', 'Verification-Pending', 'Closed', 'Rejected', 'Disputed'],
    default: 'Reported',
    index: true,
  },
  slaTargetHours: { type: Number, default: 48 },
  assignedWorkerName: { type: String, default: 'Unassigned' },
  assignedWorkerEmail: { type: String, default: null },
  assignedWorkerPhone: { type: String, default: null },
  assignedAt: { type: Date, default: null },
  specialInstructions: { type: String, default: '' },
  beforeImageUrl: { type: String, required: true },
  afterImageUrl: { type: String, default: null },
  aiVerificationScore: { type: Number, default: null },
  citizenNotes: { type: String, default: '' },
  blockerReason: { type: String, default: null },
  rejectionReason: { type: String, default: null },
  citizenRating: { type: Number, default: null },
  citizenFeedback: { type: String, default: null },
  isUnderContractorWarranty: { type: Boolean, default: false },
}, { timestamps: true });

// Native 2dsphere spatial index for sub-millisecond distance clustering
issueSchema.index({ location: '2dsphere' });

export default mongoose.model('Issue', issueSchema);