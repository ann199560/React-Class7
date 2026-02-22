import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { emailValidation } from "../utils/vaildation";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

function Login({ getProducts, setIsAuth }) {
  // const [formData, setFormData] = useState({
  //   username: "@gmail.com",
  //   password: "",
  // });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "@gmail.com",
      password: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((preDate) => ({
      ...preDate,
      [name]: value,
    }));
  };

  const onSubmit = async (formData) => {
    try {
      // e.preventDefault();
      const response = await axios.post(
        `${VITE_API_BASE}/admin/signin`,
        formData,
      );
      console.log(response.data);
      const { token, expired } = response.data;
      //設定cookie 加入 token 和 時間
      document.cookie = `loginToken=${token};expires=${new Date(expired)};`;
      // 修改實體建立時所指派的預設配置
      axios.defaults.headers.common["Authorization"] = token;

      // getProducts();
      // setIsAuth(true);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("loginToken="))
      ?.split("=")[1];
    if (token) {
      axios.defaults.headers.common.Authorization = token;
    }
    const checkLogin = async () => {
      try {
        const response = await axios.post(
          `${VITE_API_BASE}/api/user/check`,
          formData,
        );
        setIsAuth(true);
        getProducts();
      } catch (error) {
        console.error(error.response?.data.message);
      }
    };

    checkLogin();

    // productModalRef.current = new bootstrap.Modal("#productModal", {
    //   keyboard: false,
    // });
  }, []);

  return (
    <div className="container login">
      <h1>請先登入</h1>
      <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            name="username"
            placeholder="name@example.com"
            {...register("username", emailValidation)}
            // value={formData.username}
            // onChange={(e) => handleInputChange(e)}
          />
          <label htmlFor="username">Email address</label>
          {errors.username && (
            <p className="text-danger">{errors.username.message}</p>
          )}
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="password"
            {...register("password", {
              required: "請輸入密碼",
              minLength: {
                value: 6,
                message: "密碼至少要 6 碼",
              },
            })}
            // value={formData.password}
            // onChange={(e) => handleInputChange(e)}
          />
          <label htmlFor="password">Password</label>
          {errors.username && (
            <p className="text-danger">{errors.username.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100 mt-2"
          disabled={!isValid}
        >
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;
