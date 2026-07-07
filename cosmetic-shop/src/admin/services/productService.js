const API_URL =
    "https://localhost:7019/api/Products";


// GET ALL

export const getProducts = async () => {

    const response = await fetch(API_URL);

    return response.json();
};


// CREATE

export const createProduct = async (
    product
) => {

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(product)
    });

    return response.json();
};


// UPDATE

export const updateProduct = async (
    id,
    product
) => {

    await fetch(`${API_URL}/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(product)
    });
};


// DELETE

export const deleteProduct = async (id) => {

    await fetch(`${API_URL}/${id}`, {

        method: "DELETE"
    });
};