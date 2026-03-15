// Blog posts - Rewritten for Gen Z / non-political readers
// Simple language, no jargon, clear explanations

export const blogPosts = [
  {
    id: "why-america-fighting-iran",
    slug: "why-america-fighting-iran",
    title: "Why Are America and Iran Fighting? The Full Story",
    excerpt: "America and Iran have been enemies for 70 years. Here's what actually happened—no politics degree required.",
    category: "Explainer",
    readTime: "8 min",
    date: "March 5, 2026",
    image: "/images/blog/why-america-iran.jpg",
    author: {
      name: "WW3 Tracker",
      role: "Conflict Analysis",
      avatar: null
    },
    tags: ["History", "Beginner", "1953", "Revolution"],
    sections: [
      { id: "summary", title: "TL;DR" },
      { id: "1953", title: "1953: America Overthrew Their Government" },
      { id: "1979", title: "1979: Iran Fought Back" },
      { id: "today", title: "Why They're Fighting Now" }
    ],
    quickFacts: [
      { label: "How Long", value: "70 Years" },
      { label: "Started When", value: "1953" },
      { label: "Main Issue", value: "Oil & Power" },
      { label: "Current Status", value: "Active War" }
    ],
    keyTakeaway: {
      points: [
        "In 1953, America secretly overthrew Iran's democratic government to steal their oil",
        "Iranians never forgot this betrayal—they call it 'The Original Sin'",
        "In 1979, they kicked out the US-backed dictator and became an Islamic Republic",
        "America has been trying to control or destroy Iran ever since",
        "The 'nuclear threat' is just the latest excuse—it's really about oil and power"
      ]
    },
    timeline: [
      {
        year: "1953",
        title: "America Steals Iran's Oil",
        description: "CIA overthrows Iran's elected leader to install a dictator who'd give America cheap oil. Think of it like a hostile takeover, but for an entire country.",
        icon: "coup",
        highlight: true
      },
      {
        year: "1979",
        title: "Iran Kicks Out the US Puppet",
        description: "After 25 years of brutal rule by America's guy (the Shah), Iranians revolt. They take US embassy workers hostage for 444 days. Relations are broken forever.",
        icon: "revolution",
        highlight: true
      },
      {
        year: "2015",
        title: "Obama Makes a Deal",
        description: "Iran agrees to stop making nuclear weapons in exchange for lifted sanctions. It's working—everyone's happy.",
        icon: "peace"
      },
      {
        year: "2018",
        title: "Trump Tears It Up",
        description: "Trump pulls out of the deal, puts sanctions back. Iran says 'fine, we'll make nukes then.' Tensions skyrocket.",
        icon: "war",
        highlight: true
      },
      {
        year: "2020",
        title: "America Assassinates Iranian General",
        description: "Trump drone-strikes Qasem Soleimani, Iran's most popular military leader. Iran promises revenge.",
        icon: "death"
      },
      {
        year: "2026",
        title: "Full War Starts",
        description: "Israel (America's ally) and US launch massive strikes on Iran. Supreme Leader killed. Here we are.",
        icon: "war",
        highlight: true
      }
    ],
    content: `
## TL;DR — The 30-Second Version

**America overthrew Iran's government in 1953 to steal their oil.** Iranians never forgot. In 1979, they kicked out America's puppet dictator. America has been trying to control or destroy Iran ever since. The "nuclear weapons" thing is just the latest excuse.

**Think of it like this:** Imagine your neighbor broke into your house 70 years ago, stole your stuff, and installed their friend as the new owner of your house. You finally kick them out. Now that neighbor keeps trying to break back in, saying it's because you might buy a security camera.

---

## 1953: What Actually Happened (The "CIA Coup")

**The Setup:**
In the 1950s, Iran had a democratically elected leader named Mohammad Mossadegh. He wanted Iran's oil to benefit Iranians, not British and American companies. So he took control of the oil industry.

**America's Response:**
The CIA (America's spy agency) paid protesters, bribed politicians, and spread propaganda to overthrow Mossadegh. They installed a king (the Shah) who let America and Britain take Iran's oil.

**Why This Matters:**
Imagine if China secretly overthrew the US president, installed their own guy, and took all America's oil. Then told you to "get over it" when you complained. That's how Iranians feel.

**The Shah's Rule:**
For 25 years, the Shah ruled with an iron fist:
- Secret police tortured and killed opponents
- Billions in oil money went to America and Britain
- Regular Iranians stayed poor
- Anyone who complained was arrested

---

## 1979: The Revolution (Iran Fights Back)

By 1979, Iranians had enough. Mass protests forced the Shah to flee. Religious leader Ayatollah Khomeini returned from exile and created the Islamic Republic.

**The Hostage Crisis:**
Revolutionary students stormed the US embassy and took 52 Americans hostage for 444 days. Why? They were terrified America would do another 1953-style coup. They wanted leverage.

**America's Response:**
America cut all ties with Iran. Froze their assets. Started calling them evil. This is why they chant "Death to America"—they see America as the country that destroyed their democracy and supported their dictator.

---

## Why They're Fighting Now

**The Nuclear Issue:**
Iran says they want nuclear power for electricity. America and Israel say "nah, you're making bombs." 

**The Real Reasons:**
1. **Oil** — Iran has massive oil reserves. America wants influence over them.
2. **Israel** — Iran supports groups that oppose Israel. Israel wants Iran destroyed.
3. **Power** — America doesn't want any country in the Middle East that doesn't obey them.
4. **Old Grudges** — Neither side can back down without looking weak.

**Bottom Line:**
This isn't about nuclear weapons. That's just the excuse. It's about America wanting to control the Middle East, and Iran refusing to be controlled.
`,
    faq: [
      {
        question: "What is a 'CIA coup'?",
        answer: "It's when America's spy agency (the CIA) secretly overthrows another country's government. In 1953, they did this to Iran to steal their oil. They paid protesters, bribed politicians, and spread fake news until the government fell."
      },
      {
        question: "Why do Iranians hate America?",
        answer: "Imagine if a foreign country destroyed your democracy, installed a brutal dictator who tortured your people, and stole your natural resources for 25 years. Then when you finally kicked them out, they sanctioned you and tried to ruin your economy. You'd probably hate them too."
      },
      {
        question: "Is this about nuclear weapons?",
        answer: "That's what they say publicly, but not really. Iran had a deal to not make nukes (2015), and they were following it. America tore up the deal anyway. The real issue is America wants to control Iran's oil and the Middle East, and Iran refuses."
      },
      {
        question: "Who's the 'good guy'?",
        answer: "Neither. The Iranian government is authoritarian and repressive. But America literally destroyed their democracy to steal oil. Both have done terrible things. Regular people in both countries suffer while leaders play geopolitical chess."
      }
    ]
  },
  {
    id: "us-vs-iran-military",
    slug: "us-vs-iran-military",
    title: "US vs Iran: Who Would Actually Win?",
    excerpt: "America spends $886 billion on military. Iran spends $25 billion. But war isn't about spreadsheets.",
    category: "Military",
    readTime: "6 min",
    date: "March 3, 2026",
    image: "/images/blog/us-vs-iran-military.jpg",
    author: {
      name: "WW3 Tracker",
      role: "Military Analysis",
      avatar: null
    },
    tags: ["Military", "Comparison", "War"],
    sections: [
      { id: "summary", title: "TL;DR" },
      { id: "numbers", title: "By The Numbers" },
      { id: "reality", title: "The Reality" }
    ],
    quickFacts: [
      { label: "US Military Budget", value: "$886B" },
      { label: "Iran Military Budget", value: "$25B" },
      { label: "US Active Troops", value: "1.3M" },
      { label: "Iran Active Troops", value: "580K" }
    ],
    keyTakeaway: {
      points: [
        "America has way more money and weapons—on paper they should win easily",
        "But Iran is huge (4x California) with mountains everywhere—hard to invade",
        "Iran has thousands of missiles that can hit US bases and Israel",
        "Iran's allies (Hezbollah, Houthis) can attack from multiple directions",
        "Occupying Iran would be impossible—85 million people would resist"
      ]
    },
    content: `
## TL;DR

**On paper:** America wins in 5 minutes. They're the world's strongest military vs a mid-tier regional power.

**In reality:** Iran is way harder to defeat than it looks. Mountains everywhere. Thousands of missiles. Allies all over the Middle East. Invading would be a nightmare. Think Afghanistan, but 4x bigger with better weapons.

---

## By The Numbers

| Thing | America | Iran |
|-------|---------|------|
| Military Budget | $886 billion | $25 billion |
| Active Soldiers | 1.3 million | 580,000 |
| Fighter Jets | 13,000 | 340 |
| Aircraft Carriers | 11 | 0 |
| Nuclear Weapons | 5,000+ | 0 (probably) |
| Missiles | Thousands | Thousands |

**Looks like an easy win for America, right?** Not so fast.

---

## Why Iran Is Harder Than It Looks

**1. Geography = Nightmare**
- Iran is 4x the size of California
- Mountains everywhere (perfect for hiding)
- Deserts, forests, urban areas
- Invading and holding this territory? Nearly impossible

**2. The "Missile Problem"**
Iran has thousands of missiles pointed at:
- US bases in the Middle East
- Israel
- Saudi oil facilities
- Shipping in the Persian Gulf

Even if America wins quickly, Iran can cause massive damage on the way down.

**3. The Proxy Army**
Iran doesn't fight alone. They have allies everywhere:
- **Hezbollah** (Lebanon) — can attack Israel
- **Houthis** (Yemen) — can attack Saudi Arabia and shipping
- **Shia militias** (Iraq) — can attack US troops there
- **Hamas** (Gaza) — can attack Israel

Hit Iran, and you get hit from 5 directions at once.

**4. The Population Problem**
85 million people live in Iran. If even 1% decide to resist occupation, that's 850,000 guerrilla fighters. America couldn't handle Iraq (30M people). Iran is nearly 3x bigger.

---

## What Would Actually Happen

**Scenario 1: Air Strikes Only (What's happening now)**
- America bombs Iranian facilities
- Iran fires missiles at US bases and Israel
- Both sides claim victory
- War drags on for years

**Scenario 2: Full Invasion (Very unlikely)**
- America would eventually win militarily
- Then face decades of insurgency
- Thousands of American deaths
- Trillions of dollars
- Political suicide at home

**Reality Check:**
America could destroy Iran's military. But they can't *hold* Iran. Just like Afghanistan—bomb all you want, but eventually you leave, and the other side is still there.
`,
    faq: [
      {
        question: "Who has a stronger military?",
        answer: "America, by far. They have more money, more weapons, more technology. But wars aren't just about who's stronger on paper. Iran has home-field advantage, lots of missiles, and geography on their side."
      },
      {
        question: "Could Iran beat America?",
        answer: "In a conventional war? No. In a 'make America bleed so much they give up' war? Maybe. Iran can hit US bases, disrupt oil shipping, and make occupation a nightmare. Think David vs Goliath, but David has missiles."
      },
      {
        question: "What are 'proxies'?",
        answer: "Groups that Iran funds and supports to fight for them. Like Hezbollah in Lebanon, Houthis in Yemen, and militias in Iraq. Instead of Iran soldiers attacking directly, these allies do it for them."
      }
    ]
  },
  {
    id: "israel-iran-war",
    slug: "israel-iran-war",
    title: "Israel vs Iran: Why They Hate Each Other",
    excerpt: "Israel and Iran are fighting a shadow war that just went hot. Here's why they want to destroy each other.",
    category: "Israel-Iran",
    readTime: "7 min",
    date: "March 1, 2026",
    image: "/images/blog/israel-iran-war.jpg",
    author: {
      name: "WW3 Tracker",
      role: "Middle East Analysis",
      avatar: null
    },
    tags: ["Israel", "Iran", "Conflict"],
    sections: [
      { id: "summary", title: "TL;DR" },
      { id: "religious", title: "Religious Angle" },
      { id: "power", title: "Power Struggle" }
    ],
    quickFacts: [
      { label: "Israel's Fear", value: "Iran Nukes" },
      { label: "Iran's Goal", value: "Destroy Israel" },
      { label: "Proxy Groups", value: "Hezbollah, Hamas" },
      { label: "Status", value: "Active War" }
    ],
    keyTakeaway: {
      points: [
        "Iran's leaders have promised to 'wipe Israel off the map' since 1979",
        "Israel sees Iranian nuclear weapons as an existential threat—they'd cease to exist",
        "Iran funds Hamas, Hezbollah, and others to attack Israel without direct war",
        "Israel has been assassinating Iranian scientists and bombing facilities for years",
        "Both see this as a fight to the death—neither can afford to lose"
      ]
    },
    content: `
## TL;DR

Iran wants Israel destroyed. Israel wants Iran's nuclear program destroyed. Both have been fighting a secret war for years. Now it's public.

**Iran's view:** Israel is a fake country built on stolen Palestinian land, propped up by America. It has no right to exist.

**Israel's view:** Iran is run by religious fanatics who want to commit genocide against Jews. We have to strike first or we'll be destroyed.

**The reality:** Both are partially right. Both are committing atrocities. Regular people suffer while extremists on both sides play chicken with nuclear weapons.

---

## The Religious/Existential Angle

**Iran's Position:**
Since 1979, Iran's leaders have called Israel "the Little Satan" (America is the "Great Satan"). They've promised repeatedly to destroy Israel.

Why? A mix of:
- Supporting Palestinians who were displaced when Israel was created
- Religious opposition to a Jewish state on Muslim land
- Using Israel as a rallying point for anti-American sentiment

**Israel's Position:**
Israel was created in 1948 after the Holocaust. The entire country exists because Jewish people needed a safe place after nearly being wiped out.

When Iran's leader says "Israel must be destroyed," Israelis hear: "We want to finish what Hitler started."

**The Result:**
Israel sees Iranian nuclear weapons as an existential threat. Not "we'll lose a war" threat—"we'll cease to exist as a country and millions of Jews will die" threat.

That's why Israel has been assassinating Iranian nuclear scientists, bombing facilities, and lobbying America to attack.

---

## The Power Struggle

**Iran's Strategy:**
- Can't fight Israel directly (too far, too strong)
- So fund groups that can: Hamas, Hezbollah, Palestinian Islamic Jihad
- Build missiles that can hit Israel
- Build nuclear weapons (allegedly) as insurance

**Israel's Strategy:**
- Bomb Iranian facilities and scientists
- Support anti-Iran groups
- Get America to do the heavy lifting
- Maintain nuclear monopoly in the region

**The Shadow War (Before 2026):**
For years, they've been fighting in the shadows:
- Israel bombs Iranian facilities in Syria
- Iran ships weapons to Hezbollah
- Israel assassinates Iranian scientists
- Iran launches rockets at Israel via proxies

Now it's out in the open.
`,
    faq: [
      {
        question: "Does Iran really want to destroy Israel?",
        answer: "Iranian leaders have literally promised to 'wipe Israel off the map' for 40+ years. Whether they actually would if they had the power is debated, but Israelis believe they would. That's what matters."
      },
      {
        question: "Why does Israel care so much about Iranian nukes?",
        answer: "Israel is tiny (smaller than New Jersey). A few nuclear bombs could literally destroy the entire country. Iran's leaders have promised to destroy Israel. Do the math—Israel sees this as 'they get nukes, we die.'"
      },
      {
        question: "What are Hamas and Hezbollah?",
        answer: "Groups that fight Israel. Iran funds them with weapons and money so they can attack Israel without Iran having to do it directly. Think of them as subcontractors for war."
      }
    ]
  }
];

export default blogPosts;
