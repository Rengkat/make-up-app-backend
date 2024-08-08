const createUserPayload = (user) => {
  return { firstName: user.firstName, surname: user.surname, id: user._id, role: user.role };
};
module.exports = createUserPayload;
