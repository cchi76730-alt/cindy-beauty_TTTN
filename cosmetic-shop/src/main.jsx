import React from 'react';

import { createRoot } from 'react-dom/client';

import './index.css';

import App from './App.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { CartProvider } from "./context/CartContext";

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(

    <React.StrictMode>

        <CartProvider>

            <App />

            <ToastContainer
                position="top-right"
                autoClose={2000}
            />

        </CartProvider>

    </React.StrictMode>
);