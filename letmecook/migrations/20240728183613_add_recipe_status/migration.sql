-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "adminComment" TEXT DEFAULT '',
ADD COLUMN     "denied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "inReview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pending" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
