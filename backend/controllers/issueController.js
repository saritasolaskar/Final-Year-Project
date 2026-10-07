import Issue from '../models/Issue.js';
import User from '../models/User.js';
import Ward from '../models/Ward.js';
import { PCMCAIService } from '../services/aiService.js';

export const getIssues = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'citizen') {
      filter = { reportedBy: req.user.id };
    } else if (req.user.role === 'worker') {
      filter = { assignedWorkerEmail: req.user.email };
    } else if (req.user.role === 'ward_officer') {
      filter = { ward: req.user.ward };
    }

    const issues = await Issue.find(filter).sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createIssue = async (req, res) => {
  try {
    const { latitude, longitude, locationName, citizenNotes, imageBase64OrUrl } = req.body;
    const lat = Number(latitude) || 18.6298;
    const lng = Number(longitude) || 73.8477;

    const ai = PCMCAIService.analyzeImage();

    // Native MongoDB Geospatial Duplicate Query ($near within 40m)
    const existingDuplicate = await Issue.findOne({
      category: ai.category,
      ward: req.user.ward || 'Prabhag 01 - Bhosari Gaothan / Landewadi',
      status: { $nin: ['Closed', 'Rejected'] },
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: 40,
        },
      },
    });

    if (existingDuplicate) {
      existingDuplicate.duplicateCount += 1;
      existingDuplicate.priorityScore = PCMCAIService.computePriorityScore(
        existingDuplicate.severity,
        existingDuplicate.duplicateCount
      );
      await existingDuplicate.save();
      return res.status(200).json(existingDuplicate);
    }

    const priorityScore = PCMCAIService.computePriorityScore(ai.severity, 1);
    const newIssue = await Issue.create({
      id: `BHO-${Math.floor(1000 + Math.random() * 9000)}`,
      reportedBy: req.user.id,
      category: ai.category,
      department: ai.department,
      aiConfidence: ai.confidence,
      severity: ai.severity,
      priorityScore,
      constituency: 'Bhosari (AC 207)',
      ward: req.user.ward || 'Prabhag 01 - Bhosari Gaothan / Landewadi',
      locationName: locationName || 'Spine Road, Bhosari, PCMC',
      latitude: lat,
      longitude: lng,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      beforeImageUrl: imageBase64OrUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      citizenNotes: citizenNotes || '',
      isUnderContractorWarranty: ai.category.includes('Pothole') && Math.random() > 0.5,
    });

    await Ward.findOneAndUpdate({ wardName: newIssue.ward }, { $inc: { totalReported: 1 } });
    res.status(201).json(newIssue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const assignIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { workerEmail, workerName, workerPhone, slaTargetHours, specialInstructions } = req.body;

    const issue = await Issue.findOne({ id });
    if (!issue) return res.status(404).json({ message: 'Complaint not found in MongoDB' });

    if (issue.assignedWorkerEmail && issue.assignedWorkerEmail !== workerEmail) {
      await User.findOneAndUpdate({ email: issue.assignedWorkerEmail }, { $inc: { activeTasksCount: -1 } });
    }

    await User.findOneAndUpdate({ email: workerEmail }, { $inc: { activeTasksCount: 1 } });

    issue.status = 'Assigned';
    issue.assignedWorkerName = workerName;
    issue.assignedWorkerEmail = workerEmail;
    issue.assignedWorkerPhone = workerPhone || '+91 98220 54321';
    issue.slaTargetHours = slaTargetHours || 24;
    issue.specialInstructions = specialInstructions || 'Follow PCMC standard repair protocol.';
    issue.assignedAt = new Date();

    await issue.save();
    res.json({ message: 'Task successfully assigned to worker and saved in MongoDB', issue });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, afterImageUrl, blockerReason, rejectionReason, citizenRating, citizenFeedback } = req.body;

    const issue = await Issue.findOne({ id });
    if (!issue) return res.status(404).json({ message: 'Issue not found in MongoDB' });

    if (status) issue.status = status;
    if (blockerReason) issue.blockerReason = blockerReason;
    if (rejectionReason) issue.rejectionReason = rejectionReason;
    if (citizenRating) issue.citizenRating = citizenRating;
    if (citizenFeedback) issue.citizenFeedback = citizenFeedback;

    if (afterImageUrl) {
      issue.afterImageUrl = afterImageUrl;
      issue.aiVerificationScore = parseFloat((Math.random() * (98.0 - 92.0) + 92.0).toFixed(1));
      issue.status = 'Verification-Pending';
    }

    if (status === 'Closed') {
      if (issue.assignedWorkerEmail) {
        await User.findOneAndUpdate({ email: issue.assignedWorkerEmail }, { $inc: { activeTasksCount: -1 } });
      }
      await Ward.findOneAndUpdate({ wardName: issue.ward }, { $inc: { totalResolved: 1 } });
    }

    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const upvoteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findOne({ id });
    if (!issue) return res.status(404).json({ message: 'Issue not found in MongoDB' });

    issue.duplicateCount += 1;
    issue.priorityScore = PCMCAIService.computePriorityScore(issue.severity, issue.duplicateCount);
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
