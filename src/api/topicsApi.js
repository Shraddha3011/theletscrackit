import api from './axiosInstance'

export const getTopicsApi      = ()     => api.get('/topics')
export const getTopicBySlugApi = (slug) => api.get(`/topics/${slug}`)
export const createTopicApi    = (data) => api.post('/topics', data)
export const updateTopicApi    = (id, data) => api.put(`/topics/${id}`, data)
export const deleteTopicApi    = (id) => api.delete(`/topics/${id}`)
