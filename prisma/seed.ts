const fs = require("fs").promises;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Function to read names from a text file and insert them into a table
async function populateTableFromFile(filePath: string, modelName: string) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const uniqueNames = new Set(
      data.split("\n").filter((line: string) => line.trim() !== "")
    );
    const uniqueArray: string[] = Array.from(uniqueNames) as string[];

    // Insert names into the respective table
    for (const name of uniqueArray) {
      switch (modelName) {
        case "Category":
          await prisma.category.create({ data: { name } });
          break;
        case "Organization":
          await prisma.organization.create({ data: { name } });
          break;
        case "Topic":
          await prisma.topic.create({ data: { name } });
          break;
        default:
          throw new Error(`Unknown model: ${modelName}`);
      }
    }

    console.log(`Populated ${modelName} table.`);
  } catch (error) {
    console.error(`Error populating ${modelName} table:`, error);
  }
}

async function seedStudies() {
  try {
    const data = await fs.readFile("scripts/data.json", "utf8");
    const studies = JSON.parse(data);

    for (const study of studies) {
      const createdStudy = await prisma.study.create({
        data: {
          title: study.title,
          issued_year: study["issued-year"],
          web_link: study["web-link"],
          download_link: study["download-link"] || null,
          organization: study.organization
            ? {
                connectOrCreate: {
                  where: { name: study.organization },
                  create: { name: study.organization },
                },
              }
            : undefined,
          topic: {
            connectOrCreate: {
              where: { name: study.topic },
              create: { name: study.topic },
            },
          },
          status: study.status.toLowerCase(),
          open_for_comment: study["open-for-comment"] === true,
          summary: study.summary,
          assigned_score: study["Assigned Score"],
        },
      });

      // Handle "Assigned Categories"
      for (const categoryName of study["Assigned Categories"]) {
        const category = await prisma.category.findUnique({
          where: { name: categoryName },
        });

        const existingRelation = await prisma.studiesCategories.findFirst({
          where: {
            studies_id: createdStudy.id,
            category_id: category.id,
          },
        });

        if (!existingRelation) {
          await prisma.studiesCategories.create({
            data: {
              study: {
                connect: { id: createdStudy.id },
              },
              category: {
                connect: { id: category.id },
              },
            },
          });
        }
      }

      // Handle "Assigned Topics"
      for (const topicName of study["Assigned Topics"]) {
        const topic = await prisma.topic.findUnique({
          where: { name: topicName },
        });
        const existingRelation = await prisma.studiesTopics.findFirst({
          where: {
            studies_id: createdStudy.id,
            topic_id: topic.id,
          },
        });

        if (!existingRelation) {
          await prisma.studiesTopics.create({
            data: {
              study: {
                connect: { id: createdStudy.id },
              },
              topic: {
                connect: { id: topic.id },
              },
            },
          });
        }
      }

      // Handle "Assigned Sub Topics"
      for (const subTopicName of study["Assigned Sub Topics"]) {
        const subtopic = await prisma.topic.findUnique({
          where: { name: subTopicName },
        });

        const existingRelation = await prisma.studiesSubTopics.findFirst({
          where: {
            studies_id: createdStudy.id,
            subtopic_id: subtopic.id,
          },
        });

        if (!existingRelation) {
          await prisma.studiesSubTopics.create({
            data: {
              study: {
                connect: { id: createdStudy.id },
              },
              subtopic: {
                connect: { id: subtopic.id },
              },
            },
          });
        }
      }
    }
    console.log("Seeded studies.");
  } catch (error) {
    console.error("Error seeding studies:", error);
  }
}

async function main() {
  await populateTableFromFile("scripts/output/categories.txt", "Category");
  await populateTableFromFile(
    "scripts/output/organizations.txt",
    "Organization"
  );
  await populateTableFromFile("scripts/output/topics.txt", "Topic");
  await seedStudies();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
