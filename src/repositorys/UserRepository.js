import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const findById = async id => {
  try {
    return prisma.user.findUnique({ where: { id } });
  } catch (err) {
    console.error(err);
  }
};

export const findByEmailAndLocal = async email => {
  try {
    return prisma.user.findMany({ where: { email, provider: 'local' } });
  } catch (err) {
    console.error(err);
  }
};

export const createByLocal = async data => {
  const { email, password, name } = data;
  try {
    return prisma.user.create({ data: { password, email, name, provider: 'local' } });
  } catch (err) {
    console.error(err);
  }
};

export const updateCoinAccount = async (id, coinAccount) => {
  try {
    return prisma.user.update({ where: { id }, data: { coinAccount } });
  } catch (err) {
    console.error(err);
  }
};

export const updateWooriAccount = async (id, data) => {
  const { wooriAccount, wooriToken } = data;
  try {
    return prisma.user.update({ where: { id }, data: { wooriAccount, wooriToken } });
  } catch (err) {
    console.error(err);
  }
};
