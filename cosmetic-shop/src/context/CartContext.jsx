import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const notifyCartUpdated = () => {
        window.dispatchEvent(
            new Event("cartUpdated")
        );
    };

    useEffect(() => {
        localStorage.setItem(
            "cart",
            JSON.stringify(cartItems)
        );

        notifyCartUpdated();
    }, [cartItems]);

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

    const removeFromCart = (id) => {
        const updatedCart = cartItems.filter(
            item => item.id !== id
        );

        setCartItems(updatedCart);

        toast.success("Đã xóa sản phẩm!");
    };

    const clearCart = () => {
        setCartItems([]);

        localStorage.setItem(
            "cart",
            JSON.stringify([])
        );

        notifyCartUpdated();
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