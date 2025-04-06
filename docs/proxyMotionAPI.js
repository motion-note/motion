if (!window.motionAPI) {
  window.motionAPI = new Proxy(
    { hello: 'motion', $web: true },
    {
      get(target, prop, receiver) {
        console.log(target, prop, receiver)

        if (prop === '$web') {
          return true
        }
        // 返回 true 让页面可以跳转到 home
        else if (prop === 'hasSettingFile') {
          return () => true
        }

        switch (prop) {
          case '$web':
            return true
          case 'hassettingfile':
            return () => true
          case 'openExternal':
            return url => {
              console.log(url)
              const localStr = 'local:'
              debugger
              if (url.startsWith(localStr)) {
                document
                  .querySelector(
                    '[data-menu-id="' + url.slice(localStr.length) + '"]'
                  )
                  ?.click()
              } else if (url.startsWith('http')) {
                window.open(url)
              }
            }
          // 获取菜单列表
          case 'getUsrMenuList': {
            return workspace =>
              new Promise((resolve, reject) => {
                fetch('./menu.json')
                  .then(res => res.json())
                  .then(data => {
                    resolve({ code: 0, data })
                  })
                  .catch(err => {
                    reject(err)
                  })
              })
          }
          // 获取文档
          case 'getArticle': {
            return ({ dir, cb }) => {
              // 通过请求来加载文档的数据
              fetch(`./data/${dir}/data.json`)
                .then(res => res.json())
                .then(res => {
                  // 返回加载内容
                  cb({
                    success: true,
                    data: Object.assign({
                      ...res,
                      setting: {
                        debug: false,
                        lock: true
                      }
                    })
                  })
                })
            }
          }
        }

        return () => console.log(prop)
      },

      toString() {
        return 'motionAPI'
      }
    }
  )
}
