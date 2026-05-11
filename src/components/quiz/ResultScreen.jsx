export default function ResultScreen({
    score,
    total,
  }) {
    return (
      <div style={{
        textAlign: 'center',
        padding: 40,
      }}>
        <h1>Quiz Completed 🎉</h1>
  
        <h2 style={{ marginTop: 20 }}>
          {score} / {total}
        </h2>
      </div>
    )
  }