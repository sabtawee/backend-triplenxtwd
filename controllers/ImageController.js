const path = require("path");

const getImages = async (req, res) => {
    try {
        let imageName = req.params.imagename;
        let imagePath = path.join(__dirname, "../uploads/" + imageName);
        res.sendFile(imagePath);
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
};
module.exports = {
    getImages,
};