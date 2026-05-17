import api from './axiosInstance'

export const getCoursesApi = () => api.get('/courses')

export const getCourseBySlugApi = (slug) => api.get(`/courses/${slug}`)