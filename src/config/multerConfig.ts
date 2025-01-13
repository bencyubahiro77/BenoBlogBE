import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig"

const storage = new CloudinaryStorage({
    cloudinary,
    params: async () => {
        return {
            folder: 'beno-blog-images',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        };
    },
});

const upload = multer({storage});

export default upload