import bcrypt from "bcryptjs";

export const comparePasswords =
    async (inputPassword: string, hashedPassword: string): Promise<boolean | undefined> => {
        try {
            return await bcrypt.compare(inputPassword, hashedPassword);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Comparison failed: ${error}`);
            }
        }
    };