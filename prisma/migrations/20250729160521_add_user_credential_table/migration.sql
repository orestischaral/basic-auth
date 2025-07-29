-- CreateTable
CREATE TABLE "api_private"."UserCredential" (
    "userId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCredential_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "api_private"."UserCredential" ADD CONSTRAINT "UserCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
