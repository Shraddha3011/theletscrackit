import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit'

import {
  loginApi,
  signupApi,
  getMeApi
} from '../../api/authApi'

/* =========================
   LOGIN
========================= */

export const login = createAsyncThunk(
  'auth/login',

  async (creds, { rejectWithValue }) => {

    try {

      const { data } =
        await loginApi(creds)

      localStorage.setItem(
        'token',
        data.token
      )

      return data

    } catch (e) {

      return rejectWithValue(

        e.response?.data?.message ||

        'Login failed'
      )
    }
  }
)

/* =========================
   SIGNUP
========================= */

export const signup = createAsyncThunk(
  'auth/signup',

  async (payload, { rejectWithValue }) => {

    try {

      const { data } =
        await signupApi(payload)

      return data

    } catch (e) {

      return rejectWithValue(

        e.response?.data?.message ||

        'Signup failed'
      )
    }
  }
)

/* =========================
   GET ME
========================= */

export const getMe = createAsyncThunk(
  'auth/getMe',

  async (_, { rejectWithValue }) => {

    try {

      const { data } =
        await getMeApi()

      return data

    } catch (e) {

      return rejectWithValue(

        e.response?.data?.message ||

        'Unauthorized'
      )
    }
  }
)

/* =========================
   SLICE
========================= */

const authSlice = createSlice({

  name: 'auth',

  initialState: {

    user: null,

    token:
      localStorage.getItem('token'),

    isAuthenticated:
      !!localStorage.getItem('token'),

    loading: false,

    error: null,
  },

  reducers: {

    logout: (state) => {

      state.user = null

      state.token = null

      state.isAuthenticated = false

      localStorage.removeItem('token')
    },

    clearError: (state) => {

      state.error = null
    },
  },

  extraReducers: (builder) => {

    builder

      /* =========================
         LOGIN
      ========================= */

      .addCase(login.pending, (state) => {

        state.loading = true

        state.error = null
      })

      .addCase(login.fulfilled, (state, action) => {

        state.loading = false

        state.user = action.payload

        state.token =
          action.payload.token

        state.isAuthenticated = true
      })

      .addCase(login.rejected, (state, action) => {

        state.loading = false

        state.error = action.payload
      })

      /* =========================
         SIGNUP
      ========================= */

      .addCase(signup.pending, (state) => {

        state.loading = true

        state.error = null
      })

      .addCase(signup.fulfilled, (state) => {

        state.loading = false
      })

      .addCase(signup.rejected, (state, action) => {

        state.loading = false

        state.error = action.payload
      })

      /* =========================
         GET ME
      ========================= */

      .addCase(getMe.fulfilled, (state, action) => {

        state.user = action.payload

        state.isAuthenticated = true
      })

      .addCase(getMe.rejected, (state) => {

        state.user = null

        state.token = null

        state.isAuthenticated = false

        localStorage.removeItem('token')
      })
  },
})

export const {
  logout,
  clearError
} = authSlice.actions

export default authSlice.reducer