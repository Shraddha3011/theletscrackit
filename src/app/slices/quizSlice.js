import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getQuizApi, submitQuizApi } from '../../api/quizApi'

export const fetchQuiz = createAsyncThunk('quiz/fetch', async (quizId, { rejectWithValue }) => {
  try {
    const { data } = await getQuizApi(quizId)
    return data
  } catch (e) {
    return rejectWithValue(e.response?.data?.message)
  }
})

export const submitQuiz = createAsyncThunk('quiz/submit', async ({ quizId, answers }, { rejectWithValue }) => {
  try {
    const { data } = await submitQuizApi(quizId, answers)
    return data
  } catch (e) {
    return rejectWithValue(e.response?.data?.message)
  }
})

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    current: null,
    result: null,
    answers: {},
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    setAnswer: (state, action) => {
      const { questionId, answer } = action.payload
      state.answers[questionId] = answer
    },
    resetQuiz: (state) => {
      state.current = null
      state.result = null
      state.answers = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuiz.pending,    (s) => { s.loading = true; s.error = null })
      .addCase(fetchQuiz.fulfilled,  (s, a) => { s.loading = false; s.current = a.payload })
      .addCase(fetchQuiz.rejected,   (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(submitQuiz.pending,   (s) => { s.submitting = true })
      .addCase(submitQuiz.fulfilled, (s, a) => { s.submitting = false; s.result = a.payload })
      .addCase(submitQuiz.rejected,  (s, a) => { s.submitting = false; s.error = a.payload })
  },
})

export const { setAnswer, resetQuiz } = quizSlice.actions
export default quizSlice.reducer