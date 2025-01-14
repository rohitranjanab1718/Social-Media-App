const validator = require("validator");

const validateSignUpData = (req) => {
  const { username, emailId, password } = req.body;
  console.log(req.body);
  if (!username) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

module.exports = {
    validateSignUpData 
}