/*
  Warnings:

  - You are about to drop the column `name` on the `Subscription` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('FREE', 'PREMIUM', 'ENTREPRISE');

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "name",
ADD COLUMN     "type" "SubscriptionType" NOT NULL DEFAULT E'FREE';
