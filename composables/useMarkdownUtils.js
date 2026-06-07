export const useMarkdownUtils = () => {
  const stripMarkdown = (text = '') =>
    text
      .replace(/#{1,6}\s/g, '')
      .replace(/[*_`>![\]]/g, '')
      .replace(/\n+/g, ' ')
      .trim()

  return { stripMarkdown }
}
