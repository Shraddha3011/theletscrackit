export default function Tooltip({
    text,
    children,
  }) {
    return (
      <span title={text}>
        {children}
      </span>
    )
  }