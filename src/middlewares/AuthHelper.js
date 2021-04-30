export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send({ message: '잘못된 접근입니다.' });
  }
};

export const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send({ message: '잘못된 접근입니다.' });
  }
};

export const isArtist = (req, res, next) => {
  if (req.user.isArtist) {
    next();
  } else {
    res.status(403).send({ message: '잘못된 접근입니다.' });
  }
};
