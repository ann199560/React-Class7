import { useSelector } from "react-redux";

function MessageToast() {
  // 資料結構：[陣列中放很多{message 物件}]。要把這些資料從 Redux store 中取出，渲染至畫面上
  const messages = useSelector((state) => state.message);

  return (
    // 設定 Toast 位置：把定位程式碼放在外層包住整串，這樣就不會被 Toast 的 show/hide 影響
    <div className="toast-container position-fixed top-0 end-0 p-3">
      {/* 將 messages 陣列中的每個 message 物件渲染成一個 Toast 元素，並且根據 message 的 type 動態設定背景顏色 */}
      {messages.map((message) => (
        <div
          key={message.id}
          className="toast show" // 預設是關閉，所以要加 show 顯示
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className={`toast-header text-white bg-${message.type}`}>
            <strong className="me-auto">Bootstrap{message.title}</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">{message.text}</div>
        </div>
      ))}
    </div>
  );
}

export default MessageToast;
