import LikeButton from './LikeButton'

export default function CommentCard({
  comment,
}) {
  if (!comment) return null

  const username =
    comment?.user?.username ||
    comment?.username ||
    'Anonymous'

  return (
    <div
      style={{
        padding: 18,
        marginBottom: 16,
        borderRadius: 16,

        border:
          '1px solid rgba(255,255,255,0.08)',

        background:
          'rgba(255,255,255,0.03)',
      }}
    >
      {/* USER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',

            background:
              'linear-gradient(135deg,#00dc82,#00b8ff)',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            color: '#04130c',
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          {username.charAt(0).toUpperCase()}
        </div>

        <div>
          <p
            style={{
              color: '#f8fafc',
              fontWeight: 700,
              marginBottom: 2,
            }}
          >
            {username}
          </p>

          <p
            style={{
              color:
                'rgba(240,238,232,0.5)',

              fontSize: 12,
            }}
          >
            Community Member
          </p>
        </div>
      </div>

      {/* COMMENT */}
      <p
        style={{
          color:
            'rgba(240,238,232,0.72)',

          lineHeight: 1.8,

          fontSize: 15,

          marginBottom: 18,
        }}
      >
        {comment?.body || ''}
      </p>

      {/* LIKE BUTTON */}
      <LikeButton
        commentId={comment.id}
        initialLikes={
          comment.likes || 0
        }
      />
    </div>
  )
}