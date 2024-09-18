// Middleware to check if the user is authenticated 
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        next(); 
    } else {
        res.status(401).send('Unauthorized. Please log in.');
        res.render('login')
    }
};

// Middleware to check if the user has the required role
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.role === role) {
            next(); 
        } else {
            res.status(403).send('Forbidden. You do not have permission to access this resource.');
        }
    };
};

module.exports = { isAuthenticated, authorizeRole };
