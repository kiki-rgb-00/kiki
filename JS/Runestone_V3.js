/* Runestone V3 — routing-only Hako post-merge override.
 * Import the raw JavaScript URL, save, and select it after node-source merging.
 * Network settings and node objects are retained. Rules and groups are replaced.
 * URL import is a snapshot: re-import to upgrade. See docs/RUNESTONE_V3.md.
 */
const RUNESTONE = {repository: "kiki-rgb-00/kiki", personal: false};

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

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("Runestone: expected a configuration object");
  }
  if (!currentProxies.length) {
    throw new Error("Runestone: no materialized nodes; select node sources and use the post-merge script stage");
  }
  if (currentProxies.some(p => !p || typeof p !== "object" || typeof p.name !== "string" || !p.name.trim())) {
    throw new Error("Runestone: every node must be an object with a non-empty name");
  }
  if (new Set(currentProxyNames).size !== currentProxyNames.length) {
    throw new Error("Runestone: duplicate node names; rename conflicting nodes in the source");
  }

  // Preserve client-owned networking and provider fields. Replace routing below.
  const fixed = Object.assign({}, config);
  fixed.mode = "rule";
  fixed.profile = Object.assign({}, config.profile, {"store-selected": true});

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

  // Microsoft 紧跟 Copilot
  // Copilot 保持独立，不并入 Microsoft。
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
    "name": "Grok",
    "type": "select",
    "icon": "https://raw.githubusercontent.com/luestr/IconResource/main/App_icon/120px/Grok.png",
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

  // Apple 紧跟 Google
  fixed["proxy-groups"].push({
    "name": "Apple",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Apple.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "X",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash/icon/x.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Facebook",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Facebook.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Instagram",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Instagram.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "WhatsApp",
    "type": "select",
    "icon": "https://raw.githubusercontent.com/kiki-rgb-00/kiki/refs/heads/main/Ti/WhatsApp.png",
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
  // 没有节点的地区不会生成策略组。
  // ============================================================

  const regionGroups = [
    {
      key: "US",
      name: "🇺🇸 US",
      filter: /([\[]US[\]]|^US$|USA|United[ _-]?States|\bUS\b|美国|美國|🇺🇸)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png"
    },

    {
      key: "SG",
      name: "🇸🇬 SG",
      filter: /([\[]SG[\]]|^SG$|Singapore|\bSG\b|新加坡|狮城|🇸🇬)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png"
    },

    {
      key: "HK",
      name: "🇭🇰 HK",
      filter: /([\[]HK[\]]|^HK$|Hong[ _-]?Kong|\bHK\b|香港|🇭🇰)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png"
    },

    {
      key: "JP",
      name: "🇯🇵 JP",
      filter: /([\[]JP[\]]|^JP$|Japan|\bJP\b|日本|东京|大阪|🇯🇵)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png"
    },

    {
      key: "TW",
      name: "🇹🇼 TW",
      filter: /([\[]TW[\]]|^TW$|Taiwan|Taibei|Taipei|\bTW\b|台湾|臺灣|台北|高雄|🇹🇼)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png"
    },

    {
      key: "UK",
      name: "🇬🇧 UK",
      filter: /([\[]UK[\]]|^UK$|United[ _-]?Kingdom|Britain|England|\bUK\b|英国|英國|伦敦|🇬🇧)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_Kingdom.png"
    },

    {
      key: "DE",
      name: "🇩🇪 DE",
      filter: /([\[]DE[\]]|^DE$|Germany|Deutschland|\bDE\b|德国|德國|法兰克福|🇩🇪)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Germany.png"
    },

    {
      key: "FR",
      name: "🇫🇷 FR",
      filter: /([\[]FR[\]]|^FR$|France|\bFR\b|法国|法國|巴黎|🇫🇷)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/France.png"
    },

    {
      key: "RU",
      name: "🇷🇺 RU",
      filter: /([\[]RU[\]]|^RU$|Russia|Russian[ _-]?Federation|\bRU\b|俄罗斯|俄羅斯|莫斯科|伯力|🇷🇺)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Russia.png"
    }
  ];

  regionGroups.push(
    {
      key: "MY",
      name: "🇲🇾 MY",
      filter: /(🇲🇾|马来西亚|馬來西亞|吉隆坡|Malaysia|Kuala[ _-]?Lumpur|(?:^|[^a-z0-9])MY(?:$|[^a-z0-9])|^MY[0-9])/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Malaysia.png"
    },

    {
      key: "AU",
      name: "🇦🇺 AU",
      filter: /(🇦🇺|澳大利亚|澳大利亞|澳洲|悉尼|墨尔本|墨爾本|Australia|Sydney|Melbourne|(?:^|[^a-z0-9])AU(?:$|[^a-z0-9])|^AU[0-9])/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Australia.png"
    },

    {
      key: "IN",
      name: "🇮🇳 IN",
      filter: /(🇮🇳|印度|孟买|孟買|新德里|India|Mumbai|New[ _-]?Delhi|(?:^|[^a-z0-9])IN(?:$|[^a-z0-9])|^IN[0-9])/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/India.png"
    }
  );

  const existingRegionalAutos = [];

  regionGroups.forEach(region => {
    const matched = currentProxyNames.filter(
      name => region.filter.test(name)
    );

    const autoName = region.name + "-Auto";

    // 没有节点则完全不生成该地区组。
    if (matched.length === 0) {
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

    existingRegionalAutos.push(autoName);
  });

  // ============================================================
  // 4. 将实际存在的 Auto 组加入服务策略组
  //
  // 例如：
  // 如果实际只有 US / SG / JP：
  //
  // YouTube:
  // All-Nodes
  // US-Auto
  // SG-Auto
  // JP-Auto
  // PROXY-Gate
  // DIRECT
  //
  // Microsoft 同样自动获得实际存在的地区 Auto。
  // ============================================================

  const serviceProxyChoices = [
    "🖥️ All-Nodes",
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
    "Microsoft",
    "Grok",
    "Google",
    "Apple",
    "X",
    "Facebook",
    "Instagram",
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
  // 同样只加入实际存在的地区 Auto。
  // ============================================================

  const proxyGate = fixed["proxy-groups"].find(
    group => group.name === "PROXY-Gate"
  );

  if (proxyGate) {
    proxyGate.proxies = [
      "🖥️ All-Nodes",
      ...existingRegionalAutos,
      "DIRECT"
    ];
  }

  // ============================================================
  // 6. Apple Push 专用 APNs-Fallback
  //
  // 只引用实际生成的地区 Auto。
  //
  // Apple Push 本身仍然保持：
  // Apple Push
  //   ├─ APNs-Fallback
  //   └─ DIRECT
  //
  // APNs-Fallback：
  //   ├─ US-Auto（如果存在）
  //   ├─ SG-Auto（如果存在）
  //   ├─ HK-Auto（如果存在）
  //   └─ ...
  // ============================================================

  fixed["proxy-groups"].push({
    name: "APNs-Fallback",
    type: "fallback",
    proxies: existingRegionalAutos.length ? existingRegionalAutos : currentProxyNames.slice(),
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Apple.png",
    url: "http://captive.apple.com/hotspot-detect.html",
    interval: 300
  });

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

    // ============================================================
    // Copilot
    //
    // 必须位于 Microsoft 通用规则之前。
    // ============================================================

    "DOMAIN-SUFFIX,copilot.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,ai.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,designer.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,copilot.com,Copilot",
    "DOMAIN-KEYWORD,copilot,Copilot",

    // ============================================================
    // Microsoft
    //
    // Microsoft 独立策略组。
    //
    // Copilot 已在上方单独匹配，因此这里不处理 Copilot。
    // ============================================================

    // Microsoft Account / Identity / Login
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
    "DOMAIN-SUFFIX,live.com,Microsoft",
    "DOMAIN-SUFFIX,live.net,Microsoft",

    // Outlook / Hotmail / Mail
    "DOMAIN-SUFFIX,outlook.com,Microsoft",
    "DOMAIN-SUFFIX,outlook.live.com,Microsoft",
    "DOMAIN-SUFFIX,outlook.office.com,Microsoft",
    "DOMAIN-SUFFIX,hotmail.com,Microsoft",
    "DOMAIN-SUFFIX,hotmail.co.uk,Microsoft",
    "DOMAIN-SUFFIX,office365.com,Microsoft",

    // Microsoft 365 / Office
    "DOMAIN-SUFFIX,microsoft365.com,Microsoft",
    "DOMAIN-SUFFIX,microsoft365.us,Microsoft",
    "DOMAIN-SUFFIX,office.com,Microsoft",
    "DOMAIN-SUFFIX,office.net,Microsoft",
    "DOMAIN-SUFFIX,office365.com,Microsoft",
    "DOMAIN-SUFFIX,officeapps.live.com,Microsoft",
    "DOMAIN-SUFFIX,officeclient.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,officecdn.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,msocdn.com,Microsoft",
    "DOMAIN-SUFFIX,microsoftonline.com,Microsoft",
    "DOMAIN-SUFFIX,microsoftonline-p.com,Microsoft",
    "DOMAIN-SUFFIX,microsoftonline-p.net,Microsoft",

    // OneDrive
    "DOMAIN-SUFFIX,onedrive.com,Microsoft",
    "DOMAIN-SUFFIX,onedrive.live.com,Microsoft",
    "DOMAIN-SUFFIX,1drv.com,Microsoft",
    "DOMAIN-SUFFIX,onedriveusercontent.com,Microsoft",

    // SharePoint
    "DOMAIN-SUFFIX,sharepoint.com,Microsoft",
    "DOMAIN-SUFFIX,sharepointonline.com,Microsoft",

    // Microsoft Teams
    "DOMAIN-SUFFIX,teams.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,teams.live.com,Microsoft",
    "DOMAIN-SUFFIX,teams.cloud.microsoft,Microsoft",
    "DOMAIN-SUFFIX,skype.com,Microsoft",
    "DOMAIN-SUFFIX,skypeassets.com,Microsoft",

    // Microsoft Store
    "DOMAIN-SUFFIX,microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,microsoftstore.com,Microsoft",
    "DOMAIN-SUFFIX,apps.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,storeedgefd.dsx.mp.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,displaycatalog.mp.microsoft.com,Microsoft",

    // Windows / Windows Update
    "DOMAIN-SUFFIX,windows.com,Microsoft",
    "DOMAIN-SUFFIX,windows.net,Microsoft",
    "DOMAIN-SUFFIX,windowsupdate.com,Microsoft",
    "DOMAIN-SUFFIX,update.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,windowsupdate.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,download.windowsupdate.com,Microsoft",
    "DOMAIN-SUFFIX,delivery.mp.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,dl.delivery.mp.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,ctldl.windowsupdate.com,Microsoft",
    "DOMAIN-SUFFIX,emdl.ws.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,do.dsp.mp.microsoft.com,Microsoft",

    // Microsoft Services / CDN
    "DOMAIN-SUFFIX,azureedge.net,Microsoft",
    "DOMAIN-SUFFIX,azurefd.net,Microsoft",
    "DOMAIN-SUFFIX,msft.net,Microsoft",
    "DOMAIN-SUFFIX,msftncsi.com,Microsoft",
    "DOMAIN-SUFFIX,msftconnecttest.com,Microsoft",
    "DOMAIN-SUFFIX,msecnd.net,Microsoft",
    "DOMAIN-SUFFIX,edgesuite.net,Microsoft",

    // Azure
    "DOMAIN-SUFFIX,azure.com,Microsoft",
    "DOMAIN-SUFFIX,azure.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,azurewebsites.net,Microsoft",
    "DOMAIN-SUFFIX,cloudapp.azure.com,Microsoft",
    "DOMAIN-SUFFIX,management.azure.com,Microsoft",
    "DOMAIN-SUFFIX,portal.azure.com,Microsoft",
    "DOMAIN-SUFFIX,graph.microsoft.com,Microsoft",

    // Microsoft Graph / APIs
    "DOMAIN-SUFFIX,graph.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,graph.windows.net,Microsoft",
    "DOMAIN-SUFFIX,api.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,apis.microsoft.com,Microsoft",

    // Xbox
    "DOMAIN-SUFFIX,xbox.com,Microsoft",
    "DOMAIN-SUFFIX,xboxlive.com,Microsoft",
    "DOMAIN-SUFFIX,xboxlive.net,Microsoft",
    "DOMAIN-SUFFIX,gamepass.com,Microsoft",

    // Visual Studio / Developer
    "DOMAIN-SUFFIX,visualstudio.com,Microsoft",
    "DOMAIN-SUFFIX,visualstudio.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,vsassets.io,Microsoft",
    "DOMAIN-SUFFIX,nuget.org,Microsoft",

    // Bing
    "DOMAIN-SUFFIX,bing.com,Microsoft",
    "DOMAIN-SUFFIX,bing.net,Microsoft",

    // Microsoft telemetry / diagnostics
    "DOMAIN-SUFFIX,events.data.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,v10.events.data.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,v20.events.data.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,settings-win.data.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,watson.microsoft.com,Microsoft",
    "DOMAIN-SUFFIX,watson.telemetry.microsoft.com,Microsoft",

    // Grok
    "DOMAIN-SUFFIX,grok.com,Grok",
    "DOMAIN-SUFFIX,x.ai,Grok",

    // Google
    "DOMAIN-SUFFIX,gmail.com,Google",
    "DOMAIN-SUFFIX,googleusercontent.com,Google",
    "DOMAIN-SUFFIX,gstatic.com,Google",
    "DOMAIN-SUFFIX,googleapis.com,Google",
    "DOMAIN-SUFFIX,googleusercontent.com,Google",

    // X
    "DOMAIN-SUFFIX,x.com,X",
    "DOMAIN-SUFFIX,twitter.com,X",
    "DOMAIN-SUFFIX,t.co,X",
    "DOMAIN-SUFFIX,twimg.com,X",

    // Facebook
    "DOMAIN-SUFFIX,facebook.com,Facebook",
    "DOMAIN-SUFFIX,facebook.net,Facebook",
    "DOMAIN-SUFFIX,fbcdn.net,Facebook",
    "DOMAIN-SUFFIX,fbsbx.com,Facebook",
    "DOMAIN-SUFFIX,fb.com,Facebook",

    // Instagram
    "DOMAIN-SUFFIX,instagram.com,Instagram",
    "DOMAIN-SUFFIX,cdninstagram.com,Instagram",
    "DOMAIN-SUFFIX,instagram.net,Instagram",

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

  // All project-owned MRS resources follow one configurable repository.
  Object.values(fixed["rule-providers"]).forEach(provider => {
    provider.url = provider.url.replace(
      "Sydney-Moses/Network-Profiles",
      RUNESTONE.repository
    );
  });

  fixed.rules = [...new Set(fixed.rules)];

  const added = ["Pixiv", "LinkedIn", "Threads"];

  added.forEach(name => {
    fixed["rule-providers"][name + "_Domain"] = {
      type: "http",
      behavior: "domain",
      format: "mrs",
      interval: 86400,
      url:
        "https://raw.githubusercontent.com/" +
        RUNESTONE.repository +
        "/main/MRS/" +
        name +
        "_Domain.mrs"
    };
  });

  const choices = [
    "🇯🇵 JP-Auto",
    "🇸🇬 SG-Auto",
    ...existingRegionalAutos,
    "🖥️ All-Nodes"
  ];

  const serviceIcons = {
    Pixiv: "https://www.google.com/s2/favicons?domain=www.pixiv.net&sz=128",
    LinkedIn: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/linkedin.png",
    Threads: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/threads.png"
  };

  const addedGroups = added.map(name => ({
    name,
    type: "select",
    icon: serviceIcons[name],
    proxies: [...new Set(choices)].filter(n =>
      n === "🖥️ All-Nodes" || existingRegionalAutos.includes(n)
    )
  }));

  const afterSpeedtest =
    fixed["proxy-groups"].findIndex(g => g.name === "Speedtest") + 1;

  fixed["proxy-groups"].splice(
    afterSpeedtest,
    0,
    ...addedGroups
  );

  const beforeServices =
    fixed.rules.findIndex(
      r => r === "DOMAIN-SUFFIX,youtube.com,YouTube"
    );

  fixed.rules.splice(
    beforeServices,
    0,
    ...added.map(
      name => "RULE-SET," + name + "_Domain," + name
    )
  );

  const groups = fixed["proxy-groups"];
  const available = new Set(groups.map(g => g.name));

  const regions = {
    JP: "🇯🇵 JP",
    SG: "🇸🇬 SG",
    HK: "🇭🇰 HK",
    TW: "🇹🇼 TW",
    US: "🇺🇸 US",
    UK: "🇬🇧 UK",
    MY: "🇲🇾 MY",
    AU: "🇦🇺 AU",
    IN: "🇮🇳 IN"
  };

  const order = {
    "PROXY-Gate": ["SG", "JP", "HK"],
    YouTube: ["JP", "MY", "TW", "SG", "US"],
    Spotify: ["MY", "IN", "JP", "US"],
    GPT: ["JP", "SG", "TW", "US"],
    Claude: ["JP", "SG", "TW", "US"],
    Gemini: ["JP", "SG", "TW", "US"],
    Google: ["JP", "SG", "HK"],
    Github: ["JP", "SG", "HK", "US"],
    X: ["JP", "TW", "SG"],
    Pixiv: ["JP", "TW", "SG"],
    Facebook: ["SG", "JP", "US"],
    Instagram: ["SG", "JP", "US"],
    Threads: ["SG", "JP", "US"],
    WhatsApp: ["SG", "JP", "HK"],
    Telegram: ["SG", "JP", "HK"],
    LinkedIn: ["SG", "US", "UK"]
  };

  if (RUNESTONE.personal) {
    groups.forEach(group => {
      if (order[group.name]) {
        const preferred = order[group.name]
          .map(k => regions[k] + "-Auto")
          .filter(n => available.has(n));

        group.proxies = [
          ...new Set([
            ...preferred,
            ...group.proxies
          ])
        ];
      }

      if (group.name === "Apple") {
        group.proxies = [
          "DIRECT",
          ...group.proxies.filter(n => n !== "DIRECT")
        ];
      }

      if (group.name === "Apple Push") {
        group.proxies = [
          "DIRECT",
          "APNs-Fallback"
        ];
      }
    });
  }

  // Never silently shadow a node with a generated group or built-in outbound.
  const reserved = new Set([
    "DIRECT",
    "REJECT",
    "REJECT-DROP",
    "PASS",
    "PASS-RULE",
    "COMPATIBLE",
    ...groups.map(g => g.name)
  ]);

  if (currentProxyNames.some(name => reserved.has(name))) {
    throw new Error(
      "Runestone: node name conflicts with a generated group or built-in outbound"
    );
  }

  if (
    groups.some(g =>
      Object.prototype.hasOwnProperty.call(
        config["proxy-providers"] || {},
        g.name
      )
    )
  ) {
    throw new Error(
      "Runestone: provider name conflicts with a generated group"
    );
  }

  const knownOutbounds = new Set([
    ...reserved,
    ...currentProxyNames
  ]);

  if (
    currentProxies.some(
      p =>
        p["dialer-proxy"] &&
        !knownOutbounds.has(p["dialer-proxy"])
    )
  ) {
    throw new Error(
      "Runestone: dialer-proxy references a source group that routing replacement would remove"
    );
  }

  return fixed;
}
