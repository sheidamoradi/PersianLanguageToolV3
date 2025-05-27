import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Material Icons from CDN
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
link.rel = "stylesheet";
document.head.appendChild(link);

// Add Inter font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// Add page title and meta description
const title = document.createElement("title");
title.textContent = "EduPlatform - Learn Anywhere, Anytime";
document.head.appendChild(title);

const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "An educational mobile app with course content delivery, PDF viewing capabilities, and a projects/articles section";
document.head.appendChild(metaDescription);

// Add favicon
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233B82F6' stroke='none'%3E%3Cpath d='M22 10v6M2 10l10-5 10 5-10 5z'%3E%3C/path%3E%3Cpath d='M6 12v5c0 2 2 3 6 3s6-1 6-3v-5'%3E%3C/path%3E%3C/svg%3E";
favicon.type = "image/svg+xml";
document.head.appendChild(favicon);

createRoot(document.getElementById("root")!).render(<App />);
