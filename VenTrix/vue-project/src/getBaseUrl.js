import axios from '@/axios'

export default function getBaseUrl() {
  return axios.defaults.baseURL
}