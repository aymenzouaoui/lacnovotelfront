// Initialize PDF.js worker
if (typeof window !== "undefined") {
    window.pdfjsLib = window.pdfjsLib || {}
    window.pdfjsLib.GlobalWorkerOptions = window.pdfjsLib.GlobalWorkerOptions || {}
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js"
  }
  
  // Detect platform
  const isAndroid = typeof navigator !== "undefined" ? /Android/i.test(navigator.userAgent) : false
  const isIOS = typeof navigator !== "undefined" ? /iPhone|iPad|iPod/i.test(navigator.userAgent) : false
  
  // Only mirror on the platform that needs it
  function shouldMirrorBackPage() {
    return isAndroid || isIOS
  }
  
  // Initialize book navigation
  export function initBookNavigation(bookRef, papersRef, numOfPapers, setCurrentLocation) {
    // Reset book state
    papersRef.current.forEach((paperRef, index) => {
      if (paperRef && paperRef.current) {
        paperRef.current.classList.remove("flipped")
        paperRef.current.style.zIndex = numOfPapers - index
      }
    })
  
    if (bookRef.current) {
      bookRef.current.style.transform = "translateX(0%)"
    }
  
    setCurrentLocation(1)
  }
  
  // Go to next page
  export function goNextPage(currentLocation, numOfPapers, papersRef, bookRef, setCurrentLocation) {
    if (currentLocation < numOfPapers + 1) {
      const paperIndex = currentLocation - 1
      if (papersRef.current[paperIndex] && papersRef.current[paperIndex].current) {
        papersRef.current[paperIndex].current.classList.add("flipped")
        papersRef.current[paperIndex].current.style.zIndex = paperIndex + 1
      }
  
      if (currentLocation === numOfPapers) {
        // Last page
        if (bookRef.current) {
          bookRef.current.style.transform = "translateX(0%)"
        }
      }
  
      setCurrentLocation(currentLocation + 1)
    }
  }
  
  // Go to previous page
  export function goPrevPage(currentLocation, numOfPapers, papersRef, bookRef, setCurrentLocation) {
    if (currentLocation > 1) {
      const paperIndex = currentLocation - 2
      if (papersRef.current[paperIndex] && papersRef.current[paperIndex].current) {
        papersRef.current[paperIndex].current.classList.remove("flipped")
        papersRef.current[paperIndex].current.style.zIndex = numOfPapers - paperIndex
      }
  
      if (currentLocation === 2) {
        // First page
        if (bookRef.current) {
          bookRef.current.style.transform = "translateX(0%)"
        }
      }
  
      setCurrentLocation(currentLocation - 1)
    }
  }
  