-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "cookTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "prepTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "servings" INTEGER NOT NULL DEFAULT 0;
