import * as HeartRepository from '../repositorys/HeartRepository';

export const click = async (req, res, next) => {
  const productId = Number(req.query.productId);
  try {
    const findClick = await HeartRepository.findBy(req.user.id, productId);

    if (findClick[0]) {
      await HeartRepository.deleteBy(req.user.id, productId);
      res.send({ isClick: false });
    } else {
      await HeartRepository.createBy(req.user.id, productId);
      res.send({ isClick: true });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};
