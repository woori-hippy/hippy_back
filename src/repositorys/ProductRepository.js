import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const RegisteProduct = async (userId, data) => {
  const { tokenId, price, isAcution, name, src, tag } = data;

  try {
    return prisma.product.create({ data: { tokenId, userId, price, isAcution, name, src, tag } });
  } catch (err) {
    console.error(err);
  }
};
