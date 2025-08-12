const passwordValidator = (password: string) => {
  const specialChars = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!password) {
    return "password required...!";
  } else if (password.includes(" ")) {
    return "wrong password...!";
  } else if (password.length < 8) {
    return "minimum 8 characters password";
  } else if (!specialChars.test(password)) {
    return "password must have a special character, uppercase, lowercase, number";
  }
  return "";
};

const usernameValidator = (username: string) => {
  if (!username) {
    return "Username Required...!";
  } else if (username.includes(" ")) {
    return "Invalid Username...!";
  } else if (username.length < 6) {
    return "minimum 6 characters username";
  }
  return "";
};

/** validate email */
const emailValidator = (email: string) => {
  const specialChars = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  // const endsWithGmailOrAshoka = /@(gmail\.com|ashoka\.edu\.in)$/i;
  if (!email) {
    return "Email Required...!";
  } else if (email.includes(" ")) {
    return "Wrong Email...!";
  } else if (!specialChars.test(email)) {
    return "Invalid email address...!";
  } 
  // else if (!endsWithGmailOrAshoka.test(email)) {
  //   return "Email must end with gmail.com or ashoka.edu.in ...!";
  // }
  return "";
};

export { usernameValidator, emailValidator, passwordValidator };
