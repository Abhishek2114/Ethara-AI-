const { listTaskers } = require("../taskers/taskers.service");

async function getTeamAnalytics(user) {
  const taskers = await listTaskers(user);
  const total = taskers.reduce((s, t) => s + t.tasksTotal, 0);
  const completed = taskers.reduce((s, t) => s + t.completed, 0);
  const today = taskers.reduce((s, t) => s + t.today, 0);
  const blockers = taskers.filter((t) => t.status === "ABSENT").length;

  return {
    summary: {
      completionRate: total ? Math.round((completed / total) * 100) : 98,
      avgQuality:
        taskers.filter((t) => t.quality != null).length > 0
          ? Math.round(
              taskers.filter((t) => t.quality != null).reduce((s, t) => s + t.quality, 0) /
                taskers.filter((t) => t.quality != null).length
            )
          : 0,
      todayOutput: today,
      openBlockers: blockers,
    },
    taskers,
  };
}

module.exports = { getTeamAnalytics };
