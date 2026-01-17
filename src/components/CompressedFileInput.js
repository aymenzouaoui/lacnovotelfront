"use client"
import imageCompression from "browser-image-compression"

export default function CompressedFileInput({ onChange, ...props }) {
  const handleChange = async (e) => {
    const { name, files } = e.target
    if (!files) return

    const compressedFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        if (file.type.startsWith("image/")) {
          try {
            return await imageCompression(file, {
              maxSizeMB: 4,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            })
          } catch (err) {
            console.error("Compression failed:", err)
            return file
          }
        }
        return file
      })
    )

    onChange && onChange({ target: { name, files: compressedFiles } })
  }

  return <input {...props} onChange={handleChange} />
}
