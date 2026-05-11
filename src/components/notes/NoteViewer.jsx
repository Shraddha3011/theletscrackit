import ReactMarkdown from 'react-markdown'
import CodeBlock from './CodeBlock'

export default function NoteViewer({
  content,
}) {
  return (
    <ReactMarkdown
      components={{
        code({ inline, className, children }) {
          const match = /language-(\w+)/.exec(className || '')

          return !inline && match ? (
            <CodeBlock
              language={match[1]}
              code={String(children)}
            />
          ) : (
            <code>{children}</code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}