const prisma = new (require('@prisma/client')).PrismaClient();

exports.getImages = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const perPage = 5; 

  try {
    const totalImages = await prisma.images.count(); 
    const totalPages = Math.ceil(totalImages / perPage); 

    const images = await prisma.images.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        options: true
      }
    });

    res.render('index', {
      images: images,
      currentPage: page,
      totalPages: totalPages
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
  