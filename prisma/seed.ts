const { PrismaClient } = require("@prisma/client");
const { modules, sections } = require("../lib/mockData");

const prisma = new PrismaClient();

async function main() {
  for (const section of sections) {
    const createdSection = await prisma.section.upsert({
      where: { id: section.id },
      update: {
        level: section.level,
        title: section.title,
        description: section.description,
        order: section.order
      },
      create: {
        id: section.id,
        level: section.level,
        title: section.title,
        description: section.description,
        order: section.order
      }
    });

    for (const question of section.finalExam) {
      await prisma.question.upsert({
        where: { id: question.id },
        update: {
          sectionId: createdSection.id,
          kind: question.kind,
          prompt: question.prompt,
          data: question,
          points: question.points
        },
        create: {
          id: question.id,
          sectionId: createdSection.id,
          kind: question.kind,
          prompt: question.prompt,
          data: question,
          points: question.points
        }
      });
    }
  }

  for (const module of modules) {
    const createdModule = await prisma.module.upsert({
      where: { id: module.id },
      update: {
        sectionId: module.sectionId,
        title: module.title,
        description: module.description,
        order: module.order,
        passingScore: module.passingScore,
        status: "PUBLISHED"
      },
      create: {
        id: module.id,
        sectionId: module.sectionId,
        title: module.title,
        description: module.description,
        order: module.order,
        passingScore: module.passingScore,
        status: "PUBLISHED"
      }
    });

    for (const [index, block] of module.content.entries()) {
      await prisma.contentBlock.upsert({
        where: { id: block.id },
        update: {
          moduleId: createdModule.id,
          type: block.type,
          data: block.data,
          order: index
        },
        create: {
          id: block.id,
          moduleId: createdModule.id,
          type: block.type,
          data: block.data,
          order: index
        }
      });
    }

    for (const [index, exercise] of module.practice.entries()) {
      const { id, kind, prompt, ...rest } = exercise;
      await prisma.exercise.upsert({
        where: { id },
        update: {
          moduleId: createdModule.id,
          kind,
          prompt,
          data: rest,
          order: index
        },
        create: {
          id,
          moduleId: createdModule.id,
          kind,
          prompt,
          data: rest,
          order: index
        }
      });
    }

    for (const [index, question] of module.test.entries()) {
      const { id, kind, prompt, points, ...rest } = question;
      await prisma.question.upsert({
        where: { id },
        update: {
          moduleId: createdModule.id,
          kind,
          prompt,
          data: rest,
          points
        },
        create: {
          id,
          moduleId: createdModule.id,
          kind,
          prompt,
          data: rest,
          points
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
