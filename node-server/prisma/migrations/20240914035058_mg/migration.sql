-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option" (
    "id" SERIAL NOT NULL,
    "imageId" INTEGER NOT NULL,
    "F1" BOOLEAN NOT NULL DEFAULT false,
    "F2" BOOLEAN NOT NULL DEFAULT false,
    "F3" BOOLEAN NOT NULL DEFAULT false,
    "F4" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
