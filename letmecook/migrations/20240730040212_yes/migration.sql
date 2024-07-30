/*
  Warnings:

  - You are about to drop the column `vote` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `downvote` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upvote` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "vote",
ADD COLUMN     "downvote" BOOLEAN NOT NULL,
ADD COLUMN     "upvote" BOOLEAN NOT NULL;
