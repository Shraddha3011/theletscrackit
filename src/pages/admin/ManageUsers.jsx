import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import PageWrapper from '../../components/layout/PageWrapper'
import Input from '../../components/common/Input'

import {
  getUsersApi,
  deleteUserApi,
  updateUserRoleApi,
} from '../../api/usersApi'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  const loadUsers = async () => {
    try {
      setLoading(true)

      const { data } = await getUsersApi()

      setUsers(Array.isArray(data) ? data : [])
    } catch {
      setError('Unable to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter(
      user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    )
  }, [users, search])

  const handleDelete = async user => {
    const confirmed = window.confirm(
      `Delete ${user.name}?`
    )

    if (!confirmed) return

    try {
      setActionLoading(user.id)

      await deleteUserApi(user.id)

      setUsers(prev =>
        prev.filter(u => u.id !== user.id)
      )
    } catch {
      alert('Unable to delete user.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRoleChange = async (user, role) => {
    try {
      setActionLoading(user.id)

      await updateUserRoleApi(user.id, role)

      loadUsers()
    } catch {
      alert('Unable to update role.')
    } finally {
      setActionLoading(null)
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

            <h1 className="font-display font-bold text-4xl text-primary mt-2">
              Manage Users
            </h1>

            <p className="text-secondary text-sm mt-2">
              Manage all registered platform users.
            </p>
          </div>

          <div
            className="
              px-4 py-2 rounded-2xl
              text-sm font-semibold
            "
            style={{
              background: 'rgba(6,217,110,0.08)',
              border: '1px solid rgba(6,217,110,0.18)',
              color: 'var(--brand)',
            }}
          >
            {users.length} Users
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div
            className="mb-5 p-4 rounded-2xl text-sm"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#ef4444',
            }}
          >
            {error}
          </div>
        )}

        {/* MAIN CARD */}
        <div
          className="rounded-[30px] overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',

            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >

          {/* TOP BAR */}
          <div
            className="
              p-5 border-b
              flex items-center justify-between
              gap-4 flex-wrap
            "
            style={{
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <div>
              <h2 className="font-semibold text-primary">
                Platform Users
              </h2>

              <p
                className="text-sm mt-1"
                style={{
                  color: 'var(--text-muted)',
                }}
              >
                Search and manage users.
              </p>
            </div>

            <div className="w-full sm:w-[320px]">
              <Input
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr
                  style={{
                    borderBottom:
                      '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {[
                    'User',
                    'Role',
                    'XP',
                    'Streak',
                    'Actions',
                  ].map(head => (
                    <th
                      key={head}
                      className="
                        text-left
                        px-6 py-4
                        text-xs
                        uppercase
                        tracking-[0.18em]
                        font-bold
                      "
                      style={{
                        color: 'var(--text-muted)',
                      }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td
                        colSpan={5}
                        className="px-6 py-5"
                      >
                        <div className="skeleton h-16 rounded-2xl" />
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom:
                          '1px solid rgba(255,255,255,0.04)',
                      }}
                    >

                      {/* USER */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">

                          <div
                            className="
                              w-12 h-12 rounded-2xl
                              flex items-center justify-center
                              font-bold text-sm
                            "
                            style={{
                              background:
                                'rgba(255,255,255,0.05)',

                              border:
                                '1px solid rgba(255,255,255,0.08)',

                              color: 'white',
                            }}
                          >
                            {user.name
                              ?.split(' ')
                              ?.map(n => n[0])
                              ?.join('')}
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary">
                              {user.name}
                            </h3>

                            <p
                              className="text-sm mt-1"
                              style={{
                                color: 'var(--text-muted)',
                              }}
                            >
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-5">
                        <select
                          value={user.role}
                          disabled={actionLoading === user.id}
                          onChange={e =>
                            handleRoleChange(
                              user,
                              e.target.value
                            )
                          }
                          className="
                            px-3 py-2 rounded-xl
                            text-sm outline-none
                          "
                          style={{
                            background:
                              'rgba(255,255,255,0.05)',

                            border:
                              '1px solid rgba(255,255,255,0.08)',

                            color: 'white',
                          }}
                        >
                          <option value="STUDENT">
                            STUDENT
                          </option>

                          <option value="ADMIN">
                            ADMIN
                          </option>
                        </select>
                      </td>

                      {/* XP */}
                      <td className="px-6 py-5">
                        <span
                          className="font-semibold"
                          style={{
                            color: '#06d96e',
                          }}
                        >
                          {user.xp || 0}
                        </span>
                      </td>

                      {/* STREAK */}
                      <td className="px-6 py-5">
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1
                            font-semibold
                          "
                          style={{
                            color: '#fb923c',
                          }}
                        >
                          🔥 {user.streak || 0}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">
                        <button
                          onClick={() =>
                            handleDelete(user)
                          }
                          disabled={
                            actionLoading === user.id
                          }
                          className="
                            text-xs
                            px-3 py-2
                            rounded-xl
                            font-semibold
                            transition-all
                          "
                          style={{
                            background:
                              'rgba(239,68,68,0.1)',

                            border:
                              '1px solid rgba(239,68,68,0.25)',

                            color: '#ef4444',
                          }}
                        >
                          {actionLoading === user.id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-20"
                    >
                      <p
                        style={{
                          color: 'var(--text-muted)',
                        }}
                      >
                        No users found.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}