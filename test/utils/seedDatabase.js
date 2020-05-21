import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';
const BCRYPT_SALT = 6;

class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
    newUser() {
        return {
            input: {
                name: this.name,
                email: this.email,
                password: bcrypt.hashSync(this.password, BCRYPT_SALT)
            },
            user: undefined,
            token: undefined
        };
    }
}

const userOne = new User('Mike', 'mike@example.com', 'bananinha').newUser();
const userTwo = new User('Yumi', 'yumi@example.com', 'bananinha').newUser();

const seedDatabase = async () => {
    //! Delete test data
    await prisma.mutation.deleteManyUsers();
    //! Create users
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    });
    //! Save token
    userOne.token = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET, { expiresIn: '1 day' });
    userTwo.token = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET, { expiresIn: '1 day' });
};

export { seedDatabase as default, userOne, userTwo };
