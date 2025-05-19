import React from "react";
import { createSlice } from "@reduxjs/toolkit";

let initialState ={
    cartItems: [ ],
    orderItems : [],
    favItems : []
    
}

let CartReducer = createSlice(
    {
        name :'cartItems',
        initialState,
        reducers: {
            addItem:(state,action)=>{
                // console.log("called")
                state.cartItems.push(action.payload)
            },
            removeFromCart : (state,action)=>{
                state.cartItems.splice(action.payload,1)
            },
            orderNow:(state,action)=>{
                // console.log("called")
                state.orderItems.push(action.payload)
            },
            addFav:(state,action)=>{
                // console.log("called")
                state.favItems.push(action.payload)
            },
            clearCart :(state,action)=>{
                    state.cartItems=[]
                }


            // extra code 
            
            // clearCart :(state,action)=>{
            //     state.cartItems=[]
            // },
            // addLoc:(state,action)=>{
            //     state.location.push(action.payload)
            // },
            // deleteLoc :(state,action)=>{
            //     state.location=[]
            // },
            // setG:(state,action)=>{
            //     state.geo.push(action.payload)
            // },
            // clearG :(state,action)=>{
            //     state.geo=[]
            // }
            
            
           
        }
    }
   
)
export const {addItem,removeFromCart,orderNow,addFav,clearCart}=CartReducer.actions
export default CartReducer.reducer