import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApiSlice = createApi({
    reducerPath: 'reviewApiSlice',
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
    tagTypes: ['Review'],
    endpoints: (builder) => ({
        addReview: builder.mutation({
            query: (newReview) => ({
                url: "/review",
                method: "POST",
                body: newReview,
            }),
            invalidatesTags: ['Review'],
        }),
        getProductReviews: builder.query({
            query: (productId) => `/review/product/${productId}`,
            providesTags: ['Review'],
        }),
        updateReview: builder.mutation({
            query: ({ id, ...updatedReview }) => ({
                url: `/review/${id}`,
                method: "PUT",
                body: updatedReview,
            }),
            invalidatesTags: ['Review'],
        }),
        deleteReview: builder.mutation({
            query: (id) => ({
                url: `/review/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Review'],
        }),
    }),
});

export const {
    useAddReviewMutation,
    useGetProductReviewsQuery,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
} = reviewApiSlice;