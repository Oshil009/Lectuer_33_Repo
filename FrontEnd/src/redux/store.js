import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApiSlice } from '../services/userApiSlice'
import { productApiSlice } from '../services/productApiSlice'
import { categoryApiSlice } from '../services/categoryApiSlice'
import { orderApiSlice } from '../services/orderApiSlice'
import { cartApiSlice } from '../services/cartApiSlice'
import { reviewApiSlice } from '../services/reviewApiSlice'
import { roleApiSlice } from '../services/roleApiSlice'

export const store = configureStore({
    reducer: {
        [userApiSlice.reducerPath]: userApiSlice.reducer,
        [productApiSlice.reducerPath]: productApiSlice.reducer,
        [categoryApiSlice.reducerPath]: categoryApiSlice.reducer,
        [orderApiSlice.reducerPath]: orderApiSlice.reducer,
        [cartApiSlice.reducerPath]: cartApiSlice.reducer,
        [reviewApiSlice.reducerPath]: reviewApiSlice.reducer,
        [roleApiSlice.reducerPath]: roleApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userApiSlice.middleware,
            productApiSlice.middleware,
            categoryApiSlice.middleware,
            orderApiSlice.middleware,
            cartApiSlice.middleware,
            reviewApiSlice.middleware,
            roleApiSlice.middleware,
        ),
})

setupListeners(store.dispatch)