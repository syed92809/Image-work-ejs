const prisma = new (require('@prisma/client')).PrismaClient();

exports.getImages = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const perPage = 5; 
  const userId = req.session.userId;
  const userRole = req.session.role; 

  try {
    // If the user is an admin (role === 1), fetch all images
    let imagesQuery;
    let totalImagesQuery;

    if (userRole === 1) {
      // Admin case: Get all images
      totalImagesQuery = prisma.images.count();
      imagesQuery = prisma.images.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        include: { options: true }
      });
    } else {
      // Regular user: Get images only from assigned batches
      const userBatches = await prisma.usersBatches.findMany({
        where: { userId: userId },
        select: { batchId: true }
      });
      
      const batchIds = userBatches.map(batch => batch.batchId);

      totalImagesQuery = prisma.images.count({
        where: { batchId: { in: batchIds } }
      });

      imagesQuery = prisma.images.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        where: { batchId: { in: batchIds } },
        include: { options: true }
      });
    }

    const [totalImages, images] = await Promise.all([totalImagesQuery, imagesQuery]);
    const totalPages = Math.ceil(totalImages / perPage);

    res.render('imagelisting', {
      images: images,
      currentPage: page,
      totalPages: totalPages,
      role:userRole
    });
  } catch (error) {
    console.log('Error fetching images', error);
    res.status(500).send('Server Error');
  }
};


exports.updateImageOption = async (req, res) => {
    const { optionId, field, value } = req.body;
    try {
      const updated = await prisma.option.update({
        where: { id: parseInt(optionId) },  
        data: { [field]: value },
      });
      res.json({ message: 'Option updated successfully!' });
    } catch (error) {
      console.log('Error updating option', error);
      res.status(500).json({ message: 'Failed to update option' });
    }
  };
  