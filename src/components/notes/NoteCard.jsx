import { Link } from 'react-router-dom'

export default function NoteCard({ note }) {
  return (
    <Link
      to={`/notes/${note.slug}`}
      style={{
        display: 'block',
        padding: 24,
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.08)',
        textDecoration: 'none',
        color: '#f0eee8',
      }}
    >
      <h3>{note.title}</h3>

      <p style={{
        color: 'rgba(240,238,232,0.5)',
        marginTop: 10,
      }}>
        {note.description}
      </p>
    </Link>
  )
}