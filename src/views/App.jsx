// src/App.jsx
import { RouterProvider } from "react-router";
import { router } from "../router";
import "./assets/css/style.css";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
