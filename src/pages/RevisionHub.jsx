export default function RevisionHub() {
    const items = [
      'React Hooks',
      'JavaScript Closures',
      'Binary Search',
      'DBMS Normalization',
    ]
  
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 40 }}>
        <h1>Quick Revision 🔄</h1>
  
        <div style={{ marginTop: 30 }}>
          {items.map((i) => (
            <div
              key={i}
              style={{
                padding: 18,
                marginBottom: 14,
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {i}
            </div>
          ))}
        </div>
      </div>
    )
  }