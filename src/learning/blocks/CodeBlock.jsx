export default function CodeBlock({
  data,
}) {

  return (

    <div
      className="
        rounded-[32px]
        overflow-hidden
        border
        border-white/10
      "
    >

      {/* top */}

      <div
        className="
          flex
          items-center
          justify-between
          px-6
          py-4
          border-b
          border-white/10
          bg-[#111827]
        "
      >

        <p className="text-sm text-slate-400">

          {data.language}

        </p>

      </div>

      {/* code */}

      <pre
        className="
          overflow-x-auto
          bg-[#0b1020]
          p-8
          text-sm
          leading-8
          text-emerald-300
        "
      >

        <code>

          {data.code}

        </code>

      </pre>

    </div>
  )
}