export default function QuickRevision({
    points = [],
  }) {
    return (
      <div style={{
        marginTop: 30,
        padding: 24,
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <h2>Quick Revision ⚡</h2>
  
        <ul style={{ marginTop: 16 }}>
          {points.map((p) => (
            <li
              key={p}
              style={{ marginBottom: 10 }}
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    )
  }