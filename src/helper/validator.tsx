/**
 * ValidatorUtils class for handling all validation logic
 */
class ValidatorUtils {
  /**
   * Validates password strength
   * @param password The password to validate
   * @returns Error message or empty string if valid
   */
  static validatePassword(password: string): string {
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
  }

  /**
   * Validates username format
   * @param username The username to validate
   * @returns Error message or empty string if valid
   */
  static validateUsername(username: string): string {
    if (!username) {
      return "Username Required...!";
    } else if (username.includes(" ")) {
      return "Invalid Username...!";
    } else if (username.length < 6) {
      return "minimum 6 characters username";
    }
    return "";
  }

  /**
   * Validates email format
   * @param email The email to validate
   * @returns Error message or empty string if valid
   */
  static validateEmail(email: string): string {
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
  }
}

// For backward compatibility
const passwordValidator = (password: string) =>
  ValidatorUtils.validatePassword(password);
const usernameValidator = (username: string) =>
  ValidatorUtils.validateUsername(username);
const emailValidator = (email: string) => ValidatorUtils.validateEmail(email);

export { usernameValidator, emailValidator, passwordValidator, ValidatorUtils };
