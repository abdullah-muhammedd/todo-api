import bcrypt from 'bcryptjs';

/**
 * Generates a salted and hashed password using bcrypt.
 *
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export async function getEncryptedPassword(password: string): Promise<string> {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

/**
 * Validates a password by comparing it to a hashed password using bcrypt.
 *
 * @param {string} originalPassword - The original plain text password.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the passwords match, otherwise `false`.
 */
export async function validatePassword(originalPassword: string, hashedPassword: string): Promise<boolean> {
    const matched = await bcrypt.compare(originalPassword, hashedPassword);
    return matched;
}
