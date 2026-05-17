import api from './axiosInstance'

export const getLessonApi = (slug) => api.get(`/lessons/${slug}`)

export const getLessonCommentsApi = (lessonId) => api.get(`/lessons/${lessonId}/comments`)

export const postLessonCommentApi = (lessonId, body) => api.post(`/lessons/${lessonId}/comments`, { body })

export const likeCommentApi = (commentId) => api.post(`/comments/${commentId}/like`)

export const likeLessonApi = (lessonId, unlike = false) => api.post(`/lessons/${lessonId}/like?unlike=${unlike}`)