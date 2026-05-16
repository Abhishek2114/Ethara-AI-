const prisma = require("../../core/database/prisma");

async function generateInsights() {
  // Simulate AI generation by aggregating stats and generating mock insights
  // In a real scenario, this could hit Gemini or OpenAI

  const projects = await prisma.project.findMany({
    include: {
      workItems: true
    }
  });

  const insights = [];
  
  for (const project of projects) {
    const totalItems = project.workItems.length;
    const completedItems = project.workItems.filter(item => item.status === "COMPLETED").length;
    
    let type = "VELOCITY";
    let title = "Velocity looks good";
    let description = "Project is tracking well against timelines.";
    let score = 85;

    if (totalItems > 0 && completedItems / totalItems < 0.3) {
      type = "RISK";
      title = "Delivery Risk Detected";
      description = "Completion rate is below 30%. Potential bottleneck.";
      score = 45;
    } else if (totalItems === 0) {
      type = "BOTTLENECK";
      title = "No Work Items";
      description = "Project has no assigned tasks. Please allocate resources.";
      score = 10;
    }

    const insight = await prisma.aiInsight.create({
      data: {
        type,
        title,
        description,
        score,
        projectId: project.id
      }
    });
    
    insights.push(insight);
  }

  // Generate generic team insight
  const genericInsight = await prisma.aiInsight.create({
    data: {
      type: "PRODUCTIVITY",
      title: "Team velocity increased 14% this week",
      description: "Based on historical data, the team is performing above average.",
      score: 92
    }
  });

  insights.push(genericInsight);

  return insights;
}

async function getInsights() {
  const insights = await prisma.aiInsight.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 10,
    include: {
      project: true
    }
  });

  // If no insights exist, generate them
  if (insights.length === 0) {
    return generateInsights();
  }

  return insights;
}

module.exports = {
  generateInsights,
  getInsights
};
