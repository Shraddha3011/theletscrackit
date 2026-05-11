import api from './axiosInstance'

export const loginApi   = (creds)    => api.post('/auth/login', creds)
export const signupApi  = (data)     => api.post('/auth/signup', data)
export const getMeApi   = ()         => api.get('/auth/me')
export const forgotPasswordApi = (email) => api.post('/auth/forgot-password', { email })
export const resetPasswordApi  = (data)  => api.post('/auth/reset-password', data)