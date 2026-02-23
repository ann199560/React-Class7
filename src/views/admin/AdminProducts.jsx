import { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import Pagination from "../../components/pagination";
import ProductModal from "../../components/ProductModal";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../../slice/messageSlice";
import useMessage from "../../hooks/useMessage";

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({});

  // 1. 此 Ref 將用來儲存 Bootstrap Modal 的實體
  const productModalRef = useRef(null);
  // 2. 額外建立一個 Ref 用來綁定 Modal 的 DOM 元素（給子組件使用）
  const modalDOMRef = useRef(null);
  const dispatch = useDispatch();
  const { showError, showSuccess } = useMessage();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("loginToken="))
      ?.split("=")[1];

    if (!token) {
      console.log("尚未登入，請重新登入");
      return;
    }

    axios.defaults.headers.common.Authorization = token;
    getProducts();

    // ✅ 重點：初始化 Bootstrap Modal 實體
    // 這裡使用 modalDOMRef.current 來確保抓到真正的 DOM 節點
    if (modalDOMRef.current) {
      productModalRef.current = new bootstrap.Modal(modalDOMRef.current, {
        backdrop: "static", // 點擊背景不關閉 (選擇性)
        keyboard: false, // 按下 Esc 不關閉 (選擇性)
      });
    }
  }, []);

  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products?page=${page}`,
      );
      setProducts(response.data.products);
      setPagination(response.data.pagination);
      showSuccess("取得成功");
    } catch (error) {
      console.log(error);
      // call api 失敗時，從 error 物件中取出錯誤訊息並 dispatch createAsyncMessage action，將錯誤訊息顯示在畫面上
      // dispatch(createAsyncMessage(error.response.data));
      showError(error.response.data.message);
    }
  };

  const openModal = (type, product) => {
    setModalType(type);
    setTempProduct({
      ...INITIAL_TEMPLATE_DATA,
      ...product,
    });
    // ✅ 呼叫實體上的 show 方法
    productModalRef.current?.show();
  };

  const closeModal = () => {
    // ✅ 呼叫實體上的 hide 方法
    productModalRef.current?.hide();
  };

  return (
    <>
      <div className="container">
        <h2>產品列表</h2>
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
          >
            建立新的產品
          </button>
        </div>
        <div className="row mt-5">
          <table className="table">
            <thead>
              <tr>
                <th>分類</th>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>編輯</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.category}</td>
                  <td>{product.title}</td>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td className={`${product.is_enabled ? "text-success" : ""}`}>
                    {product.is_enabled ? "啟用" : "未啟用"}
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal("edit", product)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal("delete", product)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onChangePage={getProducts} />
        </div>
      </div>

      {/* 傳遞 modalDOMRef 給子組件，讓 useEffect 能抓到 DOM */}
      <ProductModal
        modalType={modalType}
        tempProduct={tempProduct}
        closeModal={closeModal}
        productModalRef={modalDOMRef}
        getProducts={getProducts}
      />
    </>
  );
}

export default AdminProducts;
