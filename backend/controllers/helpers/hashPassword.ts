import bcrypt from "bcryptjs";

// docs
// https://www.npmjs.com/package/bcryptjs

export const hashPassword = async (password: string): Promise<string | undefined> => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Hashing failed: ${error}`);
        }
    }
};