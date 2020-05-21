import getUserId from '../utils/getUserId';
import getToken from '../utils/getToken';
import { hashPassword, comparePassword } from '../utils/hashPassword';

const Mutations = {
    async createUser(parent, { data }, { prisma }, info) {
        const password = await hashPassword(data.password);
        const user = await prisma.mutation.createUser({
            data: {
                ...data,
                password
            }
        });
        return {
            user,
            token: getToken({ userId: user.id })
        };
    },
    async loginUser(parent, { data }, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: data.email
            }
        });
        if (!user) throw new Error('Bad credentials');
        const isMatch = await comparePassword(data.password, user.password);
        if (!isMatch) throw new Error('Bad credentials');
        return {
            user,
            token: getToken({ userId: user.id })
        };
    },
    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        return prisma.mutation.deleteUser({ where: { id: userId } }, info);
    },
    async updateUser(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);
        if (typeof data.password === 'string') data.password = await hashPassword(data.password);
        return prisma.mutation.updateUser({ data: data, where: { id: userId } }, info);
    }
};

export { Mutations as default };
