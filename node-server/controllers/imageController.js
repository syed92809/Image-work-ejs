const prisma = new (require('@prisma/client')).PrismaClient();


exports.getImages = async (req,res) => {
    try{
        const images = await prisma.images.findMany({
            include: {
                options: true
            },
        });
        res.render("index", {images});
    }
    catch(error){
        console.log("Error fetching images",error);
        res.status(500).send('Server Error');
    }
}

