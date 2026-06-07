export const useArticleTags = (articleData) => {
  const tagInput = ref('')

  const addTag = () => {
    const tag = tagInput.value.trim()
    if (tag && !articleData.tags.includes(tag)) {
      articleData.tags = [...articleData.tags, tag]
    }
    tagInput.value = ''
  }

  const addExistingTag = (tag) => {
    if (!articleData.tags.includes(tag)) {
      articleData.tags = [...articleData.tags, tag]
    }
  }

  const onTagKeydown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const removeTag = (tag) => {
    articleData.tags = articleData.tags.filter((t) => t !== tag)
  }

  return { tagInput, addTag, addExistingTag, removeTag, onTagKeydown }
}
