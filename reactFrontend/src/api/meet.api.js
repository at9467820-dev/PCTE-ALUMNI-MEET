import axiosInstance from "../utils/axiosInstance"

export const addMeetApi = async(formData)=>{
    return await axiosInstance.post("/addNewAlumniMeet" , formData)
}

export const getAllMeets = async()=>{
    return await axiosInstance.get("/allMeets")
}

export const deleteMeet = async(id)=>{
    return await axiosInstance.delete(`/meet/${id}`)
}

export const updateMeet = async(formData, meetId)=>{
    return await axiosInstance.put(`/meet/${meetId}` , formData)
}

export const updateMeetMedia = async(formData , meetId)=>{
    console.log("ye n chaalla")
    return await axiosInstance.put(`/meet/${meetId}/mediaUpload`, formData)
}

export const fetchTalksOnFrontend = async(type)=>{
    return await axiosInstance.get(`/fetchTalksOnFrontend/${type}`)
}

export const talkPagination = async(page , limit)=>{
    return await axiosInstance.get(`/talkPagination?page=${page}&limit=${limit}`)
}