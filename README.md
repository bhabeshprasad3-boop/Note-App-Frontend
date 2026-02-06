# 📝 Notes App - Frontend

Website Link : https://note-app-frontend-sage.vercel.app

The client-side interface for the Notes Application, built with React and optimized for a smooth user experience.

## 🚀 Features
- **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop views.
- **State Management:** Handles real-time UI updates upon adding or deleting notes.
- **Secure API Calls:** Uses Axios with `withCredentials: true` for secure cookie-based requests.
- **Protected Routes:** Ensures only authenticated users can access the dashboard.

## 🛠️ Tech Stack
- **React.js** (Vite)
- **Tailwind CSS** (Styling)
- **Axios** (HTTP Client)
- **React Router Dom** (Client-side Routing)

## ⚙️ Local Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Update the `BACKEND_URL` in your configuration files to point to your local or live server.
4. Run `npm run dev` to start the development server.

## 🌐 Deployment
This project is deployed on **Vercel**. It includes a `vercel.json` file to handle Single Page Application (SPA) routing to prevent 404 errors on page refresh.
