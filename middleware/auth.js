export default defineNuxtRouteMiddleware(async () => {
  const userInfo = useState('userInfo')

  if (userInfo.value) {
    if (userInfo.value?.id !== 1) {
      return navigateTo('/')
    }
  } else {
    const user = await $fetch('/api/whoami', {
      // 使用 useRequestHeaders 將 cookie 夾帶在 Header 中，如果 cookie 中有包含 /api/whoami API 所需要的憑證，將回傳使用者資訊
      headers: useRequestHeaders(['cookie'])
    }).catch((error) => {
      console.log(error)
      return null
    })

    if (user?.id !== 1) {
      return navigateTo('/')
    }
  }
})
