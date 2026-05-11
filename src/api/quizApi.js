import api from './axiosInstance'

// GET ALL QUIZZES
export const getQuizzesApi = () =>
  api.get('/quizzes')

// GET SINGLE QUIZ
export const getQuizApi = (topicId) =>
  api.get(`/quizzes?topic=${topicId}`)

// CREATE QUIZ
export const createQuizApi = (data) =>
  api.post('/quizzes', data)

// UPDATE QUIZ
export const updateQuizApi = (id, data) =>
  api.put(`/quizzes/${id}`, data)

// DELETE QUIZ
export const deleteQuizApi = (id) =>
  api.delete(`/quizzes/${id}`)

// SUBMIT QUIZ
export const submitQuizApi = (quizId, answers) =>
  api.post(`/quizzes/${quizId}/submit`, { answers })