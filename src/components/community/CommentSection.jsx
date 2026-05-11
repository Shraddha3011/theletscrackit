import { useEffect, useState } from 'react'

import {
  getCommentsApi,
  postCommentApi,
  likeCommentApi,
} from '../../api/communityApi'

export default function CommentSection({
  noteId,
}) {
  const [comments, setComments] =
    useState([])

  const [commentText, setCommentText] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  /* FETCH COMMENTS */
  useEffect(() => {
    if (!noteId) return

    fetchComments()
  }, [noteId])

  const fetchComments = async () => {
    try {
      const { data } =
        await getCommentsApi(noteId)

      setComments(data || [])
    } catch (err) {
      console.error(err)
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  /* POST COMMENT */
  const handleComment = async () => {
    if (!commentText.trim()) return

    try {
      await postCommentApi(
        noteId,
        commentText
      )

      setCommentText('')

      fetchComments()
    } catch (err) {
      console.error(err)
    }
  }

  /* LIKE */
  const handleLike = async (id) => {
    try {
      await likeCommentApi(id)

      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                likes:
                  (c.likes || 0) + 1,
              }
            : c
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div
      style={{
        marginTop: 60,
      }}
    >
      {/* TITLE */}
      <h2
        style={{
          fontSize: 28,
          fontWeight: 800,
          marginBottom: 24,
          color: '#f8fafc',
        }}
      >
        Discussion
      </h2>

      {/* ADD COMMENT */}
      <div
        style={{
          padding: 20,
          borderRadius: 20,

          background:
            'rgba(255,255,255,0.03)',

          border:
            '1px solid rgba(255,255,255,0.08)',

          marginBottom: 28,
        }}
      >
        <textarea
          value={commentText}
          onChange={(e) =>
            setCommentText(
              e.target.value
            )
          }
          placeholder="Write a comment..."

          style={{
            width: '100%',
            minHeight: 120,

            borderRadius: 14,

            border:
              '1px solid rgba(255,255,255,0.08)',

            background:
              'rgba(255,255,255,0.03)',

            padding: 16,

            color: '#f8fafc',

            outline: 'none',

            resize: 'vertical',

            marginBottom: 16,
          }}
        />

        <button
          onClick={handleComment}
          style={{
            padding: '12px 20px',

            borderRadius: 12,

            border: 'none',

            background: '#00dc82',

            color: '#04130c',

            fontWeight: 700,

            cursor: 'pointer',
          }}
        >
          Post Comment
        </button>
      </div>

      {/* COMMENTS */}
      {loading ? (
        <p
          style={{
            color:
              'rgba(240,238,232,0.6)',
          }}
        >
          Loading comments...
        </p>
      ) : comments.length === 0 ? (
        <div
          style={{
            padding: 30,
            textAlign: 'center',

            borderRadius: 20,

            background:
              'rgba(255,255,255,0.03)',

            border:
              '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p
            style={{
              color:
                'rgba(240,238,232,0.65)',
            }}
          >
            No comments yet.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {comments.map((comment) => {
            const username =
              comment?.user
                ?.username ||
              comment?.username ||
              'Anonymous'

            return (
              <div
                key={comment.id}
                style={{
                  padding: 20,

                  borderRadius: 20,

                  background:
                    'rgba(255,255,255,0.03)',

                  border:
                    '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* USER */}
                <div
                  style={{
                    display: 'flex',
                    alignItems:
                      'center',

                    gap: 12,

                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,

                      borderRadius:
                        '50%',

                      background:
                        'linear-gradient(135deg,#00dc82,#00b8ff)',

                      display: 'flex',

                      alignItems:
                        'center',

                      justifyContent:
                        'center',

                      color: '#04130c',

                      fontWeight: 800,
                    }}
                  >
                    {username
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p
                      style={{
                        color:
                          '#f8fafc',

                        fontWeight: 700,
                      }}
                    >
                      {username}
                    </p>

                    <p
                      style={{
                        fontSize: 12,

                        color:
                          'rgba(240,238,232,0.5)',
                      }}
                    >
                      Community Member
                    </p>
                  </div>
                </div>

                {/* BODY */}
                <p
                  style={{
                    color:
                      'rgba(240,238,232,0.75)',

                    lineHeight: 1.8,

                    marginBottom: 18,
                  }}
                >
                  {comment.body}
                </p>

                {/* LIKE */}
                <button
                  onClick={() =>
                    handleLike(
                      comment.id
                    )
                  }
                  style={{
                    border: 'none',

                    background:
                      'rgba(255,255,255,0.05)',

                    color: '#f8fafc',

                    padding:
                      '10px 16px',

                    borderRadius: 12,

                    cursor: 'pointer',

                    fontWeight: 600,
                  }}
                >
                  ❤️ Like (
                  {comment.likes || 0})
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}