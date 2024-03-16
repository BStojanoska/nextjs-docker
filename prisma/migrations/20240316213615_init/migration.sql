-- CreateEnum
CREATE TYPE "Status" AS ENUM ('final', 'draft');

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Study" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "issued_year" INTEGER,
    "web_link" TEXT NOT NULL,
    "download_link" TEXT,
    "organization_id" INTEGER,
    "topic_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'final',
    "open_for_comment" BOOLEAN NOT NULL DEFAULT false,
    "summary" TEXT,
    "assigned_score" INTEGER,

    CONSTRAINT "Study_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudiesCategories" (
    "studies_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "StudiesCategories_pkey" PRIMARY KEY ("studies_id","category_id")
);

-- CreateTable
CREATE TABLE "StudiesTopics" (
    "studies_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,

    CONSTRAINT "StudiesTopics_pkey" PRIMARY KEY ("studies_id","topic_id")
);

-- CreateTable
CREATE TABLE "StudiesSubTopics" (
    "studies_id" INTEGER NOT NULL,
    "subtopic_id" INTEGER NOT NULL,

    CONSTRAINT "StudiesSubTopics_pkey" PRIMARY KEY ("studies_id","subtopic_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Study" ADD CONSTRAINT "Study_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Study" ADD CONSTRAINT "Study_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudiesCategories" ADD CONSTRAINT "StudiesCategories_studies_id_fkey" FOREIGN KEY ("studies_id") REFERENCES "Study"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudiesCategories" ADD CONSTRAINT "StudiesCategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudiesTopics" ADD CONSTRAINT "StudiesTopics_studies_id_fkey" FOREIGN KEY ("studies_id") REFERENCES "Study"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudiesTopics" ADD CONSTRAINT "StudiesTopics_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudiesSubTopics" ADD CONSTRAINT "StudiesSubTopics_studies_id_fkey" FOREIGN KEY ("studies_id") REFERENCES "Study"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudiesSubTopics" ADD CONSTRAINT "StudiesSubTopics_subtopic_id_fkey" FOREIGN KEY ("subtopic_id") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
