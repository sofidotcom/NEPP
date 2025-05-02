const RecentActivity = require('../model/recentActivityModel');
const mongoose = require('mongoose');

const getRecentActivities = async (req, res) => {
  try {
    const teacherId = new mongoose.Types.ObjectId(req.user.userId);
    console.log('Fetching activities for teacherId:', teacherId);

    const activities = await RecentActivity.aggregate([
      // Match activities for the teacher
      { $match: { teacherId } },
      // Sort by createdAt descending
      { $sort: { createdAt: -1 } },
      // Group by activityType, taking the first document
      {
        $group: {
          _id: '$activityType',
          activity: { $first: '$$ROOT' }
        }
      },
      // Project the desired fields
      {
        $project: {
          _id: '$activity._id',
          activityType: '$activity.activityType',
          description: '$activity.description',
          createdAt: '$activity.createdAt',
          resourceId: '$activity.resourceId'
        }
      },
      // Sort by createdAt
      { $sort: { createdAt: -1 } }
    ]);

    console.log('Fetched activities:', activities);
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Error fetching recent activities', error: error.message });
  }
};

module.exports = { getRecentActivities };