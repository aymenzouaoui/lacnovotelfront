// Utility functions for the application

/**
 * Format a datetime string to show only the time
 * @param {string} dateString - ISO datetime string
 * @returns {string} Formatted time string (HH:MM)
 */
export const formatTimeOnly = (dateString) => {
  if (!dateString) return "Non défini"

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Non défini"
    }

    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  } catch (error) {
    console.error("Error formatting time:", error)
    return "Non défini"
  }
}

/**
 * Format a full date with time
 * @param {string} dateString - ISO datetime string
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "Non défini"

  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      return "Non défini"
    }

    return date.toLocaleString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting datetime:", error)
    return "Non défini"
  }
}

/**
 * Format a date only (no time)
 * @param {string} dateString - ISO datetime string
 * @returns {string} Formatted date string
 */
export const formatDateOnly = (dateString) => {
  if (!dateString) return "Non défini"

  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      return "Non défini"
    }

    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Non défini"
  }
}
