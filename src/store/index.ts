import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import authReducer from "./slices/authSlice"
import wellnessReducer from "./slices/wellnessSlice"
import uiReducer from "./slices/uiSlice"

const wellnessPersistConfig = {
  key: "wellness",
  storage,
  whitelist: ["logs"], // Only persist the logs array
}

const persistedWellnessReducer = persistReducer(wellnessPersistConfig, wellnessReducer)

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wellness: persistedWellnessReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
