/*
  Warnings:

  - A unique constraint covering the columns `[userId,moduleId]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,sectionId]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_moduleId_key" ON "Progress"("userId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_sectionId_key" ON "Progress"("userId", "sectionId");
