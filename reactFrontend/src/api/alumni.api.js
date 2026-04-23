import axiosInstance from "../utils/axiosInstance";

export const addNewAlumni = async(data)=>{
    return await axiosInstance.post("/addNewAlumni", data , {
        headers:{
            "content-Type":"multipart/form-data"                                    
        }
    });
}

export const getAllAlumni = async() =>{
    return await axiosInstance.get("/");
}

export const updateAlumni = async(data, alumniId) =>{
    return await axiosInstance.put(`updateAlumni/${alumniId}`, data);
}

export const deleteAlumni = async(alumniId) =>{
    return await axiosInstance.delete(`deleteAlumni/${alumniId}`);
}

export const getSomeRandomAlumni = async()=>{
    return await axiosInstance.get("/getSomeRandomAlumni");
}