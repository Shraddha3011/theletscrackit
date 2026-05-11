import { useEffect, useState } from 'react'
import api from '../api/axiosInstance'

export function useProgress() {
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/progress')
      .then(({ data }) => {
        setProgress(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  return {
    progress,
    loading,
  }
}