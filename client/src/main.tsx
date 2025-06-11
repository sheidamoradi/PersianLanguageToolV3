import { createRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
} else {
  console.error("Root element not found");
  document.body.innerHTML = '<h1 style="color: red; text-align: center; margin-top: 50px;">خطا: عنصر root یافت نشد</h1>';
}