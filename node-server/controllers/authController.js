const prisma = new (require('@prisma/client')).PrismaClient();


exports.login = async (req,res) => {
    res.render('login');
}
