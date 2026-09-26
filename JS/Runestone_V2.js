/*
 * 服务分类配置｜Hako版
 *
 * Hako 会将当前选中的多个节点来源合并到 config.proxies。
 * 本脚本不依赖任何 proxy-providers 名称。
 *
 * 结构：
 * 1. 主策略组
 * 2. 普通服务策略组
 * 3. 根据实际节点动态生成地区 Auto
 * 4. APNs-Fallback
 * 5. Global-Fallback
 * 6. Rules
 * 7. Rule Providers
 */

function main(config) {
  // Hako 当前选中的所有机场节点都会合并到 config.proxies。
  const currentProxies = Array.isArray(config && config.proxies)
    ? config.proxies
    : [];

  const currentProxyNames = currentProxies
    .map(p =>
      typeof p === "string"
        ? p
        : (p && typeof p.name === "string" ? p.name : null)
    )
    .filter(Boolean);

  const fixed = {
    "mixed-port": 7890,
    "allow-lan": false,
    "bind-address": "*",
    "mode": "rule",
    "log-level": "info",
    "external-controller": "127.0.0.1:9090",
    "unified-delay": true,
    "tcp-concurrent": true,
    "ipv6": true,

    "tun": {
      "enable": true,
      "stack": "mips",
      "auto-route": true,
      "auto-detect-interface": true,
      "strict-route": true,
      "dns-hijack": [
        "any:53"
      ]
    },

    "dns": {
      "enable": true,
      "respect-rules": true,
      "ipv6": true,
      "prefer-h3": false,
      "enhanced-mode": "fake-ip",
      "fake-ip-range": "198.18.0.1/16",

      "default-nameserver": [
        "223.5.5.5",
        "119.29.29.119",
        "2400:3200::1"
      ],

      "nameserver": [
        "https://dns.cloudflare.com/dns-query",
        "https://dns.google/dns-query"
      ],

      "proxy-server-nameserver-policy": null,

      "proxy-server-nameserver": [
        "https://dns.alidns.com/dns-query",
        "https://doh.pub/dns-query"
      ],

      "direct-nameserver": [
        "https://dns.alidns.com/dns-query",
        "https://doh.pub/dns-query"
      ],

      "nameserver-policy": {
        "dns.cloudflare.com": [
          "1.1.1.1",
          "1.0.0.1"
        ],

        "dns.google": [
          "8.8.8.8",
          "8.8.4.4"
        ],

        "dns.quad9.net": [
          "9.9.9.9",
          "149.112.112.112"
        ],

        "dns.alidns.com": [
          "223.5.5.5",
          "223.6.6.6"
        ],

        "doh.pub": [
          "1.12.12.12",
          "120.53.53.53"
        ],

        "geosite:cn": [
          "https://dns.alidns.com/dns-query",
          "https://doh.pub/dns-query"
        ]
      },

      "fallback": [
        "https://anycast.uncensoreddns.org/dns-query"
      ],

      "fallback-filter": {
        "geoip": true,
        "geoip-code": "CN",
        "ipcidr": [
          "240.0.0.0/4",
          "127.0.0.0/8",
          "0.0.0.0/32"
        ]
      },

      "fake-ip-filter": [
        "*.lan",
        "*.local",
        "localhost",
        "*.msftconnecttest.com",
        "*.msftncsi.com",
        "*.msidentity.com",
        "captive.apple.com",
        "*.push.apple.com",
        "stun.*",
        "+.stun.*.*",
        "+.stun.*.*.*",
        "+.stun.*.*.*.*",
        "+.stun.*.*.*.*.*",
        "+.weixin.com",
        "+.wechat.com",
        "+.qq.com",
        "+.tencent.com",
        "speedtest.net"
      ]
    },

    "profile": {
      "store-selected": true,
      "store-fake-ip": true
    }
  };

  // ============================================================
  // 节点池
  // ============================================================

  fixed.proxies = currentProxies;
  fixed["proxy-groups"] = [];

  // ============================================================
  // 1. 主策略组
  //
  // Auto 组故意不在这里生成。
  // Auto 会在所有普通服务策略组之后生成。
  // ============================================================

  fixed["proxy-groups"].push(
    {
      "name": "PROXY-Gate",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Final.png",
      "proxies": [
        "🖥️ All-Nodes",
        "DIRECT"
      ]
    },

    {
      "name": "Apple Push",
      "type": "fallback",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Apple.png",
      "proxies": [
        "APNs-Fallback",
        "DIRECT"
      ],
      "url": "http://captive.apple.com/hotspot-detect.html",
      "interval": 300
    },

    {
      "name": "🖥️ All-Nodes",
      "type": "select",
      "proxies": currentProxyNames.slice(),
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Server.png"
    }
  );

  // ============================================================
  // 2. 普通服务策略组
  //
  // 这里暂时只放 All-Nodes / PROXY-Gate / DIRECT。
  // 后面检测完节点地区后，再把实际存在的 Auto 组插入。
  //
  // 因此：
  // 没有法国节点 → 不会出现 FR-Auto
  // 没有俄罗斯节点 → 不会出现 RU-Auto
  // ============================================================

  fixed["proxy-groups"].push({
    "name": "YouTube",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/YouTube.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Netflix",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Netflix.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Disney+",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Disney+.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Spotify",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Spotify.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "TikTok",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/TikTok.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Twitch",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Twitch.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "GPT",
    "type": "select",
    "icon": "https://raw.githubusercontent.com/kiki-rgb-00/kiki/refs/heads/main/Ti/ChatGPT.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Gemini",
    "type": "select",
    "icon": "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-gemini.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Claude",
    "type": "select",
    "icon": "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/anthropic.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Copilot",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Hawaiine/Oasisic-Icons@main/icons/Microsoft/Copilot-1.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Grok",
    "type": "select",
    "icon": "https://raw.githubusercontent.com/luestr/IconResource/main/App_icon/120px/Grok.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  // ============================================================
  // Microsoft
  //
  // 注意：
  // Copilot 已经有独立策略组，因此 Microsoft 的规则中
  // 不接管 Copilot 相关域名。
  //
  // Microsoft 组主要用于：
  // Microsoft Account / 登录
  // Outlook / Hotmail / Live
  // OneDrive
  // Microsoft 365 / Office
  // Teams
  // Windows / Windows Update
  // Microsoft Store
  // Xbox
  // Azure / Microsoft 服务基础设施
  // ============================================================

  fixed["proxy-groups"].push({
    "name": "Microsoft",
    "type": "select",
    "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Microsoft.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Google",
    "type": "select",
    "icon": "https://raw.githubusercontent.com/kiki-rgb-00/kiki/refs/heads/main/Ti/Google.PNG",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  // 注意：这里只修改普通 Apple 策略组图标。
  fixed["proxy-groups"].push({
    "name": "Apple",
    "type": "select",
    "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Apple_2.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Amazon",
    "type": "select",
    "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Amazon.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  // ============================================================
  // Meta
  //
  // Facebook / Instagram / Threads / Meta AI / Muse
  // 统一使用 Meta 策略组。
  //
  // WhatsApp 保持独立策略组，不归入 Meta。
  // ============================================================

  fixed["proxy-groups"].push({
    "name": "Meta",
    "type": "select",
    "icon": "https://raw.githubusercontent.com/kiki-rgb-00/kiki/refs/heads/main/Ti/Meta.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "X",
    "type": "select",
    "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/X.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "WhatsApp",
    "type": "select",
    "icon": "https://raw.githubusercontent.com/kiki-rgb-00/kiki/refs/heads/main/Ti/WhatsApp.svg",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Telegram",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Telegram.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Github",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/GitHub.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Speedtest",
    "type": "select",
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Speedtest.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  // ============================================================
  // 3. 地区 Auto
  //
  // 直接读取 Hako 合并后的完整 config.proxies。
  //
  // 只有匹配到 3 个及以上节点才生成对应地区 Auto。
  //
  // 少于 3 个：
  // - 不生成 Auto
  // - 不加入服务策略组
  // - 不加入 APNs-Fallback
  //
  // 所有 Auto 组统一使用 Auto.png 图标。
  // ============================================================

  const regionGroups = [
    {
      key: "US",
      name: "🇺🇸 US",
      filter: /([\[]US[\]]|^US$|USA|United[ _-]?States|\bUS\b|美国|美國|🇺🇸)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "SG",
      name: "🇸🇬 SG",
      filter: /([\[]SG[\]]|^SG$|Singapore|\bSG\b|新加坡|狮城|🇸🇬)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "HK",
      name: "🇭🇰 HK",
      filter: /([\[]HK[\]]|^HK$|Hong[ _-]?Kong|\bHK\b|香港|🇭🇰)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "JP",
      name: "🇯🇵 JP",
      filter: /([\[]JP[\]]|^JP$|Japan|\bJP\b|日本|东京|大阪|🇯🇵)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "TW",
      name: "🇹🇼 TW",
      filter: /([\[]TW[\]]|^TW$|Taiwan|Taibei|Taipei|\bTW\b|台湾|臺灣|台北|高雄|🇹🇼)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "UK",
      name: "🇬🇧 UK",
      filter: /([\[]UK[\]]|^UK$|United[ _-]?Kingdom|Britain|England|\bUK\b|英国|英國|伦敦|🇬🇧)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "DE",
      name: "🇩🇪 DE",
      filter: /([\[]DE[\]]|^DE$|Germany|Deutschland|\bDE\b|德国|德國|法兰克福|🇩🇪)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "FR",
      name: "🇫🇷 FR",
      filter: /([\[]FR[\]]|^FR$|France|\bFR\b|法国|法國|巴黎|🇫🇷)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "RU",
      name: "🇷🇺 RU",
      filter: /([\[]RU[\]]|^RU$|Russia|Russian[ _-]?Federation|\bRU\b|俄罗斯|俄羅斯|莫斯科|伯力|🇷🇺)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "CA",
      name: "🇨🇦 CA",
      filter: /([\[]CA[\]]|^CA$|Canada|\bCA\b|加拿大|🇨🇦)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "AU",
      name: "🇦🇺 AU",
      filter: /([\[]AU[\]]|^AU$|Australia|\bAU\b|澳大利亚|澳洲|澳大利亞|🇦🇺)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "KR",
      name: "🇰🇷 KR",
      filter: /([\[]KR[\]]|^KR$|Korea|South[ _-]?Korea|\bKR\b|韩国|韓國|首尔|首爾|🇰🇷)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "IT",
      name: "🇮🇹 IT",
      filter: /([\[]IT[\]]|^IT$|Italy|Italian|\bIT\b|意大利|義大利|米兰|米蘭|罗马|羅馬|🇮🇹)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "ES",
      name: "🇪🇸 ES",
      filter: /([\[]ES[\]]|^ES$|Spain|Spanish|\bES\b|西班牙|马德里|馬德里|🇪🇸)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "NL",
      name: "🇳🇱 NL",
      filter: /([\[]NL[\]]|^NL$|Netherlands|Dutch|\bNL\b|荷兰|荷蘭|阿姆斯特丹|🇳🇱)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "FI",
      name: "🇫🇮 FI",
      filter: /([\[]FI[\]]|^FI$|Finland|Finnish|\bFI\b|芬兰|芬蘭|赫尔辛基|赫爾辛基|🇫🇮)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "NO",
      name: "🇳🇴 NO",
      filter: /([\[]NO[\]]|^NO$|Norway|Norwegian|\bNO\b|挪威|奥斯陆|奧斯陸|🇳🇴)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "SE",
      name: "🇸🇪 SE",
      filter: /([\[]SE[\]]|^SE$|Sweden|Swedish|\bSE\b|瑞典|斯德哥尔摩|斯德哥爾摩|🇸🇪)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "CH",
      name: "🇨🇭 CH",
      filter: /([\[]CH[\]]|^CH$|Switzerland|Swiss|\bCH\b|瑞士|苏黎世|蘇黎世|日内瓦|日內瓦|🇨🇭)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "PL",
      name: "🇵🇱 PL",
      filter: /([\[]PL[\]]|^PL$|Poland|Polish|\bPL\b|波兰|波蘭|华沙|華沙|🇵🇱)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },

    {
      key: "MY",
      name: "🇲🇾 MY",
      filter: /([\[]MY[\]]|^MY$|Malaysia|Malaysian|\bMY\b|马来西亚|馬來西亞|吉隆坡|🇲🇾)/i,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    }
  ];

  const existingRegionalAutos = [];

  regionGroups.forEach(region => {
    const matched = currentProxyNames.filter(
      name => region.filter.test(name)
    );

    const autoName = region.name + "-Auto";

    // 只有 3 个及以上节点才生成该地区 Auto。
    if (matched.length < 3) {
      return;
    }

    fixed["proxy-groups"].push({
      name: autoName,
      type: "url-test",
      proxies: matched,
      icon: region.icon,
      url: "http://www.gstatic.com/generate_204",
      interval: 900,
      tolerance: 50
    });

    // 这里只记录实际生成的 Auto。
    // 后续服务策略组和 APNs-Fallback 都只引用这个数组。
    existingRegionalAutos.push(autoName);
  });

  // ============================================================
  // 4. 将实际存在的 Auto 组加入服务策略组
  //
  // 顺序固定为：
  //
  // 🖥️ All-Nodes
  // 🌍 Global-Fallback
  // 🇺🇸 US-Auto
  // 🇸🇬 SG-Auto
  // ...
  // PROXY-Gate
  // DIRECT
  //
  // Global-Fallback 是用户主动选择的跨地区容灾模式。
  // ============================================================

  const serviceProxyChoices = [
    "🖥️ All-Nodes",
    ...(existingRegionalAutos.length
      ? ["🌍 Global-Fallback"]
      : []),
    ...existingRegionalAutos,
    "PROXY-Gate",
    "DIRECT"
  ];

  const serviceGroupNames = [
    "YouTube",
    "Netflix",
    "Disney+",
    "Spotify",
    "TikTok",
    "Twitch",
    "GPT",
    "Gemini",
    "Claude",
    "Copilot",
    "Grok",
    "Microsoft",
    "Google",
    "Apple",
    "Amazon",
    "Meta",
    "X",
    "WhatsApp",
    "Telegram",
    "Github",
    "Speedtest"
  ];

  fixed["proxy-groups"].forEach(group => {
    if (serviceGroupNames.includes(group.name)) {
      group.proxies = serviceProxyChoices.slice();
    }
  });

  // ============================================================
  // 5. PROXY-Gate
  //
  // 顺序固定为：
  //
  // 🖥️ All-Nodes
  // 🌍 Global-Fallback
  // 🇺🇸 US-Auto
  // 🇸🇬 SG-Auto
  // ...
  // DIRECT
  //
  // Global-Fallback 同样只是一个可手动选择的出口。
  // ============================================================

  const proxyGate = fixed["proxy-groups"].find(
    group => group.name === "PROXY-Gate"
  );

  if (proxyGate) {
    proxyGate.proxies = [
      "🖥️ All-Nodes",
      ...(existingRegionalAutos.length
        ? ["🌍 Global-Fallback"]
        : []),
      ...existingRegionalAutos,
      "DIRECT"
    ];
  }

  // ============================================================
  // 6. Apple Push 专用 APNs-Fallback
  //
  // 只引用实际生成的地区 Auto。
  //
  // 少于 3 个节点的地区不会出现在这里。
  // ============================================================

  fixed["proxy-groups"].push({
    name: "APNs-Fallback",
    type: "fallback",
    proxies: existingRegionalAutos,
    icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Available_1.png",
    url: "http://captive.apple.com/hotspot-detect.html",
    interval: 300
  });

  // ============================================================
  // 7. Global-Fallback
  //
  // 放在整个策略组列表最后，与 APNs-Fallback 相邻。
  //
  // 它引用地区 Auto，而不是直接引用原始节点。
  //
  // 因此逻辑为：
  //
  // 地区内部：
  //     US-Auto → 自动选择 US 地区可用节点
  //
  // 地区之间：
  //     US-Auto → SG-Auto → HK-Auto → ...
  //
  // 只有用户主动选择 🌍 Global-Fallback 时才启用。
  // ============================================================

  if (existingRegionalAutos.length) {
    fixed["proxy-groups"].push({
      name: "🌍 Global-Fallback",
      type: "fallback",
      proxies: existingRegionalAutos,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Available_1.png",
      url: "http://www.gstatic.com/generate_204",
      interval: 600
    });
  }

  // ============================================================
  // Rules
  // ============================================================

  fixed.rules = [
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "GEOIP,LAN,DIRECT,no-resolve",

    // Apple Push 必须在普通 Apple 规则之前
    "DOMAIN-SUFFIX,push.apple.com,Apple Push",
    "DOMAIN-SUFFIX,push-apple.com.akadns.net,Apple Push",
    "DOMAIN-KEYWORD,apple.com.edgekey.net,Apple Push",

    "IP-CIDR,17.249.0.0/16,Apple Push,no-resolve",
    "IP-CIDR,17.252.0.0/16,Apple Push,no-resolve",
    "IP-CIDR,17.57.144.0/22,Apple Push,no-resolve",
    "IP-CIDR,17.188.128.0/18,Apple Push,no-resolve",
    "IP-CIDR,17.188.20.0/23,Apple Push,no-resolve",

    "IP-CIDR6,2620:149:a44::/48,Apple Push,no-resolve",
    "IP-CIDR6,2403:300:a42::/48,Apple Push,no-resolve",
    "IP-CIDR6,2403:300:a51::/48,Apple Push,no-resolve",
    "IP-CIDR6,2a01:b740:a42::/48,Apple Push,no-resolve",

    // 普通 Apple 流量进入 Apple 策略组
    "RULE-SET,Apple,Apple",
    "RULE-SET,Apple_Domain,Apple",

    // ========================================================
    // Amazon
    //
    // 国际 Amazon 站点及其常用资源域名。
    // 不将 amazonaws.com 整体纳入 Amazon，
    // 避免接管与 Amazon 商城无关的 AWS 流量。
    // ========================================================

    "DOMAIN-SUFFIX,amazon.com,Amazon",
    "DOMAIN-SUFFIX,amazon.co.uk,Amazon",
    "DOMAIN-SUFFIX,amazon.de,Amazon",
    "DOMAIN-SUFFIX,amazon.fr,Amazon",
    "DOMAIN-SUFFIX,amazon.it,Amazon",
    "DOMAIN-SUFFIX,amazon.es,Amazon",
    "DOMAIN-SUFFIX,amazon.co.jp,Amazon",
    "DOMAIN-SUFFIX,amazon.ca,Amazon",
    "DOMAIN-SUFFIX,amazon.com.au,Amazon",
    "DOMAIN-SUFFIX,amazon.in,Amazon",
    "DOMAIN-SUFFIX,amazon.com.mx,Amazon",
    "DOMAIN-SUFFIX,amazon.com.br,Amazon",
    "DOMAIN-SUFFIX,amazon.nl,Amazon",
    "DOMAIN-SUFFIX,amazon.pl,Amazon",
    "DOMAIN-SUFFIX,amazon.se,Amazon",
    "DOMAIN-SUFFIX,amazon.sg,Amazon",
    "DOMAIN-SUFFIX,amazon.ae,Amazon",
    "DOMAIN-SUFFIX,amazon.sa,Amazon",
    "DOMAIN-SUFFIX,amazon.com.tr,Amazon",
    "DOMAIN-SUFFIX,amazon.eg,Amazon",
    "DOMAIN-SUFFIX,amazon.co.za,Amazon",

    // Amazon 常用内容 / 静态资源
    "DOMAIN-SUFFIX,images-amazon.com,Amazon",
    "DOMAIN-SUFFIX,ssl-images-amazon.com,Amazon",
    "DOMAIN-SUFFIX,media-amazon.com,Amazon",
    "DOMAIN-SUFFIX,amazon-adsystem.com,Amazon",

    // Amazon Pay
    "DOMAIN-SUFFIX,amazonpay.com,Amazon",
    "DOMAIN-SUFFIX,amazonpay.in,Amazon",
    "DOMAIN-SUFFIX,amazonpay.com.br,Amazon",

    // 广告 / 隐私
    "RULE-SET,AdvertisingLite,REJECT",
    "RULE-SET,AdvertisingLite_Domain,REJECT",
    "RULE-SET,Privacy,REJECT",
    "RULE-SET,Privacy_Domain,REJECT",
    "RULE-SET,ACL4SSR_BanAD,REJECT",
    "RULE-SET,ACL4SSR_BanProgramAD,REJECT",

    // YouTube
    "DOMAIN-SUFFIX,youtube.com,YouTube",
    "DOMAIN-SUFFIX,youtu.be,YouTube",
    "DOMAIN-SUFFIX,youtube-nocookie.com,YouTube",
    "DOMAIN-SUFFIX,youtubei.googleapis.com,YouTube",
    "DOMAIN-SUFFIX,youtube.googleapis.com,YouTube",
    "DOMAIN-SUFFIX,ytimg.com,YouTube",
    "DOMAIN-SUFFIX,googlevideo.com,YouTube",
    "DOMAIN-SUFFIX,ggpht.com,YouTube",

    // Netflix
    "DOMAIN-SUFFIX,netflix.com,Netflix",
    "DOMAIN-SUFFIX,netflix.net,Netflix",
    "DOMAIN-SUFFIX,netflix.ca,Netflix",
    "DOMAIN-SUFFIX,nflxext.com,Netflix",
    "DOMAIN-SUFFIX,nflximg.com,Netflix",
    "DOMAIN-SUFFIX,nflximg.net,Netflix",
    "DOMAIN-SUFFIX,nflxsearch.net,Netflix",
    "DOMAIN-SUFFIX,nflxso.net,Netflix",
    "DOMAIN-SUFFIX,nflxvideo.net,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest0.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest1.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest2.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest3.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest4.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest5.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest6.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest7.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest8.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest9.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest10.com,Netflix",
    "DOMAIN-SUFFIX,netflixinvestor.com,Netflix",
    "DOMAIN-SUFFIX,netflixtechblog.com,Netflix",
    "DOMAIN,netflix.com.edgesuite.net,Netflix",

    // Disney+
    "DOMAIN-SUFFIX,disneyplus.com,Disney+",
    "DOMAIN-SUFFIX,disney-plus.net,Disney+",
    "DOMAIN-SUFFIX,dssott.com,Disney+",
    "DOMAIN-SUFFIX,dssedge.com,Disney+",
    "DOMAIN-SUFFIX,bamgrid.com,Disney+",
    "DOMAIN-SUFFIX,media.dssott.com,Disney+",
    "DOMAIN-SUFFIX,disney.playback.edge.bamgrid.com,Disney+",
    "DOMAIN-SUFFIX,star.playback.edge.bamgrid.com,Disney+",
    "DOMAIN-SUFFIX,search-api-disney.bamgrid.com,Disney+",

    // Spotify
    "DOMAIN-SUFFIX,spotify.com,Spotify",
    "DOMAIN-SUFFIX,spotifycdn.com,Spotify",
    "DOMAIN-SUFFIX,scdn.co,Spotify",
    "DOMAIN-SUFFIX,spclient.wg.spotify.com,Spotify",
    "DOMAIN-SUFFIX,api-partner.spotify.com,Spotify",
    "DOMAIN-SUFFIX,heads4-ak-spotify-com.akamaized.net,Spotify",
    "DOMAIN-SUFFIX,spotifycdn.com,Spotify",

    // TikTok
    "DOMAIN-SUFFIX,tiktok.com,TikTok",
    "DOMAIN-SUFFIX,tiktokcdn.com,TikTok",
    "DOMAIN-SUFFIX,tiktokcdn-us.com,TikTok",
    "DOMAIN-SUFFIX,tiktokv.com,TikTok",
    "DOMAIN-SUFFIX,tiktokd.org,TikTok",
    "DOMAIN-SUFFIX,ibytedtos.com,TikTok",
    "DOMAIN-SUFFIX,ibyteimg.com,TikTok",
    "DOMAIN-SUFFIX,byteoversea.com,TikTok",
    "DOMAIN-SUFFIX,muscdn.com,TikTok",
    "DOMAIN-SUFFIX,musical.ly,TikTok",

    // Twitch
    "DOMAIN-SUFFIX,twitch.tv,Twitch",
    "DOMAIN-SUFFIX,twitchcdn.net,Twitch",
    "DOMAIN-SUFFIX,jtvnw.net,Twitch",
    "DOMAIN-SUFFIX,ttvnw.net,Twitch",
    "DOMAIN-SUFFIX,twitchsvc.net,Twitch",

    // GPT
    "DOMAIN-SUFFIX,chatgpt.com,GPT",
    "DOMAIN-SUFFIX,openai.com,GPT",
    "DOMAIN-SUFFIX,auth.openai.com,GPT",
    "DOMAIN-SUFFIX,oaistatic.com,GPT",
    "DOMAIN-SUFFIX,oaiusercontent.com,GPT",
    "DOMAIN,android.chat.openai.com,GPT",
    "DOMAIN,auth0.openai.com,GPT",
    "DOMAIN,chat.openai.com,GPT",
    "DOMAIN,desktop.chat.openai.com,GPT",
    "DOMAIN,ios.chat.openai.com,GPT",
    "DOMAIN,tcr9i.chat.openai.com,GPT",
    "DOMAIN,cdn.openaimerge.com,GPT",
    "DOMAIN,ws.chatgpt.com,GPT",
    "DOMAIN,setup.auth.openai.com,GPT",
    "DOMAIN,cdn.workos.com,GPT",
    "DOMAIN,forwarder.workos.com,GPT",
    "DOMAIN,images.workoscdn.com,GPT",
    "DOMAIN,workos.imgix.net,GPT",
    "DOMAIN,setup.workos.com,GPT",
    "DOMAIN,ct.sendgrid.net,GPT",
    "DOMAIN,oaistatsig.com,GPT",
    "DOMAIN,intercom.io,GPT",
    "DOMAIN,intercomcdn.com,GPT",
    "DOMAIN,js.intercomcdn.com,GPT",
    "DOMAIN,js.stripe.com,GPT",
    "DOMAIN,o207216.ingest.sentry.io,GPT",
    "DOMAIN,o33249.ingest.sentry.io,GPT",
    "DOMAIN,rum.browser-intake-datadoghq.com,GPT",
    "DOMAIN,challenges.cloudflare.com,GPT",
    "DOMAIN,humb.apple.com,GPT",

    // Gemini
    "DOMAIN-SUFFIX,gemini.google.com,Gemini",
    "DOMAIN-SUFFIX,aistudio.google.com,Gemini",
    "DOMAIN-SUFFIX,deepmind.com,Gemini",
    "DOMAIN-SUFFIX,deepmind.google,Gemini",
    "DOMAIN-SUFFIX,gemini.googleusercontent.com,Gemini",
    "DOMAIN-SUFFIX,makersuite.google.com,Gemini",

    // Claude
    "DOMAIN-SUFFIX,claude.ai,Claude",
    "DOMAIN-SUFFIX,anthropic.com,Claude",
    "DOMAIN-SUFFIX,claudeusercontent.com,Claude",
    "DOMAIN-SUFFIX,claudeusercontent.com.cdn.cloudflare.net,Claude",

    // Copilot
    // 必须位于 Microsoft 广泛域名规则之前，
    // 确保 Copilot 使用独立策略组。
    "DOMAIN-SUFFIX,copilot.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,ai.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,designer.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,copilot.com,Copilot",
    "DOMAIN-KEYWORD,copilot,Copilot",

    // Grok
    "DOMAIN-SUFFIX,grok.com,Grok",
    "DOMAIN-SUFFIX,x.ai,Grok",
    "DOMAIN-KEYWORD,grok,Grok",

    // ========================================================
    // Microsoft
    //
    // Copilot 已经在上方优先匹配，因此这里的 Microsoft
    // 广泛规则不会抢走 Copilot 流量。
    // ========================================================

    // Microsoft Account / 登录
    "DOMAIN-SUFFIX,account.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,account.live.com,Microsoft",
    "DOMAIN-SUFFIX,login.live.com,Microsoft",
    "DOMAIN-SUFFIX,login.microsoftonline.com,Microsoft",
    "DOMAIN-SUFFIX,login.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,login.windows.net,Microsoft",
    "DOMAIN-SUFFIX,msauth.net,Microsoft",
    "DOMAIN-SUFFIX,msauthimages.net,Microsoft",
    "DOMAIN-SUFFIX,msftauth.net,Microsoft",
    "DOMAIN-SUFFIX,msftauthimages.net,Microsoft",
    "DOMAIN-SUFFIX,msidentity.com,Microsoft",

    // Outlook / Hotmail / Live Mail
    "DOMAIN-SUFFIX,outlook.com,Microsoft",
    "DOMAIN-SUFFIX,outlook.office.com,Microsoft",
    "DOMAIN-SUFFIX,outlook.office365.com,Microsoft",
    "DOMAIN-SUFFIX,hotmail.com,Microsoft",
    "DOMAIN-SUFFIX,hotmail.co.uk,Microsoft",
    "DOMAIN-SUFFIX,live.com,Microsoft",
    "DOMAIN-SUFFIX,live.net,Microsoft",
    "DOMAIN-SUFFIX,office.live.com,Microsoft",
    "DOMAIN-SUFFIX,mail.live.com,Microsoft",

    // Microsoft 365 / Office
    "DOMAIN-SUFFIX,microsoft365.com,Microsoft",
    "DOMAIN-SUFFIX,office.com,Microsoft",
    "DOMAIN-SUFFIX,office.net,Microsoft",
    "DOMAIN-SUFFIX,office365.com,Microsoft",
    "DOMAIN-SUFFIX,officeapps.live.com,Microsoft",
    "DOMAIN-SUFFIX,officeclient.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,officecdn.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,officecdn.microsoft.com.edgesuite.net,Microsoft",
    "DOMAIN-SUFFIX,msocdn.com,Microsoft",
    "DOMAIN-SUFFIX,microsoftonline.com,Microsoft",
    "DOMAIN-SUFFIX,microsoftonline-p.com,Microsoft",
    "DOMAIN-SUFFIX,microsoftonline-p.net,Microsoft",

    // OneDrive / SharePoint
    "DOMAIN-SUFFIX,onedrive.com,Microsoft",
    "DOMAIN-SUFFIX,onedrive.live.com,Microsoft",
    "DOMAIN-SUFFIX,1drv.com,Microsoft",
    "DOMAIN-SUFFIX,sharepoint.com,Microsoft",
    "DOMAIN-SUFFIX,sharepointonline.com,Microsoft",
    "DOMAIN-SUFFIX,sharepointonline.com.edgesuite.net,Microsoft",

    // Microsoft Teams
    "DOMAIN-SUFFIX,teams.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,teams.live.com,Microsoft",
    "DOMAIN-SUFFIX,teams.events.data.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,teams.microsoft.net,Microsoft",
    "DOMAIN-SUFFIX,skype.com,Microsoft",
    "DOMAIN-SUFFIX,skypeforbusiness.com,Microsoft",

    // Microsoft Store
    "DOMAIN-SUFFIX,microsoftstore.com,Microsoft",
    "DOMAIN-SUFFIX,microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,store.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,storeedgefd.dsx.mp.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,displaycatalog.mp.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,dl.delivery.mp.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,delivery.mp.microsoft.com,Microsoft",

    // Windows / Windows Update
    "DOMAIN-SUFFIX,windows.com,Microsoft",
    "DOMAIN-SUFFIX,windows.net,Microsoft",
    "DOMAIN-SUFFIX,windowsupdate.com,Microsoft",
    "DOMAIN-SUFFIX,windowsupdate.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,update.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,download.windowsupdate.com,Microsoft",
    "DOMAIN-SUFFIX,delivery.mp.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,download.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,download.windows.com,Microsoft",
    "DOMAIN-SUFFIX,msftconnecttest.com,Microsoft",
    "DOMAIN-SUFFIX,msftncsi.com,Microsoft",

    // Microsoft 服务基础设施
    "DOMAIN-SUFFIX,azure.com,Microsoft",
    "DOMAIN-SUFFIX,azure.net,Microsoft",
    "DOMAIN-SUFFIX,azureedge.net,Microsoft",
    "DOMAIN-SUFFIX,azurefd.net,Microsoft",
    "DOMAIN-SUFFIX,azurewebsites.net,Microsoft",
    "DOMAIN-SUFFIX,trafficmanager.net,Microsoft",
    "DOMAIN-SUFFIX,msedge.net,Microsoft",
    "DOMAIN-SUFFIX,msft.net,Microsoft",
    "DOMAIN-SUFFIX,msftstatic.com,Microsoft",
    "DOMAIN-SUFFIX,msecnd.net,Microsoft",

    // Microsoft Telemetry / 服务 API
    "DOMAIN-SUFFIX,data.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,events.data.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,settings-win.data.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,v10.events.data.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,watson.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,watson.telemetry.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,telemetry.microsoft.com,Microsoft",

    // Xbox
    "DOMAIN-SUFFIX,xbox.com,Microsoft",
    "DOMAIN-SUFFIX,xboxlive.com,Microsoft",
    "DOMAIN-SUFFIX,xboxlive.net,Microsoft",
    "DOMAIN-SUFFIX,xboxservices.com,Microsoft",
    "DOMAIN-SUFFIX,xboxab.com,Microsoft",

    // Visual Studio / Developer 服务
    "DOMAIN-SUFFIX,visualstudio.com,Microsoft",
    "DOMAIN-SUFFIX,visualstudio.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,vsassets.io,Microsoft",
    "DOMAIN-SUFFIX,vsblob.vsassets.io,Microsoft",

    // Bing
    "DOMAIN-SUFFIX,bing.com,Microsoft",
    "DOMAIN-SUFFIX,bing.net,Microsoft",
    "DOMAIN-SUFFIX,bingapis.com,Microsoft",
    "DOMAIN-SUFFIX,bingusercontent.com,Microsoft",

    // Microsoft CDN / 静态资源
    "DOMAIN-SUFFIX,akamaized.net,Microsoft",
    "DOMAIN-SUFFIX,microsoft.com.akamaized.net,Microsoft",

    // Microsoft 通用关键词
    "DOMAIN-KEYWORD,microsoft,Microsoft",
    "DOMAIN-KEYWORD,windows,Microsoft",
    "DOMAIN-KEYWORD,office365,Microsoft",
    "DOMAIN-KEYWORD,onedrive,Microsoft",
    "DOMAIN-KEYWORD,outlook,Microsoft",
    "DOMAIN-KEYWORD,hotmail,Microsoft",
    "DOMAIN-KEYWORD,xbox,Microsoft",

    // Google
    "DOMAIN-KEYWORD,google,Google",
    "DOMAIN-SUFFIX,gmail.com,Google",
    "DOMAIN-SUFFIX,googleusercontent.com,Google",
    "DOMAIN-SUFFIX,gstatic.com,Google",
    "DOMAIN-SUFFIX,googleapis.com,Google",
    "DOMAIN-SUFFIX,googleusercontent.com,Google",

    // Meta
    // Facebook / Instagram / Threads / Meta AI / Muse
    // 统一进入 Meta 策略组。
    // Facebook
    "DOMAIN-SUFFIX,facebook.com,Meta",
    "DOMAIN-SUFFIX,facebook.net,Meta",
    "DOMAIN-SUFFIX,fbcdn.net,Meta",
    "DOMAIN-SUFFIX,fbsbx.com,Meta",
    "DOMAIN-SUFFIX,fb.com,Meta",
    // Instagram
    "DOMAIN-SUFFIX,instagram.com,Meta",
    "DOMAIN-SUFFIX,cdninstagram.com,Meta",
    "DOMAIN-SUFFIX,instagram.net,Meta",
    // Threads
    "DOMAIN-SUFFIX,threads.com,Meta",
    "DOMAIN-SUFFIX,threads.net,Meta",
    // Messenger
    "DOMAIN-SUFFIX,messenger.com,Meta",
    // Meta AI / Muse
    "DOMAIN-SUFFIX,meta.ai,Meta",
    "DOMAIN-SUFFIX,ai.meta.com,Meta",
    "DOMAIN-SUFFIX,muse.ai,Meta",

    // X
    "DOMAIN-SUFFIX,x.com,X",
    "DOMAIN-SUFFIX,twitter.com,X",
    "DOMAIN-SUFFIX,t.co,X",
    "DOMAIN-SUFFIX,twimg.com,X",

    // WhatsApp
    "DOMAIN-SUFFIX,whatsapp.com,WhatsApp",
    "DOMAIN-SUFFIX,whatsapp.net,WhatsApp",
    "DOMAIN-SUFFIX,wa.me,WhatsApp",
    "DOMAIN-SUFFIX,whatsapp.org,WhatsApp",

    // Telegram
    "DOMAIN-SUFFIX,telegram.org,Telegram",
    "DOMAIN-SUFFIX,telegram.me,Telegram",
    "DOMAIN-SUFFIX,t.me,Telegram",
    "DOMAIN-SUFFIX,tdesktop.com,Telegram",
    "DOMAIN-SUFFIX,telegra.ph,Telegram",
    "DOMAIN-SUFFIX,telegram.dog,Telegram",

    "IP-CIDR,91.108.4.0/22,Telegram,no-resolve",
    "IP-CIDR,91.108.8.0/22,Telegram,no-resolve",
    "IP-CIDR,91.108.12.0/22,Telegram,no-resolve",
    "IP-CIDR,91.108.16.0/22,Telegram,no-resolve",
    "IP-CIDR,91.108.20.0/22,Telegram,no-resolve",
    "IP-CIDR,91.108.56.0/22,Telegram,no-resolve",
    "IP-CIDR,149.154.160.0/20,Telegram,no-resolve",
    "IP-CIDR6,2001:b28:f23d::/48,Telegram,no-resolve",
    "IP-CIDR6,2001:b28:f23f::/48,Telegram,no-resolve",
    "IP-CIDR6,2001:67c:4e8::/48,Telegram,no-resolve",

    // Github
    "DOMAIN-SUFFIX,github.com,Github",
    "DOMAIN-SUFFIX,githubusercontent.com,Github",
    "DOMAIN-SUFFIX,githubassets.com,Github",
    "DOMAIN-SUFFIX,raw.githubusercontent.com,Github",
    "DOMAIN-SUFFIX,github.io,Github",
    "DOMAIN-SUFFIX,github.dev,Github",
    "DOMAIN-SUFFIX,githubstatus.com,Github",

    // Speedtest
    "DOMAIN-SUFFIX,speedtest.net,Speedtest",
    "DOMAIN-SUFFIX,speedtest.com,Speedtest",
    "DOMAIN-SUFFIX,ookla.com,Speedtest",
    "DOMAIN-SUFFIX,ooklaserver.net,Speedtest",
    "DOMAIN-SUFFIX,ookla.net,Speedtest",
    "DOMAIN-SUFFIX,speedtestcustom.com,Speedtest",

    // 中国大陆
    "RULE-SET,ChinaMax,DIRECT",
    "RULE-SET,ChinaMax_Domain,DIRECT",
    "RULE-SET,ChinaMax_IP,DIRECT",
    "GEOSITE,CN,DIRECT",
    "GEOIP,CN,DIRECT,no-resolve",

    // 最终兜底
    "MATCH,PROXY-Gate"
  ];

  // ============================================================
  // Rule Providers
  // ============================================================

  fixed["rule-providers"] = {
    "Apple": {
      "type": "http",
      "behavior": "classical",
      "format": "yaml",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple.yaml"
    },

    "Apple_Domain": {
      "type": "http",
      "behavior": "domain",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/kiki-rgb-00/kiki/refs/heads/main/MRS/Apple_Domain.mrs"
    },

    "AdvertisingLite": {
      "type": "http",
      "behavior": "classical",
      "format": "yaml",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/AdvertisingLite/AdvertisingLite.yaml"
    },

    "AdvertisingLite_Domain": {
      "type": "http",
      "behavior": "domain",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/kiki-rgb-00/kiki/refs/heads/main/MRS/AdvertisingLite_Domain.mrs"
    },

    "Privacy": {
      "type": "http",
      "behavior": "classical",
      "format": "yaml",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Privacy/Privacy.yaml"
    },

    "Privacy_Domain": {
      "type": "http",
      "behavior": "domain",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/kiki-rgb-00/kiki/refs/heads/main/MRS/Privacy_Domain.mrs"
    },

    "ACL4SSR_BanAD": {
      "type": "http",
      "behavior": "domain",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/mrs/BanAD_domain.mrs"
    },

    "ACL4SSR_BanProgramAD": {
      "type": "http",
      "behavior": "domain",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/mrs/BanProgramAD_domain.mrs"
    },

    "ChinaMax": {
      "type": "http",
      "behavior": "classical",
      "format": "yaml",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/ChinaMax/ChinaMax.yaml"
    },

    "ChinaMax_Domain": {
      "type": "http",
      "behavior": "domain",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/kiki-rgb-00/kiki/refs/heads/main/MRS/ChinaMax_Domain.mrs"
    },

    "ChinaMax_IP": {
      "type": "http",
      "behavior": "ipcidr",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/kiki-rgb-00/kiki/refs/heads/main/MRS/ChinaMax_IP.mrs"
    }
  };

  return fixed;
}