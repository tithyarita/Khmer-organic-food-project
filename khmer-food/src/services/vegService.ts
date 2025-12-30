import api from './api'

export const getProducts = () => {
  return api.get('/vegetables')
}
