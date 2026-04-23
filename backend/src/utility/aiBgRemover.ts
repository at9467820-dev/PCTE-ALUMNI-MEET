import axios from "axios";
import FormData from "form-data";
import cloudinary from "../config/cloudnary";
import mime from "mime-types";
import fs from "fs";
import path from "path";
export const removeBackground = async (localFile: string) => {
  console.log("localFile", localFile);
  const filePath = path.join("public", "uploads", "profilePic", localFile);
  const formData = new FormData();

  formData.append("image_file", fs.createReadStream(filePath), {
    filename: path.basename(localFile),
    contentType: mime.lookup(filePath) || "image/png",
  });
  formData.append("size", "auto");

  const response = await axios.post(
    "https://api.remove.bg/v1.0/removebg",
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        "X-Api-key": "SBBe4JwYeRTm62T4qYo2bZB7",
      },
      responseType: "arraybuffer",
    }
  );
  
  const bgRemovedBuffer = Buffer.from(response.data, "binary");

  const uploadResult = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "alumniMeet/profilePic",
            resource_type: "image",
            format: "png",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as { secure_url: string });
          }
        )
        .end(bgRemovedBuffer);
    }
  );

  await new Promise<void>((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(" Error deleting file:", err);
        return reject(err);
      }
      console.log(" File deleted from local storage!");
      resolve();
    });
  });
  
  return uploadResult.secure_url;
};
