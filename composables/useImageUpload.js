export const useImageUpload = (articleData) => {
  const uploadImgFileName = ref('')

  const handleUpload = (inputId = 'uploadInput') => {
    const uploadInput = document.createElement('input')
    uploadInput.type = 'file'
    uploadInput.id = inputId
    uploadInput.accept = 'image/*'
    uploadInput.style.display = 'none'
    document.body.appendChild(uploadInput)

    uploadInput.addEventListener('change', (event) => {
      const file = event.target.files ? event.target.files[0] : null
      if (file) {
        articleData.img = file
        uploadImgFileName.value = file.name
      }
    })

    uploadInput.click()
  }

  return { uploadImgFileName, handleUpload }
}
