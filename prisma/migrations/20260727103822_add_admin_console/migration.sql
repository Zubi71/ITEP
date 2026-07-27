-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('DRAFT', 'LIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'WRITING', 'SPEAKING');

-- AlterEnum
ALTER TYPE "AttemptStatus" ADD VALUE 'PENDING_REVIEW';

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "gradedAt" TIMESTAMP(3),
ADD COLUMN     "gradedById" TEXT,
ADD COLUMN     "responseText" TEXT,
ADD COLUMN     "subjectiveScorePct" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Attempt" ADD COLUMN     "gradedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "status" "ExamStatus" NOT NULL DEFAULT 'LIVE';

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "lastEditedById" TEXT,
ADD COLUMN     "type" "QuestionType" NOT NULL DEFAULT 'MULTIPLE_CHOICE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_lastEditedById_fkey" FOREIGN KEY ("lastEditedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_gradedById_fkey" FOREIGN KEY ("gradedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
