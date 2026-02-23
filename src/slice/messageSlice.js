import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  // 定義 slice 的名稱，這個名稱會用在 action type 中
  name: "message",
  // 初始化內容為空陣列，因為可能會有多條訊息
  initialState: [],
  // 定義 reducers（其實就是 action）：執行某一動作。此處是執行兩個動作 ->「新增訊息」＆「移除訊息」
  reducers: {
    createMessage(state, action) {
      state.push({
        id: action.payload.id,
        // 根據 success 的值決定訊息顏色，成功為綠色（success），失敗為紅色（danger）
        type: action.payload.success ? "success" : "danger",
        // 訊息內容來自 action 的 payload
        text: action.payload.message,
      });
    },
    removeMessage(state, action) {
      // 根據訊息 ID 找到對應的訊息索引，然後從 state 中移除該訊息
      const index = state.findIndex((message) => message.id === action.payload);
      // 如果找到了對應的訊息，就從 state 中移除它
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

// 使用 createAsyncThunk 封裝一個非同步操作，這裡是用來創建訊息並在 2 秒後自動移除
export const createAsyncMessage = createAsyncThunk(
  // 命名這個非同步操作，這個名稱會用在 action type 中
  "message/createAsyncMessage",
  // 呼叫 createAsyncMessage，把 createMessage 中的物件傳到 initialState 中（使用 create 的 action，把 createMessage 中的物件丟到 initialState 陣列中）
  async (payload, { dispatch, requestId }) => {
    dispatch(
      createMessage({
        ...payload,
        id: requestId, // 使用 requestId 作為訊息的唯一 ID
      }),
    );

    setTimeout(() => {
      dispatch(removeMessage(requestId)); // 在 2 秒後自動移除訊息
    }, 2000);
  },
);

export const { createMessage, removeMessage } = messageSlice.actions;

export default messageSlice.reducer;
