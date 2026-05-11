import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getTopicsApi, getTopicBySlugApi } from '../../api/topicsApi'

export const fetchTopics = createAsyncThunk('topics/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getTopicsApi()
    return data
  } catch (e) {
    return rejectWithValue(e.response?.data?.message)
  }
})

export const fetchTopicBySlug = createAsyncThunk('topics/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    const { data } = await getTopicBySlugApi(slug)
    return data
  } catch (e) {
    return rejectWithValue(e.response?.data?.message)
  }
})

const topicsSlice = createSlice({
  name: 'topics',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => { state.current = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending,         (s) => { s.loading = true })
      .addCase(fetchTopics.fulfilled,       (s, a) => { s.loading = false; s.list = a.payload })
      .addCase(fetchTopics.rejected,        (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchTopicBySlug.pending,    (s) => { s.loading = true })
      .addCase(fetchTopicBySlug.fulfilled,  (s, a) => { s.loading = false; s.current = a.payload })
      .addCase(fetchTopicBySlug.rejected,   (s, a) => { s.loading = false; s.error = a.payload })
  },
})

export const { clearCurrent } = topicsSlice.actions
export default topicsSlice.reducer