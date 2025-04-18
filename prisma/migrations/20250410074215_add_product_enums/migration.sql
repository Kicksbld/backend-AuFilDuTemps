-- CreateEnum
CREATE TYPE "Size" AS ENUM ('XS', 'S', 'M', 'L', 'XL');

-- CreateEnum
CREATE TYPE "Color" AS ENUM ('RED', 'BLUE', 'GREEN', 'BLACK', 'WHITE', 'GREY', 'YELLOW', 'PURPLE', 'PINK', 'ORANGE', 'BROWN');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "sizes" "Size"[],
    "description" TEXT NOT NULL,
    "color" "Color" NOT NULL,
    "images" TEXT[],
    "numberOfLikes" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
