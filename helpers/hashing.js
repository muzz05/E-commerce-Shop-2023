const bcrypt = require("bcrypt");

const hash = (password) => {
  const Salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, Salt);
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  hash,
  comparePassword,
};
