import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApiSlice = createApi({
    reducerPath: 'categoryApiSlice',
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
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getAllCategories: builder.query({
            query: () => "/category/",
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation({
            query: (newCategory) => ({
                url: "/category/",
                method: "POST",
                body: newCategory,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...updatedCategory }) => ({
                url: `/category/${id}`,
                method: "PUT",
                body: updatedCategory,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApiSlice;
