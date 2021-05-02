import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const findBy = async (userId, productId) => {
  try {
    return prisma.heart.findMany({ where: { userId, productId } });
  } catch (err) {
    console.error(err);
  }
};

export const createBy = async (userId, productId) => {
  try {
    return prisma.heart.createMany({
      data: {
        productId,
        userId,
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export const deleteBy = async (userId, productId) => {
  try {
    return prisma.heart.deleteMany({ where: { userId, productId } });
  } catch (err) {
    console.error(err);
  }
};
