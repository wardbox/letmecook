/*
  Warnings:

  - You are about to drop the column `status` on the `RecipeComment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RecipeComment" DROP COLUMN "status",
ADD COLUMN     "recipeStatus" TEXT NOT NULL DEFAULT 'pending';
