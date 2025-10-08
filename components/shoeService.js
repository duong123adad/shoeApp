// Shoe service for API calls

const API_URL = 'https://68e5ee9321dd31f22cc36ef1.mockapi.io/shoes';
//const API_URL = `http://localhost:3000/api/shoes`;
export const shoeService = {
    getAllShoes: async () => {
        try {
            const response = await fetch(API_URL);

            const data = await response.json();
            return {
                data: data,
                status: response.status
            };
        } catch (error) {
            console.error("Lỗi khi tải danh sách sản phẩm:", error);
            throw error;
        }
    },

    createShoe: async (shoeData) => {
        try {
            const bodyData = {
                ...shoeData,
                price: Number(shoeData.price),
                quantity: Number(shoeData.quantity),
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();
            return {
                data: data,
                status: response.status
            };
        } catch (error) {
            console.error("Lỗi khi tạo sản phẩm:", error);
            throw error;
        }
    },

    updateShoe: async (id, shoeData) => {
        try {
            const bodyData = {
                ...shoeData,
                price: Number(shoeData.price),
                quantity: Number(shoeData.quantity),
            };

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();
            return {
                data: data,
                status: response.status
            };
        } catch (error) {
            console.error(`Lỗi khi cập nhật sản phẩm ${id}:`, error);
            throw error;
        }
    },

    deleteShoe: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            const text = await response.text();
            // Debug log to help diagnose delete failures (status + body)
            console.debug(`DELETE ${API_URL}/${id} -> status=${response.status} body=${text}`);
            let data = null;
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    data = null;
                }
            }
            return {
                data: data,
                status: response.status
            };
        } catch (error) {
            console.error(`Lỗi kết nối khi xóa sản phẩm ${id}:`, error);
            throw error;
        }
    }
};