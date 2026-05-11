import api from './axiosInstance'

export const getHomeApi = () => api.get('/home')
