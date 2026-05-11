import api from './axiosInstance'

export const getNotesApi        = (params) => api.get('/notes', { params })           // { topic, tag, difficulty, page, size }
export const getNoteBySlugApi   = (slug)   => api.get(`/notes/${slug}`)
export const createNoteApi      = (data)   => api.post('/notes', data)
export const updateNoteApi      = (id, d)  => api.put(`/notes/${id}`, d)
export const deleteNoteApi      = (id)     => api.delete(`/notes/${id}`)
export const markNoteCompleteApi= (id)     => api.post(`/progress/note/${id}/complete`)
export const getBookmarksApi    = ()       => api.get('/bookmarks')
export const toggleBookmarkApi  = (id)     => api.post(`/bookmarks/${id}`)
export const getProgressApi     = ()       => api.get('/progress')
export const searchNotes        = (q)      => api.get('/search', { params: { q } })
