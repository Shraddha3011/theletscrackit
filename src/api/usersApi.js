import api from './axiosInstance'

export const getUsersApi = () =>
  api.get('/users')

export const deleteUserApi = (id) =>
  api.delete(`/users/${id}`)

export const updateUserRoleApi = (id, role) =>
  api.put(`/users/${id}/role`, { role })