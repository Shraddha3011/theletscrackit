export default function QuizCard({
    question,
    options = [],
  }) {
    return (
      <div style={{
        padding: 24,
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <h2>{question}</h2>
  
        <div style={{ marginTop: 20 }}>
          {options.map((o) => (
            <button
              key={o}
              style={{
                display: 'block',
                width: '100%',
                padding: 12,
                marginBottom: 10,
              }}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    )
  }