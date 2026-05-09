import { PrismaClient, TaskStatus, TaskPriority, Plan } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding task-saas...");

  await prisma.activityLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.inviteToken.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  const users = [];
  const names = ["Alice Martin", "Bob Chen", "Charlie Dubois"];
  const emails = ["alice@example.com", "bob@example.com", "charlie@example.com"];

  for (let i = 0; i < 3; i++) {
    const hash = await bcrypt.hash("password123", 12);
    const user = await prisma.user.create({ data: { name: names[i], email: emails[i], passwordHash: hash, emailVerified: new Date() } });
    users.push(user);
  }

  const workspace = await prisma.workspace.create({
    data: { name: "Acme Team", slug: "acme-team", ownerId: users[0].id, plan: Plan.PRO },
  });

  for (const user of users) {
    await prisma.workspaceMember.create({ data: { workspaceId: workspace.id, userId: user.id, role: user.id === users[0].id ? "OWNER" : "MEMBER" } });
  }

  const projects = [];
  const projectData = [
    { name: "Website Redesign", color: "#3B82F6", icon: "globe" },
    { name: "Mobile App", color: "#8B5CF6", icon: "smartphone" },
    { name: "Marketing Campaign", color: "#F59E0B", icon: "megaphone" },
  ];

  for (const p of projectData) {
    const proj = await prisma.project.create({ data: { ...p, workspaceId: workspace.id } });
    projects.push(proj);
  }

  const taskTitles = [
    "Design homepage mockup", "Implement auth flow", "Set up CI/CD pipeline",
    "Write API documentation", "Create landing page", "Fix navigation bug",
    "Add dark mode support", "Optimize database queries", "Implement search",
    "Design onboarding flow", "Set up analytics", "Create email templates",
    "Build notification system", "Implement file upload", "Add export feature",
    "Design settings page", "Implement billing", "Create admin dashboard",
    "Write unit tests", "Performance audit",
    "SEO optimization", "Social media integration", "Push notifications",
    "Offline mode support", "Multi-language support",
    "User feedback system", "A/B testing setup", "API rate limiting",
    "Data migration script", "Security audit",
  ];

  const statuses: TaskStatus[] = ["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"];
  const priorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

  for (let i = 0; i < 30; i++) {
    await prisma.task.create({
      data: {
        title: taskTitles[i],
        description: `Task description for ${taskTitles[i]}`,
        projectId: projects[i % 3].id,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        assigneeId: users[Math.floor(Math.random() * users.length)].id,
        createdBy: users[0].id,
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        position: i,
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log("Login: alice@example.com / password123");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
