// controllers/activityController.js
const ActivityLog = require("../model/activitylogData");
const User = require("../model/userData");

const getLoginSessionsWithDuration = async (req, res) => {
  try {
    const loginLogs = await ActivityLog.find({ action: "login" })
      .populate("user", "name email role")
      .sort({ timestamp: -1 });

    const logoutLogs = await ActivityLog.find({ action: "logout" })
      .sort({ timestamp: -1 });

    const sessions = [];

    for (let login of loginLogs) {
      const correspondingLogout = logoutLogs.find(
        (log) => log.user.toString() === login.user._id.toString() && log.timestamp > login.timestamp
      );

      const duration = correspondingLogout
        ? Math.floor((new Date(correspondingLogout.timestamp) - new Date(login.timestamp)) / 60000)
        : null;

      sessions.push({
        _id: login._id,
        user: login.user,
        login: login.timestamp,
        logout: correspondingLogout?.timestamp || null,
        duration: duration !== null ? `${duration} min` : "Active",
      });
    }

    res.status(200).json(sessions);
  } catch (err) {
    console.error("Error fetching login sessions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getLoginSessionsWithDuration };
