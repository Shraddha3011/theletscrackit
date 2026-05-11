import api from './axiosInstance'

export const getCommentsApi = (noteId) =>
  api.get(`/notes/${noteId}/comments`)

export const postCommentApi = (
  noteId,
  body
) =>
  api.post(
    `/notes/${noteId}/comments`,
    { body }
  )

export const deleteCommentApi = (
  id
) =>
  api.delete(`/comments/${id}`)

export const likeCommentApi = (
  id
) =>
  api.post(`/comments/${id}/like`)

export const getLeaderboardApi =
  () => api.get('/leaderboard')

export const searchApi = (q) =>
  api.get('/search', {
    params: { q },
  })