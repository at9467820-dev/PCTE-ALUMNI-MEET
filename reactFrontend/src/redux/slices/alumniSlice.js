import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
const alumniSlice = createSlice({
    name:"alumni",
    initialState,
    reducers:{
        addAlumni:(state,action)=>{
            return action.payload;
        },
        
    }
})

export const {addAlumni} = alumniSlice.actions;
export default alumniSlice.reducer;