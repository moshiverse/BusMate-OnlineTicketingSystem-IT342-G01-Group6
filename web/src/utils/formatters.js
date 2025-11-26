const durFormatter = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 })

export const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined) return '—'
  const totalMinutes = Number(minutes)
  if (Number.isNaN(totalMinutes)) return '—'
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  if (!hours) {
    return `${mins}m`
  }
  if (!mins) {
    return `${hours}h`
  }
  return `${hours}h ${mins}m`
}

export const formatCurrency = (value, { withCents = false } = {}) => {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return '₱0'
  return `₱${numeric.toLocaleString('en-PH', {
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  })}`
}

export const formatDateLabel = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export const formatTimeLabel = (timeString) => {
  if (!timeString) return '—'
  // Backend returns HH:mm or HH:mm:ss
  const [hour = '00', minute = '00'] = timeString.split(':')
  const h = Number(hour)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const normalizedHour = ((h + 11) % 12) + 1
  return `${normalizedHour}:${durFormatter.format(Number(minute))} ${suffix}`
}

export const mergeDateTime = (dateString, timeString) => {
  if (!dateString) return null
  const isoCandidate = timeString ? `${dateString}T${timeString}` : dateString
  const date = new Date(isoCandidate)
  return Number.isNaN(date.getTime()) ? null : date
}


