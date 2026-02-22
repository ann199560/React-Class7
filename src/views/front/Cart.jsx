import axios from "axios";
import { useState, useEffect } from "react";
import { currency } from "../../utils/filter";

const { VITE_API_BASE: API_BASE, VITE_API_PATH: API_PATH } = import.meta.env;

function Cart() {
  const [cart, setCart] = useState([]);
  const ClearSingleCart = async function (id) {
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
      console.log(res.data);
      setCart((prev) => ({
        ...prev,
        carts: prev.carts.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const ClearCart = async function () {
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      console.log(res.data);
      setCart(() => ({
        carts: [],
        total: 0,
        final_total: 0,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        console.log(response.data.data);
        setCart(response.data.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getCart();
  }, []);

  const updateCart = async (cartId, productId, qty = 1) => {
    console.log(`${API_BASE}/api/${API_PATH}/cart/${cartId}`);
    console.log(`${cartId}, ${productId}, ${qty}`);
    try {
      const data = { product_id: productId, qty: qty };
      console.log(data);
      const res = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        { data },
      );
      console.log(res.data);
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    // src/views/front/Cart.jsx
    <div className="container">
      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => ClearCart()}
        >
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th scope="col">小計</th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem) => (
            <tr key={cartItem.id}>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => ClearSingleCart(cartItem.id)}
                >
                  刪除
                </button>
              </td>
              <th scope="row">{cartItem.product.title}</th>
              <td>
                <div className="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    defaultValue={cartItem.qty}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      updateCart(cartItem.id, cartItem.product.id, qty);
                    }}
                  />
                  <span className="input-group-text" id="inputGroup-sizing-sm">
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{currency(cartItem.final_total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="3">
              總計
            </td>
            <td className="text-end">{currency(cart.final_total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Cart;
