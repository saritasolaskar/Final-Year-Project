import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['citizen', 'worker', 'ward_officer', 'commissioner'],
    default: 'citizen',
    index: true,
  },
  ward: { type: String, default: 'Prabhag 01 - Bhosari Gaothan / Landewadi' },
  constituency: { type: String, default: 'Bhosari (AC 207)' },
  department: { type: String, default: 'PCMC Civil & Road Maintenance Dept' },
  phone: { type: String, default: '+91 98220 54321' },
  activeTasksCount: { type: Number, default: 0 },
  maxTaskCapacity: { type: Number, default: 4 },
  shiftStatus: { type: String, enum: ['On Duty', 'On Break', 'Off Duty'], default: 'On Duty' },
  currentLocationName: { type: String, default: 'Bhosari Zone E Office' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);