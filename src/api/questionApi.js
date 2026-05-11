import api from './axiosInstance'

export const getQuestionsApi = (slug) =>
  api.get(`/questions/${slug}`)