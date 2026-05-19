import { useEffect } from 'react'

export function useImagePreload(imagePath: string): void {
  useEffect(() => {
    const img = new Image()
    img.src = imagePath
  }, [imagePath])
}
