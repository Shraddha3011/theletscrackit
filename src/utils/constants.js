export const DIFFICULTY_COLORS = {
  BEGINNER:     { bg: 'rgba(6,217,110,0.1)',   text: '#06d96e',  border: 'rgba(6,217,110,0.25)' },
  INTERMEDIATE: { bg: 'rgba(249,115,22,0.1)',  text: '#f97316',  border: 'rgba(249,115,22,0.25)' },
  ADVANCED:     { bg: 'rgba(239,68,68,0.1)',   text: '#ef4444',  border: 'rgba(239,68,68,0.25)' },
}

export const TOPIC_COLORS = {
  dsa:                { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  react:              { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  javascript:         { color: '#eab308', bg: 'rgba(234,179,8,0.1)' },
  java:               { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  python:             { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  dbms:               { color: '#06d96e', bg: 'rgba(6,217,110,0.1)' },
  'operating-system': { color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  'computer-networks':{ color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  'system-design':    { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
}

export const XP_LEVELS = [
  { level: 1, min: 0,    max: 100,  label: 'Newbie' },
  { level: 2, min: 100,  max: 300,  label: 'Explorer' },
  { level: 3, min: 300,  max: 600,  label: 'Coder' },
  { level: 4, min: 600,  max: 1000, label: 'Builder' },
  { level: 5, min: 1000, max: 1500, label: 'Hacker' },
  { level: 6, min: 1500, max: 2200, label: 'Architect' },
  { level: 7, min: 2200, max: 3000, label: 'Master' },
  { level: 8, min: 3000, max: 4000, label: 'Legend' },
]

export const getLevel = (xp) => {
  return XP_LEVELS.findLast((l) => xp >= l.min) || XP_LEVELS[0]
}

export const getXpProgress = (xp) => {
  const lvl = getLevel(xp)
  return ((xp - lvl.min) / (lvl.max - lvl.min)) * 100
}