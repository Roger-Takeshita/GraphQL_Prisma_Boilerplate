import getUserId from '../utils/getUserId';

const Query = {
    async users(parent, { query, first, skip, after }, { prisma }, info) {
        const opArgs = {
            first,
            skip,
            after
        };
        if (query) {
            opArgs.where = {
                OR: [{ name_contains: query }]
            };
        }
        return prisma.query.users(opArgs, info);
    },
    async me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        const userExists = await prisma.query.users(
            {
                where: { id: userId }
            },
            info
        );
        if (userExists.length === 0) throw new Error('User not found');
        return userExists[0];
    }
};

export { Query as default };
