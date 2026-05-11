import { useState } from 'react'

import {
  likeCommentApi,
} from '../../api/communityApi'

export default function LikeButton({
  commentId,
  initialLikes = 0,
}) {
  const [liked, setLiked] =
    useState(false)

  const [likes, setLikes] =
    useState(initialLikes)

  const handleLike = async () => {
    try {
      await likeCommentApi(commentId)

      if (!liked) {
        setLikes((prev) => prev + 1)
      } else {
        setLikes((prev) =>
          Math.max(0, prev - 1)
        )
      }

      setLiked(!liked)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <button
      onClick={handleLike}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,

        border: 'none',

        background: liked
          ? 'rgba(255,80,120,0.15)'
          : 'rgba(255,255,255,0.05)',

        color: liked
          ? '#ff4d6d'
          : '#f0eee8',

        padding: '10px 14px',

        borderRadius: 12,

        cursor: 'pointer',

        fontWeight: 600,
      }}
    >
      <span>
        {liked ? '❤️' : '🤍'}
      </span>

      <span>
        {liked ? 'Liked' : 'Like'}
      </span>

      <span
        style={{
          opacity: 0.7,
          fontSize: 13,
        }}
      >
        ({likes})
      </span>
    </button>
  )
}