import { useEffect, useState } from 'react'

export default function QuizTimer({
  seconds = 60,
}) {
  const [time, setTime] = useState(seconds)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((p) => p - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      ⏳ {time}s
    </div>
  )
}