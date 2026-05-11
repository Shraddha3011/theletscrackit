export default function RecentTopics({
    topics = [],
  }) {
    return (
      <div>
        <h3>Recent Topics</h3>
  
        {topics.map((t) => (
          <div key={t.id}>
            {t.title}
          </div>
        ))}
      </div>
    )
  }