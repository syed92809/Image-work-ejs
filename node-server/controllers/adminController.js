const prisma = new (require('@prisma/client')).PrismaClient();

exports.dashboard = async (req,res) => {
    res.render('index');
}

exports.Image = async (req,res) => {
    res.render('image');
}

exports.batchListing = async (req,res) => {
    res.render('batchlisting');
}

exports.Batch = async (req,res) => {
    res.render('batch');
}

exports.User = async (req, res) => {
    res.render('user');
}

exports.userListing = async (req, res) => {
    res.render('userlisting');
}