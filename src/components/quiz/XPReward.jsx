export default function XPReward({
    xp = 0,
  }) {
    return (
      <div style={{
        padding: 20,
        borderRadius: 12,
        background: 'rgba(0,220,130,0.08)',
        color: '#00dc82',
        fontWeight: 700,
      }}>
        +{xp} XP Earned 🚀
      </div>
    )
  }