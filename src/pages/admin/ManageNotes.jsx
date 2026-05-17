import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import PageWrapper from '../../components/layout/PageWrapper'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

import {
  getNotesApi,
  createNoteApi,
  updateNoteApi,
  deleteNoteApi,
} from '../../api/notesApi'

import { getTopicsApi } from '../../api/topicsApi'

const initialForm = {
  title: '',
  content: '',
  topicId: '',
  difficulty: 'BEGINNER',
}

export default function ManageNotes() {

  const [notes, setNotes] = useState([])
  const [topics, setTopics] = useState([])

  const [form, setForm] = useState(initialForm)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadData = async () => {

    setLoading(true)

    try {

      const [notesRes, topicsRes] = await Promise.all([
        getNotesApi(),
        getTopicsApi(),
      ])

      setNotes(notesRes.data || [])
      setTopics(topicsRes.data || [])

    } catch {

      setError('Unable to load notes.')

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const updateField = (field, value) => {

    setForm(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const resetForm = () => {

    setForm(initialForm)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')
    setSuccess('')

    if (!form.title.trim()) {
      setError('Note title is required.')
      return
    }

    if (!form.topicId) {
      setError('Please select a topic.')
      return
    }

    if (!form.content.trim()) {
      setError('Note content is required.')
      return
    }

    setSaving(true)

    try {

      const payload = {
        title: form.title,
        content: form.content,
        difficulty: form.difficulty,
        topicId: Number(form.topicId),
      }

      if (editingId) {

        await updateNoteApi(editingId, payload)

        setSuccess('Note updated successfully.')

      } else {

        await createNoteApi(payload)

        setSuccess('Note created successfully.')
      }

      resetForm()
      loadData()

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Unable to save note.'
      )

    } finally {

      setSaving(false)
    }
  }

  const handleEdit = (note) => {

    setEditingId(note.id)

    setForm({
      title: note.title || '',
      content: note.content || '',
      topicId: note.topic?.id || '',
      difficulty: note.difficulty || 'BEGINNER',
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async (note) => {

    const confirmed = window.confirm(
      `Delete note "${note.title}" ?`
    )

    if (!confirmed) return

    setDeletingId(note.id)

    try {

      await deleteNoteApi(note.id)

      setSuccess('Note deleted successfully.')

      if (editingId === note.id) {
        resetForm()
      }

      loadData()

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Unable to delete note.'
      )

    } finally {

      setDeletingId(null)
    }
  }

  return (

    <PageWrapper>

      <div className="page-container py-10">

        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">

          <div>

            <Link
              to="/admin"
              className="text-xs text-muted hover:text-brand-400 transition-colors"
            >
              Admin
            </Link>

            <h1 className="font-display font-bold text-3xl text-primary mt-2">
              Manage Notes
            </h1>

            <p className="text-secondary text-sm mt-2">
              Create, edit, and manage learning notes dynamically from PostgreSQL.
            </p>
          </div>

          <Link
            to="/topics"
            className="btn-secondary text-sm"
          >
            View Topics
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-6">

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="card p-5 space-y-4"
          >

            <div>
              <h2 className="font-semibold text-primary">
                {editingId ? 'Edit Note' : 'Create Note'}
              </h2>

              <p className="text-xs text-muted mt-1">
                {editingId
                  ? `Editing note #${editingId}`
                  : 'Saved directly to database'}
              </p>
            </div>

            {(error || success) && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{
                  background: error
                    ? 'rgba(239,68,68,0.1)'
                    : 'rgba(6,217,110,0.12)',

                  border: error
                    ? '1px solid rgba(239,68,68,0.3)'
                    : '1px solid var(--brand-border)',

                  color: error
                    ? '#ef4444'
                    : 'var(--brand)',
                }}
              >
                {error || success}
              </div>
            )}

            <Input
              label="Note Title"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Binary Search"
              required
            />

            <div className="flex flex-col gap-1.5">

              <label className="text-sm font-medium text-secondary">
                Topic
              </label>

              <select
                className="input-field"
                value={form.topicId}
                onChange={(e) => updateField('topicId', e.target.value)}
              >
                <option value="">
                  Select topic
                </option>

                {topics.map(topic => (
                  <option
                    key={topic.id}
                    value={topic.id}
                  >
                    {topic.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">

              <label className="text-sm font-medium text-secondary">
                Difficulty
              </label>

              <select
                className="input-field"
                value={form.difficulty}
                onChange={(e) => updateField('difficulty', e.target.value)}
              >
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">

              <label className="text-sm font-medium text-secondary">
                Content
              </label>

              <textarea
                className="input-field min-h-[260px] resize-y"
                value={form.content}
                onChange={(e) => updateField('content', e.target.value)}
                placeholder="Write markdown notes here..."
              />
            </div>

            <div className="flex gap-3">

              <Button
                type="submit"
                loading={saving}
                className="flex-1"
              >
                {editingId ? 'Update Note' : 'Create Note'}
              </Button>

              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>

          {/* NOTES LIST */}
          <div className="card p-5">

            <div className="flex items-center justify-between mb-4">

              <h2 className="font-semibold text-primary">
                Existing Notes
              </h2>

              <span className="badge badge-brand">
                {notes.length} total
              </span>
            </div>

            {loading ? (

              <div className="space-y-3">
                {[1,2,3].map(item => (
                  <div
                    key={item}
                    className="skeleton h-24 rounded-xl"
                  />
                ))}
              </div>

            ) : notes.length > 0 ? (

              <div className="space-y-4">

                {notes.map(note => (

                  <div
                    key={note.id}
                    className="rounded-2xl border p-5"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex-1 min-w-0">

                        <div className="flex items-center gap-2 flex-wrap mb-2">

                          <h3 className="font-semibold text-primary text-lg">
                            {note.title}
                          </h3>

                          {note.topic && (
                            <span
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                              style={{
                                background: `${note.topic.color || '#06d96e'}15`,
                                color: note.topic.color || '#06d96e',
                                border: `1px solid ${(note.topic.color || '#06d96e')}40`,
                              }}
                            >
                              {note.topic.title}
                            </span>
                          )}

                          <span
                            className="px-2 py-1 rounded-lg text-[10px] font-bold"
                            style={{
                              background: 'rgba(255,255,255,0.04)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {note.difficulty}
                          </span>
                        </div>

                        <p className="text-sm text-secondary line-clamp-3 leading-relaxed">
                          {note.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">

                        <button
                          type="button"
                          onClick={() => handleEdit(note)}
                          className="btn-secondary text-xs"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === note.id}
                          onClick={() => handleDelete(note)}
                          className="text-xs px-3 py-2 rounded-xl font-semibold transition-all disabled:opacity-50"
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            color: '#ef4444',
                          }}
                        >
                          {deletingId === note.id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            ) : (

              <div className="text-center py-20">
                <p className="text-secondary">
                  No notes found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}