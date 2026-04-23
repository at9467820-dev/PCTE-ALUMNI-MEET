import cloudinary from "../config/cloudnary";

export const deleteFromCloudinary = async (
  media: string | string[],
  type: "image" | "video" = "image"   
) => {
  try {
    const mediaArray = Array.isArray(media) ? media : [media];

    const deletedPromises = mediaArray.map((publicId) => {
      return cloudinary.uploader.destroy(publicId, {
        resource_type: type, 
      });
    });

    const results = await Promise.all(deletedPromises);

    console.log("Delete results:", results);
    return results;
  } catch (err) {
    console.error("Error deleting media from Cloudinary:", (err as Error).message);
    throw new Error("Failed to delete one or more media files from Cloudinary.");
  }
};
