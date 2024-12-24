const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
};

const configurePassport = (passport) => {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await prisma.user.findUnique({ where: { id: payload.id } });
                if (!user) {
                    return done(null, false, { message: "User not found" });
                }
                return done(null, user);
            } catch (error) {
                console.error(error);
                return done(error, false);
            }
        })
    );
};

module.exports = configurePassport;