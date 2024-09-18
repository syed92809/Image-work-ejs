const prisma = new (require('@prisma/client')).PrismaClient();


exports.login = async (req, res) => {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        try {
            const user = await prisma.users.findFirst({
                where: {
                    username: username,
                    password: password 
                }
            });

            if (!user) {
                return res.status(401).send('Invalid username or password');
            }

            req.session.userId = user.id;
            req.session.role = user.role;

            if (user.role === 0 && user.block == false) {
                return res.redirect('/image-listing');
            } else if (user.role === 1 && user.block == false) {
                return res.redirect('/dashboard');
            } else {
                return res.status(403).send('Unauthorized or Account has been Blocked');
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        // Render the login form
        res.render('login');
    }
};
