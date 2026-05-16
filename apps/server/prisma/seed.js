const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const PROJECT_CODES = [
  { code: "260209-omni-elo-without", category: "Non Stem" },
  { code: "260209-omni-elo-with", category: "Stem" },
  { code: "260209-omni-elo-without-2", category: "Evals" },
  { code: "260209-omni-elo-without-3", category: null },
  { code: "260209-omni-elo-without-4", category: "Non Stem" },
  { code: "260209-omni-elo-without-5", category: "Evals" },
];

const TASKER_NAMES = [
  "Rahul Verma", "Sneha Patel", "Vikram Rao", "Ananya Iyer",
  "Karan Mehta", "Divya Nair", "Arjun Das", "Meera Joshi", "Rohan Kapoor",
];

async function main() {
  const hash = await bcrypt.hash("Admin123!", 12);
  const memberHash = await bcrypt.hash("Member123!", 12);

  const pl = await prisma.user.upsert({
    where: { email: "piyush.tomar@ethara.ai" },
    update: {},
    create: {
      email: "piyush.tomar@ethara.ai",
      passwordHash: hash,
      name: "Piyush Singh Tomar",
      role: "PROJECT_LEAD",
      jobTitle: "Project Lead",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=PT",
    },
  });

  const reviewer = await prisma.user.upsert({
    where: { email: "abhishek.singh23@ethara.ai" },
    update: { reportingToId: pl.id },
    create: {
      email: "abhishek.singh23@ethara.ai",
      passwordHash: hash,
      name: "Abhishek Singh",
      role: "QUALITY_REVIEWER",
      jobTitle: "Quality Reviewer",
      reportingToId: pl.id,
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AS",
    },
  });

  await prisma.activity.deleteMany({});
  await prisma.workItem.deleteMany({});
  await prisma.projectAllocation.deleteMany({});
  await prisma.projectFlag.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.leaveRequest.deleteMany({});
  await prisma.notification.deleteMany({});

  const taskers = [];
  for (let i = 0; i < TASKER_NAMES.length; i++) {
    const email = `tasker${i + 1}@ethara.ai`;
    const t = await prisma.user.upsert({
      where: { email },
      update: { qualityReviewerId: reviewer.id, reportingToId: pl.id },
      create: {
        email,
        passwordHash: memberHash,
        name: TASKER_NAMES[i],
        role: "TASKER",
        jobTitle: "ILM Intern",
        qualityReviewerId: reviewer.id,
        reportingToId: pl.id,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${i}`,
      },
    });
    taskers.push(t);
  }

  const projects = [];
  for (const p of PROJECT_CODES) {
    const project = await prisma.project.create({
      data: {
        code: p.code,
        platform: "Multimango",
        category: p.category,
        lifecycle: "LIVE",
        allocationStatus: "ALLOCATED",
      },
    });
    projects.push(project);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < taskers.length; i++) {
    const proj = projects[i % projects.length];
    await prisma.projectAllocation.create({
      data: { projectId: proj.id, userId: taskers[i].id },
    });

    const status = i % 3 === 0 ? "ABSENT" : i % 2 === 0 ? "PRESENT" : "IDLE";
    await prisma.attendance.create({
      data: { userId: taskers[i].id, date: today, status },
    });

    const total = 12 + i * 2;
    const completed = Math.floor(total * 0.85);
    for (let j = 0; j < total; j++) {
      const done = j < completed;
      const needsReview = done && j >= completed - 3;
      await prisma.workItem.create({
        data: {
          title: `${proj.code} — batch ${j + 1}`,
          userId: taskers[i].id,
          projectId: proj.id,
          status: done ? "COMPLETED" : j === completed ? "BLOCKED" : "PENDING",
          qualityScore: done && !needsReview ? 0.85 + Math.random() * 0.1 : null,
          handleTimeMinutes: done ? 4 + (j % 3) * 2 : null,
          completedAt: done ? new Date(Date.now() - j * 3600000) : null,
        },
      });
    }
  }

  for (let i = 0; i < 20; i++) {
    await prisma.project.create({
      data: {
        code: `260209-extra-${i}`,
        platform: "Multimango",
        category: i % 2 === 0 ? "Evals" : "Non Stem",
        lifecycle: "LIVE",
        allocationStatus: "ALLOCATED",
        allocations: {
          create: [{ userId: taskers[i % taskers.length].id }],
        },
      },
    });
  }

  for (let i = 0; i < 3; i++) {
    await prisma.leaveRequest.create({
      data: {
        userId: taskers[i].id,
        startDate: new Date(Date.now() + (i + 3) * 86400000),
        endDate: new Date(Date.now() + (i + 5) * 86400000),
        reason: ["Personal", "Medical", "Family"][i],
        status: "PENDING",
      },
    });
  }

  await prisma.activity.createMany({
    data: [
      { type: "CHECK_IN", message: `${taskers[1].name} checked in`, actorId: taskers[1].id },
      { type: "LEAVE_REQUESTED", message: `${taskers[0].name} requested leave`, actorId: taskers[0].id },
      { type: "PROJECT_FLAGGED", message: `${reviewer.name} flagged ${projects[0].code}`, actorId: reviewer.id, entityId: projects[0].id, entityType: "project" },
      { type: "TASK_REVIEWED", message: `${reviewer.name} scored a task at 95%`, actorId: reviewer.id },
      { type: "WORK_COMPLETED", message: `${taskers[2].name} completed 8 tasks today`, actorId: taskers[2].id },
    ],
  });

  await prisma.projectFlag.create({
    data: { projectId: projects[0].id, userId: reviewer.id, note: "Needs PL review on quality drop" },
  });

  for (let i = 0; i < 9; i++) {
    await prisma.notification.create({
      data: {
        userId: reviewer.id,
        title: "Task review pending",
        message: `Review queue item #${i + 1} awaiting approval`,
        read: i > 2,
      },
    });
  }

  console.log("Task Track seed complete");
  console.log("  Quality Reviewer: abhishek.singh23@ethara.ai / Admin123!");
  console.log("  Project Lead:     piyush.tomar@ethara.ai / Admin123!");
  console.log("  Taskers:          tasker1@ethara.ai … tasker9@ethara.ai / Member123!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
