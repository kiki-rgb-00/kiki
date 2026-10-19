const services = {
  YouTube: {
    url: 'https://www.youtube.com/generate_204',
    successCodes: [204],
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/YouTube.png'
  },

  Netflix: {
    url: 'https://www.netflix.com/',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Netflix.png'
  },

  'Disney+': {
    url: 'https://www.disneyplus.com/',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Disney+.png'
  },

  Spotify: {
    url: 'https://open.spotify.com/',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Spotify.png'
  },

  TikTok: {
    url: 'https://www.tiktok.com/',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/TikTok.png'
  },

  Twitch: {
    url: 'https://www.twitch.tv/',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Twitch.png'
  },

  ChatGPT: {
    url: 'https://chatgpt.com/',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash/icon/openai.png'
  },

  Gemini: {
    url: 'https://gemini.google.com/',
    successMin: 200,
    successMax: 399,
    icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-gemini.png'
  },

  Claude: {
    url: 'https://claude.ai/',
    successMin: 200,
    successMax: 399,
    icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/anthropic.png'
  },
const serviceName = String($argument || '').trim()
const service = services[serviceName]


if (!service) {

  console.log(
    '[Third-Party] Unknown service:',
    serviceName
  )

  $done({
    title: serviceName || 'Third-Party',
    content: '配置错误'
  })

} else {

  const startTime = Date.now()

  $httpClient.head(
    {
      url: service.url,

      timeout: 10,

      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1',

        'X-Stash-Selected-Proxy':
          encodeURIComponent(serviceName)
      }
    },

    (error, response, data) => {

      const elapsed = Date.now() - startTime
      const elapsedSeconds = (elapsed / 1000).toFixed(2)


      if (error) {

        console.log(
          '[' + serviceName + '] Request Error:',
          error
        )

        const errorText = String(error).toLowerCase()

        if (
          errorText.includes('timeout') ||
          errorText.includes('timed out')
        ) {

          $done({
            title: serviceName,
            content: '超时·10.00 s',
            icon: service.icon
          })

        } else {

          $done({
            title: serviceName,
            content: '连接失败',
            icon: service.icon
          })

        }

        return
      }


      if (
        !response ||
        typeof response.status !== 'number'
      ) {

        console.log(
          '[' + serviceName + '] Invalid Response:',
          response
        )

        $done({
          title: serviceName,
          content: '连接失败',
          icon: service.icon
        })

        return
      }


      const status = response.status

      let success = false


      if (service.successCodes) {

        success = service.successCodes.includes(status)

      } else {

        success =
          status >= service.successMin &&
          status <= service.successMax

      }


      if (success) {

        $done({
          title: serviceName,
          content: '可访问·响应 ' + elapsedSeconds + ' s',
          icon: service.icon
        })

      } else if (status >= 400 && status <= 499) {

        $done({
          title: serviceName,
          content:
            'HTTP ' +
            status +
            '·响应 ' +
            elapsedSeconds +
            ' s',
          icon: service.icon
        })

      } else if (status >= 500 && status <= 599) {

        $done({
          title: serviceName,
          content:
            '服务器错误·' +
            status +
            '·响应 ' +
            elapsedSeconds +
            ' s',
          icon: service.icon
        })

      } else {

        $done({
          title: serviceName,
          content:
            'HTTP ' +
            status +
            '·响应 ' +
            elapsedSeconds +
            ' s',
          icon: service.icon
        })

      }

    }
  )

}