import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApiSlice = createApi({
    reducerPath: 'orderApiSlice',
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
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: "/order/",
                method: "POST",
                body: orderData,
            }),
            invalidatesTags: ['Order'],
        }),
        getMyOrders: builder.query({
            query: () => "/order/my",
            providesTags: ['Order'],
        }),
        getAllOrders: builder.query({
            query: () => "/order/",
            providesTags: ['Order'],
        }),
        getOrderById: builder.query({
            query: (id) => `/order/${id}`,
            providesTags: ['Order'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/order/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ['Order'],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetAllOrdersQuery,
    useGetOrderByIdQuery,
    useUpdateOrderStatusMutation,
} = orderApiSlice;