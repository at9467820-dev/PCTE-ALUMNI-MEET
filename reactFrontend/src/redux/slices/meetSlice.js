import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
const meetSlice = createSlice({
    name:"meets",
    initialState,
    reducers:{
        addMeets:(state , action)=>{
            return action.payload
        }
    }
})

export const {addMeets} = meetSlice.actions;
export default meetSlice.reducer;