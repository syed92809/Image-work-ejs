const prisma = new (require('@prisma/client')).PrismaClient();
const csvParser = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

exports.Image = async (req, res) => {
    try {
        const batches = await prisma.batch.findMany({
            select: {
                id: true,
                batchname: true,
            },
        });
        res.render('image', { batches });
    } catch (error) {
        console.error('Error fetching batches:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.uploadImage = async (req, res) => {
    const { imageName, imageUrl, batchId } = req.body;
    const file = req.file; // Multer should handle this

    try {
        if (file) {
            const ext = path.extname(file.originalname).toLowerCase();
            if (ext === '.csv') {
                await processCSV(file.path, batchId);
            } else if (ext === '.xlsx') {
                await processExcel(file.path, batchId);
            } else {
                return res.status(400).send('Invalid file format. Only .csv and .xlsx files are allowed.');
            }
        } else if (imageName && imageUrl && batchId) {
            const newImage = await prisma.$transaction(async (prisma) => {
                const createdImage = await prisma.images.create({
                    data: {
                        name: imageName,
                        url: imageUrl,
                        batchId: parseInt(batchId),
                        created: new Date(),
                    },
                });
                await prisma.option.create({
                    data: {
                        imageId: createdImage.id,
                        F1: false,
                        F2: false,
                        F3: false,
                        F4: false,
                    },
                });
                return createdImage;
            });
        } else {
            return res.status(400).send('Invalid input. Please provide all required fields.');
        }

        res.redirect('/image-listing');
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Process CSV file
async function processCSV(filePath, batchId) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser({ headers: false })) 
            .on('data', (row) => {
                results.push({
                    name: row[0] || '',  
                    url: row[1] || '',   
                    batchId: parseInt(batchId),
                    created: new Date(),
                });
            })
            .on('end', async () => {

                const createdImages = await prisma.images.createMany({
                    data: results,
                });

                const newImages = await prisma.images.findMany({
                    where: { batchId: parseInt(batchId) },
                    orderBy: { created: 'desc' },
                    take: results.length
                });

                await Promise.all(newImages.map(async (image) => {
                    await prisma.option.create({
                        data: {
                            imageId: image.id,
                            F1: false,
                            F2: false,
                            F3: false,
                            F4: false,
                        },
                    });
                }));

                resolve();
            })
            .on('error', reject);
    });
}

// Process Excel file
async function processExcel(filePath, batchId) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    const images = sheet.map(row => ({
        name: row[0] || '',  
        url: row[1] || '',   
        batchId: parseInt(batchId),
        created: new Date(),
    }));

    const createdImages = await prisma.images.createMany({
        data: images
    });

    const newImages = await prisma.images.findMany({
        where: {
            batchId: parseInt(batchId),
        },
        orderBy: {
            created: 'desc',
        },
        take: sheet.length
    });

    await Promise.all(newImages.map(async (image) => {
        await prisma.option.create({
            data: {
                imageId: image.id,
                F1: false,
                F2: false,
                F3: false,
                F4: false,
            },
        });
    }));
}


exports.batchListing = async (req, res) => {
    try {
        // Fetch batches with associated users and images
        const batches = await prisma.batch.findMany({
            include: {
                usersBatches: {
                    include: {
                        user: true, 
                    },
                },
                images: true, 
            },
            orderBy: {
                created: 'desc', 
            },
        });

        res.render('batchlisting', { batches });
    } catch (error) {
        console.error('Error fetching batch listing:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.Batch = async (req, res) => {
    const users = await prisma.users.findMany(); 
    res.render('batch', { users });
};


exports.createBatch = async (req, res) => {
    const { batchName, users } = req.body;

    try {
        const existingBatch = await prisma.batch.findUnique({
            where: {
                batchname: batchName,
            },
        });

        if (existingBatch) {
            return res.status(400).send('Batch name already exists. Please choose a different name.');
        }

        // Create a new batch if the name does not exist
        const newBatch = await prisma.batch.create({
            data: {
                batchname: batchName,
                usersBatches: {
                    create: users.map(userId => ({
                        user: {
                            connect: { id: parseInt(userId) },
                        }
                    })),
                },
            },
        });
        
        res.redirect('/batch-listing'); 
    } catch (error) {
        console.error('Error creating batch:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.User = async (req, res) => {
    if (req.method === 'POST') {
        const { userName, userPass, role } = req.body;
        try {
            // Check if the username already exists in the database
            const existingUser = await prisma.users.findFirst({
                where: {
                    username: userName
                }
            });

            if (existingUser) {
                // If the username already exists, return an error message
                return res.status(400).send("Username already exists. Please choose a different one.");
            }

            // Create a new user if the username does not exist
            const newUser = await prisma.users.create({
                data: {
                    username: userName,
                    password: userPass,
                    role: parseInt(role),
                    block: false
                }
            });

            res.render('userlisting', { message: "User created successfully!" });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error creating user");
        }
    } else {
        res.render('user');
    }
};



exports.userListing = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;
    const skip = (page - 1) * pageSize; 

    try {
        const totalUsers = await prisma.users.count();

        const users = await prisma.users.findMany({
            skip,
            take: pageSize,
            orderBy: {
                created: 'desc', 
            },
        });

        const totalPages = Math.ceil(totalUsers / pageSize);

        res.render('userlisting', {
            users,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching users.");
    }
};


exports.userDetail = async (req, res) => {
    const userId = req.params.id;

    const user = await prisma.users.findUnique({
        where: { id: parseInt(userId) }
    });

    res.render('userdetail', { user });
};

exports.updateUserDetail = async (req, res) => {
    const userId = req.params.id;
    const { userName, userPass, role, blockStatus } = req.body;

    const updateData = {
        username: userName,
        role: parseInt(role),
        block: blockStatus === 'on' ? true : false
    };

    if (userPass) {
        updateData.password = userPass;  
    }

    // Update the user details in the database
    await prisma.users.update({
        where: { id: parseInt(userId) },
        data: updateData
    });

    res.redirect('/user-listing');
};


exports.getDashboardCounts = async (req, res) => {
    try {
        const totalUsers = await prisma.users.count();
        
        const totalImages = await prisma.images.count();
        
        const totalBatches = await prisma.batch.count();
        
        const totalAdmins = await prisma.users.count({
            where: {
                role: 1
            }
        });

        res.render('index', {
            totalUsers: totalUsers,
            totalImages: totalImages,
            totalBatches: totalBatches,
            totalAdmins: totalAdmins
        });
    } catch (error) {
        console.error('Error fetching dashboard counts:', error);
        res.status(500).send('Internal Server Error');
    }
};