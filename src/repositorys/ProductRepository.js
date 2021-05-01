import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const create = async (userId, data) => {
  const { tokenId, price, isAcution, name, src, tag } = data;

  try {
    return prisma.product.create({ data: { tokenId, userId, price, isAcution, name, src, tag } });
  } catch (err) {
    console.error(err);
  }
};

export const findProduct = async (userId, tokenId) => {
  try {
    return prisma.product.findMany({ where: { userId, tokenId } });
  } catch (err) {
    console.error(err);
  }
};

export const findById = async id => {
  try {
    return prisma.product.findUnique({ where: { id } });
  } catch (err) {
    console.error(err);
  }
};

export const updateProductState = async (id, isSold) => {
  try {
    return prisma.product.update({ where: { id }, data: { isSold } });
  } catch (err) {
    console.error(err);
  }
};
