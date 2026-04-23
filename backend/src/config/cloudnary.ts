import dotenv from "dotenv";
dotenv.config();
import {v2 as cloudinary} from 'cloudinary';
cloudinary.config({
    cloud_name:"ankitjangir",
    api_key:"272686899287346",
    api_secret:"ZvIavKPJA89HkbTc44OAXv6nhZk"
});

export default cloudinary;