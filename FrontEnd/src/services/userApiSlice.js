import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApiSlice = createApi({
    reducerPath: 'userApiSlice',
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
    refetchOnFocus: true,
    tagTypes: ['User', 'Profile'],
    endpoints: (builder) => ({
        createUser: builder.mutation({
            query: (newUser) => ({
                url: "/user/register",
                method: "POST",
                body: newUser,
            }),
            invalidatesTags: ['User'],
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: "/user/login",
                method: "POST",
                body: credentials,
            }),
        }),
        getProfile: builder.query({
            query: () => "/user/profile",
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation({
            query: (updatedData) => ({
                url: "/user/profile",
                method: "PUT",
                body: updatedData,
            }),
            invalidatesTags: ['Profile'],
        }),
        changePassword: builder.mutation({
            query: (passwords) => ({
                url: "/user/change-password",
                method: "PUT",
                body: passwords,
            }),
        }),
        toggleFavorite: builder.mutation({
            query: (productId) => ({
                url: `/user/favorite/${productId}`,
                method: "POST",
            }),
            invalidatesTags: ['Profile'],
        }),
        getAllUsers: builder.query({
            query: () => "/user/",
            providesTags: ['User'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/user/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useCreateUserMutation,
    useLoginMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useToggleFavoriteMutation,
    useGetAllUsersQuery,
    useDeleteUserMutation,
} = userApiSlice;