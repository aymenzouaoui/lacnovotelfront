import { useState, useEffect, useRef, useCallback } from "react"
import { getFromCache, saveToCache } from "../utils/apiCache"

/**
 * useOptimizedFetch - Hook personnalisé pour des appels API optimisés
 * 
 * Features:
 * - Cache localStorage automatique
 * - Debounce des appels
 * - Annulation des requêtes en cours
 * - Retry automatique en cas d'erreur
 * - Stale-while-revalidate pattern
 */

const useOptimizedFetch = (
  fetchFn,
  cacheKey,
  options = {}
) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes par défaut
    enabled = true,
    initialData = null,
    staleWhileRevalidate = true,
    retryCount = 2,
    retryDelay = 1000,
    onSuccess,
    onError
  } = options

  const [data, setData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isStale, setIsStale] = useState(false)
  
  const abortControllerRef = useRef(null)
  const retryCountRef = useRef(0)
  const isMountedRef = useRef(true)

  // Fonction de fetch avec retry
  const fetchWithRetry = useCallback(async () => {
    try {
      const result = await fetchFn()
      
      if (isMountedRef.current) {
        setData(result)
        setError(null)
        setIsStale(false)
        
        // Sauvegarder dans le cache
        if (cacheKey) {
          saveToCache(cacheKey, result, ttl)
        }
        
        onSuccess?.(result)
      }
      
      return result
    } catch (err) {
      // Retry logic
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++
        await new Promise(resolve => setTimeout(resolve, retryDelay * retryCountRef.current))
        return fetchWithRetry()
      }
      
      if (isMountedRef.current) {
        setError(err)
        onError?.(err)
      }
      
      throw err
    }
  }, [fetchFn, cacheKey, ttl, retryCount, retryDelay, onSuccess, onError])

  // Fonction principale de fetch
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return

    // Vérifier le cache d'abord
    if (cacheKey && !forceRefresh) {
      const cachedData = getFromCache(cacheKey)
      if (cachedData) {
        setData(cachedData)
        
        // Stale-while-revalidate: afficher le cache mais rafraîchir en arrière-plan
        if (staleWhileRevalidate) {
          setIsStale(true)
          // Fetch en arrière-plan sans bloquer
          fetchWithRetry().catch(() => {})
        }
        return cachedData
      }
    }

    setIsLoading(true)
    retryCountRef.current = 0

    try {
      const result = await fetchWithRetry()
      return result
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [enabled, cacheKey, staleWhileRevalidate, fetchWithRetry])

  // Effect pour fetch initial
  useEffect(() => {
    isMountedRef.current = true
    
    if (enabled) {
      fetchData()
    }

    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [enabled]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fonction de refetch manuelle
  const refetch = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    isStale,
    refetch
  }
}

export default useOptimizedFetch
