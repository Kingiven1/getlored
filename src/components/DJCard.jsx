import React from 'react'

export default function DJCard({ dj, locked = false, onLockedClick, showGenres = false }) {
  const instagramUrl = dj.instagram_handle?.startsWith('http')
    ? dj.instagram_handle
    : `https://instagram.com/${dj.instagram_handle?.replace('@', '')}`

  const s = {
    card: {
      borderRadius: '12px',
      padding: '16px',
      backgroundColor: '#F8F6F3',
      marginBottom: '12px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    name: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a1a1a',
      margin: '0 0 6px 0',
    },
    event: {
      fontSize: '14px',
      color: '#666',
      margin: '0 0 12px 0',
      fontStyle: 'italic',
    },
    genreRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginBottom: '12px',
    },
    genreTag: {
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#B07D62',
      border: '1px solid #E8D5C4',
      backgroundColor: '#FDF8F5',
      padding: '4px 8px',
      borderRadius: '2px',
    },
    instagramBtn: {
      padding: '8px 12px',
      borderRadius: '6px',
      backgroundColor: '#FDF8F5',
      border: '1px solid #E8D5C4',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      color: '#d04040',
      textDecoration: 'none',
      display: 'inline-block',
    },
    lockedBtn: {
      padding: '8px 12px',
      borderRadius: '6px',
      backgroundColor: '#F5F5F5',
      border: '1px solid #ddd',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      color: '#999',
      fontFamily: 'inherit',
    },
  }

  return (
    <div style={s.card}>
      <p style={s.name}>{dj.name}</p>
      <p style={s.event}>🎵 {dj.event_name}</p>

      {showGenres && dj.genres && dj.genres.length > 0 && (
        <div style={s.genreRow}>
          {dj.genres.map((genre, i) => (
            <span key={i} style={s.genreTag}>{genre}</span>
          ))}
        </div>
      )}

      {dj.instagram_handle && (
        locked ? (
          <button type="button" onClick={onLockedClick} style={s.lockedBtn}>
            🔒 Follow
          </button>
        ) : (
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={s.instagramBtn}>
            📸 Instagram
          </a>
        )
      )}
    </div>
  )
}
