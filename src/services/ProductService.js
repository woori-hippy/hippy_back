import * as ProductRepository from '../repositorys/ProductRepository';

export const register = async (req, res) => {
  try {
    req.body.tokenId = Number(req.body.tokenId);
    req.body.price = Number(req.body.price);
    const productInfo = await ProductRepository.create(req.user.id, req.body);
    if (productInfo) {
      res.send({ message: '상품 등록 ㅊㅋ' });
    } else {
      throw new Error('알 수 없는 에러 발생');
    }
  } catch (err) {
    console.error(err);
  }
};
