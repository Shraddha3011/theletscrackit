import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchNotes } from '../api/notesApi'
import { useDebounce } from '../hooks/useDebounce'
import PageWrapper from '../components/layout/PageWrapper'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const debounced = useDebounce(query)

  useEffect(() => {
    if (debounced.trim()) {
      setSearchParams({ q: debounced.trim() }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }, [debounced, setSearchParams])

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    searchNotes(debounced)
      .then(({ data }) => setResults(data.data || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [debounced])

  return (
    <PageWrapper>
      <div className="page-container py-10">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">Find anything</p>
          <h1 className="font-display font-bold text-4xl text-primary">Search</h1>

          <input
            placeholder="Search notes, topics, or interview prep..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field mt-6"
          />

          <div className="mt-8 space-y-3">
            {loading ? (
              <div className="card p-6 text-secondary">Searching...</div>
            ) : results.length > 0 ? (
              results.map((r) => (
                <Link
                  key={r.id}
                  to={r.slug ? `/notes/${r.slug}` : '/topics'}
                  className="card p-5 block group"
                >
                  <h3 className="font-semibold text-primary group-hover:text-brand-400 transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-sm text-secondary mt-2">
                    {r.description || r.excerpt || 'Open result'}
                  </p>
                </Link>
              ))
            ) : (
              <div className="card p-8 text-center">
                <p className="text-secondary">
                  {query.trim() ? 'No results found.' : 'Start typing to search LetsCrackIT.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
