import { configureStore } from "@reduxjs/toolkit";
// 需要手動匯入 slice 的 reducer，這裡以 messageSlice 為例
import messageReducer from "../slice/messageSlice";

export const store = configureStore({
  reducer: {
    // 這裡可以存入多個 slice 的 reducer
    message: messageReducer,
    // user: userReducer,
    // product: productReducer,
  },
});

export default store;
