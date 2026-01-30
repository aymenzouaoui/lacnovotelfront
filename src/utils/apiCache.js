/**
 * API Cache Utility
 * 
 * Cache les réponses API dans localStorage pour améliorer
 * la performance et réduire les appels réseau redondants
 */

const CACHE_PREFIX = "novotel_cache_"
const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes par défaut

/**
 * Génère une clé de cache unique
 */
const getCacheKey = (endpoint) => {
  return `${CACHE_PREFIX}${endpoint.replace(/\//g, "_")}`
}

/**
 * Vérifie si une entrée de cache est encore valide
 */
const isCacheValid = (cacheEntry) => {
  if (!cacheEntry) return false
  const { timestamp, ttl } = cacheEntry
  return Date.now() - timestamp < ttl
}

/**
 * Récupère une entrée du cache
 */
export const getFromCache = (endpoint) => {
  try {
    const cacheKey = getCacheKey(endpoint)
    const cached = localStorage.getItem(cacheKey)
    
    if (!cached) return null
    
    const cacheEntry = JSON.parse(cached)
    
    if (isCacheValid(cacheEntry)) {
      return cacheEntry.data
    }
    
    // Cache expiré, le supprimer
    localStorage.removeItem(cacheKey)
    return null
  } catch (error) {
    console.warn("Cache read error:", error)
    return null
  }
}

/**
 * Sauvegarde une entrée dans le cache
 */
export const saveToCache = (endpoint, data, ttl = DEFAULT_TTL) => {
  try {
    const cacheKey = getCacheKey(endpoint)
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl
    }
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry))
  } catch (error) {
    console.warn("Cache write error:", error)
    // Si localStorage est plein, nettoyer les anciennes entrées
    if (error.name === "QuotaExceededError") {
      clearOldCache()
    }
  }
}

/**
 * Supprime une entrée du cache
 */
export const removeFromCache = (endpoint) => {
  try {
    const cacheKey = getCacheKey(endpoint)
    localStorage.removeItem(cacheKey)
  } catch (error) {
    console.warn("Cache remove error:", error)
  }
}

/**
 * Nettoie toutes les entrées de cache expirées
 */
export const clearExpiredCache = () => {
  try {
    const keysToRemove = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key)
          if (cached) {
            const cacheEntry = JSON.parse(cached)
            if (!isCacheValid(cacheEntry)) {
              keysToRemove.push(key)
            }
          }
        } catch {
          keysToRemove.push(key)
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    return keysToRemove.length
  } catch (error) {
    console.warn("Cache cleanup error:", error)
    return 0
  }
}

/**
 * Nettoie les anciennes entrées de cache (plus vieilles d'abord)
 */
export const clearOldCache = () => {
  try {
    const cacheEntries = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key)
          if (cached) {
            const cacheEntry = JSON.parse(cached)
            cacheEntries.push({ key, timestamp: cacheEntry.timestamp })
          }
        } catch {
          // Entrée corrompue, la supprimer
          localStorage.removeItem(key)
        }
      }
    }
    
    // Trier par timestamp (plus ancien d'abord)
    cacheEntries.sort((a, b) => a.timestamp - b.timestamp)
    
    // Supprimer les 50% les plus anciennes
    const toRemove = Math.ceil(cacheEntries.length / 2)
    for (let i = 0; i < toRemove; i++) {
      localStorage.removeItem(cacheEntries[i].key)
    }
    
    return toRemove
  } catch (error) {
    console.warn("Old cache cleanup error:", error)
    return 0
  }
}

/**
 * Nettoie tout le cache de l'application
 */
export const clearAllCache = () => {
  try {
    const keysToRemove = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    return keysToRemove.length
  } catch (error) {
    console.warn("Cache clear error:", error)
    return 0
  }
}

/**
 * Hook personnalisé pour utiliser le cache avec les appels API
 * Usage: const data = await cachedFetch('/endpoint', fetchFunction)
 */
export const cachedFetch = async (endpoint, fetchFn, options = {}) => {
  const { ttl = DEFAULT_TTL, forceRefresh = false } = options
  
  // Vérifier le cache d'abord (sauf si forceRefresh)
  if (!forceRefresh) {
    const cachedData = getFromCache(endpoint)
    if (cachedData) {
      return cachedData
    }
  }
  
  // Faire l'appel API
  const data = await fetchFn()
  
  // Sauvegarder dans le cache
  saveToCache(endpoint, data, ttl)
  
  return data
}

// Nettoyer le cache expiré au chargement de la page
if (typeof window !== "undefined") {
  // Utiliser requestIdleCallback pour ne pas bloquer le rendu
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => {
      clearExpiredCache()
    })
  } else {
    setTimeout(() => {
      clearExpiredCache()
    }, 2000)
  }
}

export default {
  getFromCache,
  saveToCache,
  removeFromCache,
  clearExpiredCache,
  clearOldCache,
  clearAllCache,
  cachedFetch
}
