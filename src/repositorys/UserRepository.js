import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const findById = async id => {
  try {
    return prisma.user.findUnique({ where: { id } });
  } catch (err) {
    console.error(err);
  }
};
