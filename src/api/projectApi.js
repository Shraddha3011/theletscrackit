import api from './axiosInstance'

export const getProjectsApi = () => api.get('/projects')
export const getProjectBySlugApi = (slug) => api.get(`/projects/${slug}`)
export const completeStepApi = (stepId) => api.post(`/projects/steps/${stepId}/complete`)
