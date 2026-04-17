import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roleApiSlice = createApi({
    reducerPath: 'roleApiSlice',
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
    tagTypes: ['Role'],
    endpoints: (builder) => ({
        createRole: builder.mutation({
            query: (newRole) => ({
                url: "/role",
                method: "POST",
                body: newRole,
            }),
            invalidatesTags: ['Role'],
        }),
        getAllRoles: builder.query({
            query: () => "/role",
            providesTags: ['Role'],
        }),
        updateRole: builder.mutation({
            query: ({ id, ...updatedRole }) => ({
                url: `/role/${id}`,
                method: "PUT",
                body: updatedRole,
            }),
            invalidatesTags: ['Role'],
        }),
        deleteRole: builder.mutation({
            query: (id) => ({
                url: `/role/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Role'],
        }),
    }),
});

export const {
    useCreateRoleMutation,
    useGetAllRolesQuery,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
} = roleApiSlice;