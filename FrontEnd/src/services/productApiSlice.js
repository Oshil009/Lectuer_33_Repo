import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApiSlice = createApi({
    reducerPath: 'productApiSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers) => {
            const token = sessionStorage.getItem("token");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => "/products/",
            providesTags: ['Product'],
        }),
        createProduct: builder.mutation({
            query: (newProduct) => ({
                url: "/products/",
                method: "POST",
                body: newProduct,
            }),
            invalidatesTags: ['Product'],
        }),
        getProductsByCategory: builder.query({
            query: (categoryId) => `/products/category/${categoryId}`,
            providesTags: ['Product'],
        }),
        getProductById: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...updatedProduct }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: updatedProduct,
            }),
            invalidatesTags: ['Product'],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Product'],
        }),
    }),
});

export const {
    useGetAllProductsQuery,
    useCreateProductMutation,
    useGetProductsByCategoryQuery,
    useGetProductByIdQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApiSlice;