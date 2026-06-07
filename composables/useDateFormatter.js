export const useDateFormatter = () => {
  const formatDateToTaipei = (date) =>
    new Date(date).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })

  return { formatDateToTaipei }
}
