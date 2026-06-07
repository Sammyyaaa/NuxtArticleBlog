export const useArticleFiltering = () => {
  const searchArticle = ref('')
  const isSearching = ref(false)
  const sortAsc = ref(false)
  const activeSearch = ref('')
  const activeSort = ref('DESC')
  const activeTag = ref(null)

  const toggleSort = () => {
    sortAsc.value = !sortAsc.value
    activeSort.value = sortAsc.value ? 'ASC' : 'DESC'
  }

  const handleSearch = () => {
    if (searchArticle.value === '') {
      isSearching.value = false
      activeSearch.value = ''
      navigateTo('/', { replace: true })
      return
    }
    activeSort.value = sortAsc.value ? 'ASC' : 'DESC'
    activeSearch.value = searchArticle.value.trim()
    isSearching.value = true
  }

  return {
    searchArticle,
    isSearching,
    sortAsc,
    activeSearch,
    activeSort,
    activeTag,
    toggleSort,
    handleSearch
  }
}
