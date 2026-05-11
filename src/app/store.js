import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import topicsReducer from './slices/topicsSlice'
import quizReducer from './slices/quizSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topics: topicsReducer,
    quiz: quizReducer,
    ui: uiReducer,
  },
})