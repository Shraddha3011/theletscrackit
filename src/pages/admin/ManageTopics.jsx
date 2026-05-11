import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { createTopicApi, deleteTopicApi, getTopicsApi, updateTopicApi } from '../../api/topicsApi'
import PageWrapper from '../../components/layout/PageWrapper'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const initialForm = {
  title: '',
  slug: '',
  category: '',
  description: '',
  icon: '',
  color: '#06d96e',
  orderIndex: 0,
}

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export default function ManageTopics() {
  const [topics, setTopics] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const nextOrderIndex = useMemo(() => topics.length + 1, [topics.length])

  const loadTopics = () => {
    setLoading(true)
    getTopicsApi()
      .then(({ data }) => setTopics(data || []))
      .catch(() => setError('Unable to load topics. Please check the backend server.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadTopics()
  }, [])

  useEffect(() => {
    if (!slugTouched) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title) }))
    }
  }, [form.title, slugTouched])

  useEffect(() => {
    if (editingId) return
    setForm((prev) => ({ ...prev, orderIndex: nextOrderIndex }))
  }, [editingId, nextOrderIndex])

  const updateField = (field, value) => {
    if (field === 'slug') setSlugTouched(true)
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.title.trim()) {
      setError('Topic title is required.')
      return
    }

    if (!form.slug.trim()) {
      setError('Topic slug is required.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        category: form.category.trim() || 'General',
        description: form.description.trim(),
        icon: form.icon.trim() || form.title.trim(),
        color: form.color,
        orderIndex: Number(form.orderIndex) || nextOrderIndex,
      }

      if (editingId) {
        await updateTopicApi(editingId, payload)
      } else {
        await createTopicApi(payload)
      }

      setSuccess(editingId ? 'Topic updated successfully.' : 'Topic added successfully.')
      setForm({ ...initialForm, orderIndex: nextOrderIndex + 1 })
      setEditingId(null)
      setSlugTouched(false)
      loadTopics()
    } catch (err) {
      const message = err.response?.status === 401 || err.response?.status === 403
        ? 'You must be logged in as an admin to manage topics.'
        : err.response?.data?.message || 'Unable to save topic.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (topic) => {
    setError('')
    setSuccess('')
    setEditingId(topic.id)
    setSlugTouched(true)
    setForm({
      title: topic.title || '',
      slug: topic.slug || '',
      category: topic.category || '',
      description: topic.description || '',
      icon: topic.icon || '',
      color: topic.color || '#06d96e',
      orderIndex: topic.orderIndex || 0,
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setSlugTouched(false)
    setError('')
    setSuccess('')
    setForm({ ...initialForm, orderIndex: nextOrderIndex })
  }

  const handleDelete = async (topic) => {
    const confirmed = window.confirm(`Delete "${topic.title}"? Notes under this topic may also be removed by the database relation.`)
    if (!confirmed) return

    setError('')
    setSuccess('')
    setDeletingId(topic.id)
    try {
      await deleteTopicApi(topic.id)
      setSuccess('Topic deleted successfully.')
      if (editingId === topic.id) handleCancelEdit()
      loadTopics()
    } catch (err) {
      const message = err.response?.status === 401 || err.response?.status === 403
        ? 'You must be logged in as an admin to delete topics.'
        : err.response?.data?.message || 'Unable to delete topic.'
      setError(message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <PageWrapper>
      <div className="page-container py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/admin" className="text-xs text-muted hover:text-brand-400 transition-colors">
              Admin
            </Link>
            <h1 className="font-display font-bold text-3xl text-primary mt-2">
              Manage Topics
            </h1>
            <p className="text-secondary text-sm mt-2">
              Add, edit, and delete learning topics directly in the backend database.
            </p>
          </div>
          <Link to="/topics" className="btn-secondary text-sm">
            View Topics
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          <form onSubmit={handleSubmit} className="card p-5 space-y-4">
            <div>
              <h2 className="font-semibold text-primary">{editingId ? 'Edit Topic' : 'Add Topic'}</h2>
              <p className="text-xs text-muted mt-1">
                {editingId ? `Updating topic #${editingId}` : 'Saved through POST /api/topics'}
              </p>
            </div>

            {(error || success) && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{
                  background: error ? 'rgba(239,68,68,0.1)' : 'rgba(6,217,110,0.12)',
                  border: error ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--brand-border)',
                  color: error ? '#ef4444' : 'var(--brand)',
                }}
              >
                {error || success}
              </div>
            )}

            <Input
              label="Topic title"
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="Spring Boot"
              required
            />

            <Input
              label="Slug"
              value={form.slug}
              onChange={(event) => updateField('slug', slugify(event.target.value))}
              placeholder="spring-boot"
              required
            />

            <Input
              label="Category"
              value={form.category}
              onChange={(event) => updateField('category', event.target.value)}
              placeholder="Backend"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">Description</label>
              <textarea
                className="input-field min-h-[110px] resize-y"
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Learn Spring Boot, REST APIs, JPA, security, and deployment."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Icon text"
                value={form.icon}
                onChange={(event) => updateField('icon', event.target.value)}
                placeholder="Spring"
              />
              <Input
                label="Order"
                type="number"
                min="0"
                value={form.orderIndex}
                onChange={(event) => updateField('orderIndex', event.target.value)}
              />
            </div>

            <div className="flex items-end gap-3">
              <Input
                label="Color"
                type="color"
                value={form.color}
                onChange={(event) => updateField('color', event.target.value)}
                className="flex-1"
              />
              <div
                className="h-11 w-14 rounded-lg border"
                style={{ background: form.color, borderColor: 'var(--border)' }}
                aria-hidden="true"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" loading={saving} className="flex-1">
                {editingId ? 'Update Topic' : 'Add Topic'}
              </Button>
              {editingId && (
                <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-primary">Existing Topics</h2>
              <span className="badge badge-brand">{topics.length} total</span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="skeleton h-16 rounded-xl" />
                ))}
              </div>
            ) : topics.length > 0 ? (
              <div className="space-y-3">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 rounded-xl border flex items-start justify-between gap-4"
                    style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ background: topic.color || '#06d96e' }}
                        />
                        <h3 className="font-semibold text-primary">{topic.title}</h3>
                      </div>
                      <p className="text-xs text-muted mt-1">/{topic.slug}</p>
                      {topic.description && (
                        <p className="text-sm text-secondary mt-2 line-clamp-2">
                          {topic.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(topic)}
                        className="btn-secondary text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(topic)}
                        disabled={deletingId === topic.id}
                        className="text-xs px-3 py-2 rounded-xl font-semibold transition-all disabled:opacity-50"
                        style={{
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.25)',
                          color: '#ef4444',
                        }}
                      >
                        {deletingId === topic.id ? 'Deleting...' : 'Delete'}
                      </button>
                      <Link to={`/topics/${topic.slug}`} className="btn-secondary text-xs">
                        Open
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-secondary">No topics yet. Add the first one from the form.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
