import { createContext, useEffect, useState } from "react";

import { toast } from "react-toastify";

export const CartContext = createContext();

export function CartProvider({ children }) {

    // ================= LOAD CART FROM LOCALSTORAGE =================
    const [cartItems, setCartItems] = useState(() => {

        const savedCart = localStorage.getItem("cart");

        return savedCart ? JSON.parse(savedCart) : [];
    });

    // ================= SAVE CART =================
    useEffect(() => {

        localStorage.setItem(
            "cart",
            JSON.stringify(cartItems)
        );

    }, [cartItems]);

    // ================= ADD TO CART =================
    const addToCart = (product, quantity = 1) => {

        const existingItem = cartItems.find(
            item => item.id === product.id
        );

        if (existingItem) {

            const updatedCart = cartItems.map(item =>

                item.id === product.id
                    ? {
                        ...item,
                        quantity: item.quantity + quantity
                    }
                    : item
            );

            setCartItems(updatedCart);

        } else {

            setCartItems([
                ...cartItems,
                {
                    ...product,
                    quantity
                }
            ]);
        }

        toast.success("Đã thêm vào giỏ hàng!");
    };

    // ================= INCREASE =================
    const increaseQuantity = (id) => {

        const updatedCart = cartItems.map(item =>

            item.id === id
                ? {
                    ...item,
                    quantity: item.quantity + 1
                }
                : item
        );

        setCartItems(updatedCart);
    };

    // ================= DECREASE =================
    const decreaseQuantity = (id) => {

        const updatedCart = cartItems.map(item =>

            item.id === id
                ? {
                    ...item,
                    quantity:
                        item.quantity > 1
                            ? item.quantity - 1
                            : 1
                }
                : item
        );

        setCartItems(updatedCart);
    };

    // ================= REMOVE =================
    const removeFromCart = (id) => {

        const updatedCart = cartItems.filter(
            item => item.id !== id
        );

        setCartItems(updatedCart);

        toast.success("Đã xóa sản phẩm!");
    };

    // ================= CLEAR CART =================
    const clearCart = () => {

        setCartItems([]);

        localStorage.removeItem("cart");
    };

    return (

        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}