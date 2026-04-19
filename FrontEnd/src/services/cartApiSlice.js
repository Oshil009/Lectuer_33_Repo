import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cartApiSlice = createApi({
    reducerPath: 'cartApiSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers) => {
            const token = sessionStorage.getItem('token');
            if (token) headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Cart'],
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => '/cart/',
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation({
            query: (productData) => ({ url: '/cart/add', method: 'POST', body: productData }),
            invalidatesTags: ['Cart'],
        }),
        removeFromCart: builder.mutation({
            query: (productData) => ({ url: '/cart/remove', method: 'POST', body: productData }),
            invalidatesTags: ['Cart'],
        }),
        clearCart: builder.mutation({
            query: () => ({ url: '/cart/clear', method: 'DELETE' }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
} = cartApiSlice;
