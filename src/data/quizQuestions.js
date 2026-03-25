/**
 * WW3 Quiz Questions - 35 Total
 * Act 1: "How Did We Get Here?" (10 questions, pick 5)
 * Act 2: "What's Actually Happening" (15 questions, pick 5)
 * Act 3: "What They Don't Want You to Know" (10 questions, pick 5)
 * 
 * Per play: 15 randomly picked (5 from each act)
 * Scoring: 0-100 (wrong = 0 pts, right = ~6.67 pts each)
 */

export const QUIZ_CONFIG = {
  questionsPerAct: 5,
  pointsPerQuestion: 100 / 15, // ~6.67 points
  acts: [
    { id: 1, name: "How Did We Get Here?", description: "The history they didn't teach in school" },
    { id: 2, name: "What's Actually Happening", description: "The war in real-time" },
    { id: 3, name: "What They Don't Want You to Know", description: "The geopolitical chess game" }
  ]
};

// Act 1 — "How Did We Get Here?" (10 questions)
export const ACT1_QUESTIONS = [
  {
    id: "1.1",
    question: "In 1953, Iran had an actual democracy — elected leaders, the whole thing. Then America's spy agency (the CIA) secretly overthrew it and installed a dictator who'd do whatever America wanted. The official excuse for destroying a democracy?",
    options: [
      { text: "Communism", correct: false },
      { text: "Terrorism", correct: false },
      { text: "They wanted Iran's oil", correct: true },
      { text: "Human rights concerns", correct: false }
    ],
    explanation: "Yeah. It was oil. It's always oil.",
    link: "/blog/why-america-fighting-iran"
  },
  {
    id: "1.2",
    question: "After America's CIA overthrew Iran's democracy, they put a king called 'the Shah' in charge. He ruled for 25 years using a secret police force that tortured and killed anyone who disagreed. America's response to all the torture?",
    options: [
      { text: "Condemned it publicly", correct: false },
      { text: "Sent sanctions", correct: false },
      { text: "Looked the other way", correct: false },
      { text: "Kept selling him weapons", correct: true }
    ],
    explanation: "They knew exactly what was happening. They sold him the weapons anyway. This is where 70 years of trust issues began.",
    link: "/blog/why-america-fighting-iran"
  },
  {
    id: "1.3",
    question: "In 2015, after years of negotiation, Iran signed a deal promising not to build nuclear weapons. International inspectors confirmed Iran was following the rules. Then Trump became president and…",
    options: [
      { text: "Extended the deal for 20 more years", correct: false },
      { text: "Added stronger conditions", correct: false },
      { text: "Said 'good job' and moved on", correct: false },
      { text: "Tore the whole thing up", correct: true }
    ],
    explanation: "Iran was complying. Inspectors confirmed it. Didn't matter. Deal was gone. Iran basically said: 'Fine, we'll do what we want then.'",
    link: "/blog/why-america-fighting-iran"
  },
  {
    id: "1.4",
    question: "America's military budget is $886 BILLION per year. Iran's is $25 billion. That's like a billionaire fighting a guy with a lemonade stand. So this war should be over in a weekend, right?",
    options: [
      { text: "Obviously yes", correct: false },
      { text: "Within a month probably", correct: false },
      { text: "Nope — Iran has 85 million people and is covered in mountains you can't bomb flat", correct: true },
      { text: "Iran already surrendered", correct: false }
    ],
    explanation: "Turns out you can't bomb a mountain range into submission. Iran is 4x the size of California, with peaks higher than anything in Europe. Every invasion plan ends at the same conclusion: 'don't.'",
    link: "/blog/us-vs-iran-military"
  },
  {
    id: "1.5",
    question: "There's a tiny strip of ocean between Iran and the Arabian Peninsula — only 33km wide (about 20 miles). Somehow, 21% of ALL the world's oil has to squeeze through it every single day. About 30 massive tankers pass through daily. What's this terrifyingly important bottleneck called?",
    options: [
      { text: "Suez Canal", correct: false },
      { text: "Panama Canal", correct: false },
      { text: "Strait of Hormuz", correct: true },
      { text: "The English Channel", correct: false }
    ],
    explanation: "33km wide. Iran on one side. All your gas prices on the other side. If this closes, the world economy goes into cardiac arrest within a week.",
    link: "/blog/strait-hormuz-closure-economic-impact"
  },
  {
    id: "1.6",
    question: "In 2020, America used a drone to assassinate Iran's top general, Qasem Soleimani — the most popular military figure in the country — while he was at Baghdad airport. Iran swore they'd get revenge. How long did they hold that grudge before striking back?",
    options: [
      { text: "2 weeks", correct: false },
      { text: "6 months", correct: false },
      { text: "2 years", correct: false },
      { text: "6 years — and then all hell broke loose", correct: true }
    ],
    explanation: "Six. Years. Iranians have a saying: 'Revenge is a dish best served at the right moment.' Apparently March 2026 was the moment.",
    link: "/blog/why-america-fighting-iran"
  },
  {
    id: "1.7",
    question: "The US has military bases in literally EVERY country surrounding Iran — Iraq, Afghanistan, Pakistan, Saudi Arabia, UAE, Qatar, Bahrain, Turkey, and more. Iran is basically surrounded by American soldiers. How many military bases does Iran have near America?",
    options: [
      { text: "A few secret ones", correct: false },
      { text: "2", correct: false },
      { text: "1", correct: false },
      { text: "Literally zero", correct: true }
    ],
    explanation: "Zero. None. Zip. And yet somehow Iran is the one described as a 'threat.' Perspective is interesting, isn't it?",
    link: null
  },
  {
    id: "1.8",
    question: "Both America and Iran signed the 2015 nuclear deal (officially called the JCPOA). Both countries promised to hold up their end. International inspectors said Iran was following the rules. So how many of the two countries actually broke the agreement?",
    options: [
      { text: "Both broke it", correct: false },
      { text: "Neither — it's still active", correct: false },
      { text: "Iran broke it first", correct: false },
      { text: "Just the US — they walked out while Iran was complying", correct: true }
    ],
    explanation: "One country broke the deal. It wasn't Iran. The US pulled out in 2018, slapped sanctions back on, and Iran said 'why should WE keep following rules you broke?' Hard to argue with that logic.",
    link: null
  },
  {
    id: "1.9",
    question: "In 1979, Iranians overthrew the US-backed dictator (the Shah). Then they stormed the American embassy in Tehran and held 52 American diplomats hostage for 444 days. It sounds insane. But they had a very specific reason. What were they afraid of?",
    options: [
      { text: "They hated freedom", correct: false },
      { text: "Religious extremism", correct: false },
      { text: "Random revolutionary violence", correct: false },
      { text: "They thought the CIA was about to overthrow them again — like in 1953", correct: true }
    ],
    explanation: "They'd seen this movie before. In 1953, the CIA used the embassy to coordinate the coup. In 1979, they grabbed hostages so it couldn't happen again. Desperate? Absolutely. Random? Not even close.",
    link: null
  },
  {
    id: "1.10",
    question: "Iran's 'Supreme Leader' is basically their most powerful person — more powerful than the president, controls the military, has final say on everything. They're technically chosen by a council of 88 religious scholars. Totally not pressured by the military. Totally democratic. The latest one got the job because…",
    options: [
      { text: "He won an election", correct: false },
      { text: "The council carefully evaluated hundreds of candidates", correct: false },
      { text: "The UN appointed him", correct: false },
      { text: "His dad was the previous Supreme Leader and died", correct: true }
    ],
    explanation: "It's technically not a monarchy because a council votes. But when the council votes for the dead guy's kid? Yeah, that's a monarchy with extra steps.",
    link: "/blog/the-son-who-inherited-war"
  }
];

// Act 2 — "What's Actually Happening" (15 questions)
export const ACT2_QUESTIONS = [
  {
    id: "2.1",
    question: "America spent $1.7 TRILLION (that's 1,700 billion dollars) developing a fighter jet that's supposed to be invisible to radar. Like a ghost in the sky. Then Iran shot one down with a missile that costs less than a new Tesla. What's the plane called?",
    options: [
      { text: "B-2 Spirit", correct: false },
      { text: "F-22 Raptor", correct: false },
      { text: "F-35 Lightning II", correct: true },
      { text: "A-10 Warthog", correct: false }
    ],
    explanation: "$82 million up in smoke. The missile that hit it? Under a million. The Pentagon calls this 'cost asymmetry.' Normal people call it 'getting absolutely played.'",
    link: "/blog/iran-shot-down-f35"
  },
  {
    id: "2.2",
    question: "Iran's new Supreme Leader (the most powerful person in the country) has never held any public office, never appeared on camera, and nobody has ever heard his voice. His FIRST public statement was read by a TV news anchor over a still photograph — no video, no audio. Who is this ghost?",
    options: [
      { text: "A senior military general", correct: false },
      { text: "A respected religious scholar", correct: false },
      { text: "Mojtaba Khamenei — the previous leader's son", correct: true },
      { text: "Iran's former president", correct: false }
    ],
    explanation: "His dad was Supreme Leader for 35 years. His dad got killed in an airstrike. The son got the job 8 days later. Iran's Islamic Republic — built literally to prevent monarchies — just became one.",
    link: "/blog/the-son-who-inherited-war"
  },
  {
    id: "2.3",
    question: "Since 1945 (when nuclear bombs were first used), there's been an unwritten rule: no matter how bad a war gets, you do NOT bomb nuclear facilities. Too risky — one wrong hit could cause a radiation disaster. In March 2026, both the US and Iran broke this 80-year taboo on the SAME day. How close did the nearest missile land to a live nuclear reactor?",
    options: [
      { text: "500km", correct: false },
      { text: "100km", correct: false },
      { text: "About 20km", correct: true },
      { text: "It actually hit the reactor", correct: false }
    ],
    explanation: "20 kilometers. The international nuclear watchdog (IAEA) confirmed 'no radiation leaked.' The word 'luck' was used. Several times. Sleep well.",
    link: "/blog/natanz-dimona-nuclear-exchange"
  },
  {
    id: "2.4",
    question: "Iran and Qatar used to be allies — they even shared a massive gas field together. Then Iran launched missiles and destroyed Qatar's $26 billion LNG (liquefied natural gas) facility. Why would you blow up your own ally's most valuable asset?",
    options: [
      { text: "Border dispute over the gas field", correct: false },
      { text: "Qatar stole Iranian gas", correct: false },
      { text: "Qatar hosts 10,000 American troops at Al Udeid air base", correct: true },
      { text: "It was a targeting error", correct: false }
    ],
    explanation: "Qatar tried to stay 'neutral' while hosting 10,000 of Iran's enemy's soldiers on a base used to bomb Iran. Iran called BS on the neutrality. $26 billion in fire.",
    link: "/blog/qatar-lng-complex-destroyed"
  },
  {
    id: "2.5",
    question: "Here's a fun one: The United States of America is currently dropping bombs on Iran. Also, the United States of America is currently buying Iranian oil. Both happening at the same time. In the same country. This is officially called…",
    options: [
      { text: "A war crime", correct: false },
      { text: "Strategic diplomacy", correct: false },
      { text: "Economic sanctions", correct: false },
      { text: "Tuesday in American foreign policy", correct: true }
    ],
    explanation: "Bombs in the morning, oil purchases in the afternoon. Your tax dollars at work, ladies and gentlemen.",
    link: "/blog/trump-bombing-buying-iran-oil"
  },
  {
    id: "2.6",
    question: "Israel has some of the most advanced missile defense systems in the world — Iron Dome (short range), David's Sling (medium range), and Arrow-3 (long range). Layers upon layers of protection. So when Iranian missiles headed for Tel Aviv, Israel's biggest city, what happened?",
    options: [
      { text: "Every missile was intercepted perfectly", correct: false },
      { text: "Most were intercepted, minor damage", correct: false },
      { text: "Several missiles got through and hit specific buildings", correct: true },
      { text: "Israel has no missile defense", correct: false }
    ],
    explanation: "The 'impenetrable' shield has holes. Iranian missiles hit specific targets in Tel Aviv — not random fire, precision strikes. That changes everything about who feels safe.",
    link: null
  },
  {
    id: "2.7",
    question: "You probably use Amazon Web Services (AWS) without knowing it — it runs Netflix, banking apps, and millions of websites. AWS has data centers in the UAE (United Arab Emirates). Iranian drones hit THREE of them. How much water flooded the server floors and destroyed everything?",
    options: [
      { text: "A few drops", correct: false },
      { text: "4 centimeters — less than 2 inches", correct: true },
      { text: "A full meter of water", correct: false },
      { text: "They caught fire, no water", correct: false }
    ],
    explanation: "4cm. Less than 2 inches. But 2 inches of water on a server rack full of electronics? That's hundreds of millions of dollars of equipment turned into paperweights. First time in history cloud infrastructure was destroyed in a war.",
    link: "/blog/aws-dark-iran-cloud"
  },
  {
    id: "2.8",
    question: "Before the US-Iran war started, Yemen's Houthi rebels (backed by Iran) spent months attacking cargo ships in the Red Sea — it was huge international news. Then the actual war began in March 2026 and the Houthis went… completely silent. No attacks, no statements. Why?",
    options: [
      { text: "The US military destroyed them", correct: false },
      { text: "Saudi Arabia cut a deal with them", correct: false },
      { text: "They joined Iran's formal military", correct: false },
      { text: "Nobody actually knows — and that's what makes it terrifying", correct: true }
    ],
    explanation: "They have the missiles. They have the motivation. They have the anger. And they just… stopped. No explanation. The silence is louder than the rockets ever were.",
    link: null
  },
  {
    id: "2.9",
    question: "Since the war started on March 17, the economic damage isn't just about bombs — it's oil prices, shipping costs, insurance, market crashes. The total damage so far is estimated at $42 billion. If Iran fully closes the Strait of Hormuz, that $42 billion becomes $42 billion per…",
    options: [
      { text: "Year", correct: false },
      { text: "Month", correct: false },
      { text: "Week", correct: true },
      { text: "Day", correct: false }
    ],
    explanation: "Per WEEK. Your gas doubles. Heating bills triple. Groceries up 30%. Airlines cancel routes. The global economy doesn't slow down — it has a heart attack.",
    link: "/blog/strait-hormuz-closure-economic-impact"
  },
  {
    id: "2.10",
    question: "An F-35 fighter jet costs $82 million to build. The Iranian missile that shot one down costs roughly $1 million. For every dollar Iran spent, America lost how many dollars?",
    options: [
      { text: "$10", correct: false },
      { text: "$20", correct: false },
      { text: "$50", correct: false },
      { text: "$82", correct: true }
    ],
    explanation: "82 to 1. Iran can keep firing million-dollar missiles all day. America can't keep losing $82 million jets at that rate. The math doesn't math.",
    link: "/blog/how-iran-hit-stealth-tech-breakdown"
  },
  {
    id: "2.11",
    question: "Israel has a weird problem with the Dimona nuclear strike. Iran's missiles hit 20km from Israel's nuclear research center — obviously a terrifying attack. But Israel can't officially complain about it as an attack on their 'nuclear program.' Why?",
    options: [
      { text: "The UN told them not to", correct: false },
      { text: "They started the escalation", correct: false },
      { text: "Israel doesn't officially admit it has nuclear weapons — even though everyone knows it does", correct: true },
      { text: "Dimona isn't important anymore", correct: false }
    ],
    explanation: "Israel has had nukes for 60 years. But officially they say 'we neither confirm nor deny.' Hard to scream 'you attacked our nuclear facility!' when you claim you don't have one. Iran knew this.",
    link: "/blog/natanz-dimona-nuclear-exchange"
  },
  {
    id: "2.12",
    question: "Iranian hackers (government-backed, not random guys in basements) hit three of America's biggest banks in the same week — Chase, Wells Fargo, and Bank of America. If your banking app was glitching that week, it wasn't your WiFi. What type of cyberattack did they use?",
    options: [
      { text: "They stole money from accounts", correct: false },
      { text: "Ransomware (locked the computers)", correct: false },
      { text: "Phishing emails to employees", correct: false },
      { text: "DDoS — they flooded the servers with so much fake traffic that real customers couldn't log in", correct: true }
    ],
    explanation: "They didn't steal anything — they just broke the front door. Millions of people couldn't access their bank accounts for hours. Simple, cheap, effective, and terrifying.",
    link: "/blog/stuxnet-bank-outages-texas-grid"
  },
  {
    id: "2.13",
    question: "After Iran's missiles hit near the Dimona nuclear site, Iran's parliament speaker went on TV and called it 'a new phase of battle.' In politician-speak, when someone says 'new phase,' what they actually mean is…",
    options: [
      { text: "We're ready to negotiate", correct: false },
      { text: "That was our final strike", correct: false },
      { text: "It was a one-time warning", correct: false },
      { text: "'We were holding back before. We're not anymore.'", correct: true }
    ],
    explanation: "Translation: 'You haven't seen the worst yet.' Not exactly the de-escalation the UN was hoping for.",
    link: null
  },
  {
    id: "2.14",
    question: "The US bombed Bandar Abbas — Iran's biggest and most important port, where ships carry Iranian oil to the rest of the world. Smart military move. But here's the problem: what percentage of Iran's oil exports went through that port?",
    options: [
      { text: "10%", correct: false },
      { text: "25%", correct: false },
      { text: "About 40%", correct: true },
      { text: "80%", correct: false }
    ],
    explanation: "40%. You'd think destroying their main port would cripple them. Instead, Iran rerouted oil shipments through smaller ports and pipelines directly to China. Turns out when you've been sanctioned for 40 years, you get creative.",
    link: null
  },
  {
    id: "2.15",
    question: "The US Navy normally keeps aircraft carrier strike groups (massive floating military bases) in the Pacific Ocean to keep an eye on China. Since the Iran war started, how many had to be pulled away and sent to the Persian Gulf?",
    options: [
      { text: "None — the Pacific fleet is untouched", correct: false },
      { text: "At least one full carrier strike group", correct: true },
      { text: "Three groups", correct: false },
      { text: "The entire fleet", correct: false }
    ],
    explanation: "One fewer carrier group watching China means one more opportunity for China. Someone in Beijing uncorked champagne when those ships left the Pacific.",
    link: "/blog/taiwan-window-xi-opportunity"
  }
];

// Act 3 — "What They Don't Want You to Know" (10 questions)
export const ACT3_QUESTIONS = [
  {
    id: "3.1",
    question: "Iran blocked the Strait of Hormuz for all commercial tankers — oil prices surged globally. But ONE country's ships kept sailing straight through like nothing happened. The secret? They paid for their oil in a different currency — not US dollars. Who got the VIP lane?",
    options: [
      { text: "Russia", correct: false },
      { text: "India", correct: false },
      { text: "China — paying in Chinese yuan instead of US dollars", correct: true },
      { text: "Saudi Arabia", correct: false }
    ],
    explanation: "China. The entrance fee? Ditch the dollar, pay in yuan. Iran just created a two-tier system: dollar users get blocked, yuan users get through. The petrodollar system just cracked.",
    link: "/blog/china-yuan-dollar-hormuz"
  },
  {
    id: "3.2",
    question: "The US has a secret military base called Diego Garcia — a tiny island in the middle of the Indian Ocean, 4,000km from Iran. It was considered 'untouchable' because Iran publicly said their missiles could only reach 2,000km. Then Iran launched two missiles at it. Both missed. So why did the Pentagon still completely freak out?",
    options: [
      { text: "The base stores nuclear weapons", correct: false },
      { text: "Iran's official range was 2,000km — they just doubled it, meaning they lied about their capabilities for years", correct: true },
      { text: "The missiles contained chemical weapons", correct: false },
      { text: "The missiles were hypersonic", correct: false }
    ],
    explanation: "Everything Iran told the world about their missile capabilities was a lie. If they can hit 4,000km, that means Berlin, Paris, and Rome are all in range. This isn't a Middle East problem anymore.",
    link: "/blog/diego-garcia-4000km-missile"
  },
  {
    id: "3.3",
    question: "While America pours money, missiles, and attention into the Middle East, one country is doing ALL of the following: buying Iranian oil at a 20% discount, studying the crashed F-35's wreckage for free intelligence, and building a financial system that doesn't need US dollars. Who is quietly winning this war without firing a single bullet?",
    options: [
      { text: "Russia", correct: false },
      { text: "Israel", correct: false },
      { text: "The US (duh)", correct: false },
      { text: "China — without spending a single yuan on combat", correct: true }
    ],
    explanation: "China hasn't fired one bullet. Hasn't lost one soldier. But they're getting cheap oil, free military intelligence, and watching America's alliances crack in real time. This is what winning looks like in the 21st century.",
    link: "/blog/taiwan-window-xi-opportunity"
  },
  {
    id: "3.4",
    question: "Three of Iran's top nuclear scientists all died within three days of each other. One in a 'car crash,' one from a 'gas leak,' and one 'fell from a building.' Israel has a legendary spy agency called Mossad — famous for assassinating enemy scientists going back decades. So what kind of 'accidents' do you think these were?",
    options: [
      { text: "Genuinely tragic coincidences", correct: false },
      { text: "Workplace safety violations", correct: false },
      { text: "An internal Iranian government purge", correct: false },
      { text: "The kind that start with an Israeli phone call", correct: true }
    ],
    explanation: "Three senior nuclear specialists, three days, three different 'accidents.' Statistically impossible. Mossad has been doing this since the 1960s. They're not even subtle about it anymore.",
    link: "/blog/stuxnet-bank-outages-texas-grid"
  },
  {
    id: "3.5",
    question: "The Pentagon just asked the US Congress for $200 billion in emergency funding for this war. That's $200,000,000,000. Meanwhile, when they polled Americans about whether they actually support these military strikes…",
    options: [
      { text: "72% support the strikes", correct: false },
      { text: "About half-half", correct: false },
      { text: "43% support", correct: false },
      { text: "Only 25% — three out of four Americans are against it", correct: true }
    ],
    explanation: "$200 billion for a war 75% of the country doesn't want. That's $600 for every single American — including the babies. Democracy at its finest.",
    link: "/blog/200-billion-winning-cost"
  },
  {
    id: "3.6",
    question: "China built its own version of the Western banking system (called CIPS) — it lets countries send money to each other without using US dollars or American banks. Most people haven't heard of it. But in 2025, CIPS processed MORE money than the Western system (SWIFT). How much?",
    options: [
      { text: "$50 trillion", correct: false },
      { text: "$100 trillion", correct: false },
      { text: "$245 trillion — almost double SWIFT", correct: true },
      { text: "$500 trillion", correct: false }
    ],
    explanation: "The 'alternative' payment system is already bigger than the original. The infrastructure for a world that doesn't need US dollars isn't 'coming soon.' It's already here.",
    link: "/blog/china-yuan-dollar-hormuz"
  },
  {
    id: "3.7",
    question: "Saudi Arabia is supposed to be America's closest ally in the Middle East — they buy American weapons, host American bases, and have been joined at the hip since the 1970s. But quietly, Saudi Arabia started accepting Chinese yuan for oil. When did this little betrayal begin?",
    options: [
      { text: "After the war started in 2026", correct: false },
      { text: "Late 2025", correct: false },
      { text: "2023 — three years before the war", correct: true },
      { text: "It hasn't happened yet", correct: false }
    ],
    explanation: "Three years before the first bomb dropped, America's 'best friend' was already hedging its bets with China. With allies like these, who needs enemies?",
    link: "/blog/china-yuan-dollar-hormuz"
  },
  {
    id: "3.8",
    question: "Iran's missiles at Diego Garcia almost certainly required satellite targeting data — coordinates precise enough to hit a small island from 4,000km away. Iran doesn't have satellites that cover the Indian Ocean. But Russia does — military imaging satellites, GPS-grade navigation, the works. What would we normally call it when one country provides targeting data for strikes on another country's military bases?",
    options: [
      { text: "Intelligence sharing", correct: false },
      { text: "Standard allied cooperation", correct: false },
      { text: "Espionage", correct: false },
      { text: "An act of war", correct: true }
    ],
    explanation: "During the Cold War, the Soviets provided weapons to Vietnam but never targeting data for US bases. What Russia is doing now goes further than anything in the Cold War. Let that sink in.",
    link: "/blog/diego-garcia-4000km-missile"
  },
  {
    id: "3.9",
    question: "The British pound was the world's most important currency for over 100 years — every country needed pounds to trade. It didn't collapse overnight. It slowly bled out over decades, drained by two World Wars and the Suez Crisis. Now the US dollar is the world's reserve currency. It's being drained by Afghanistan, Iraq, and now Iran. What does history suggest happens next?",
    options: [
      { text: "Nothing — the dollar is different", correct: false },
      { text: "Temporary dip then recovery", correct: false },
      { text: "The same slow decline that killed the pound", correct: true },
      { text: "Instant crash", correct: false }
    ],
    explanation: "History doesn't repeat, but it rhymes. The pound died to expensive wars and imperial overreach. The dollar is on the same path — just with better marketing.",
    link: "/blog/china-yuan-dollar-hormuz"
  },
  {
    id: ".10",
    question: "After Iran proved it could fire missiles 4,000km — double what everyone thought possible — every US and NATO military base on Earth had to reassess whether it was safe. Fun fact: at 4,000km range, how many major European capital cities are now within Iranian missile range?",
    options: [
      { text: "Zero — Europe is too far", correct: false },
      { text: "Just one or two in Eastern Europe", correct: false },
      { text: "Berlin, Paris, and Rome are ALL in range", correct: true },
      { text: "Only cities near the Mediterranean", correct: false }
    ],
    explanation: "Berlin: 3,900km. Rome: 3,400km. Paris: 4,200km. The 'Middle Eastern conflict' just became a European security crisis. NATO's entire threat model needs a rewrite.",
    link: "/blog/diego-garcia-4000km-missile"
  }
];

// Score Tiers
export const SCORE_TIERS = [
  {
    min: 0,
    max: 20,
    title: "Blissfully Uninformed",
    subtitle: "Time to start reading the news",
    description: "You scored X/100 on the WW3 quiz. Turns out I know nothing about what's actually happening. This quiz was eye-opening.",
    color: "from-gray-500 to-gray-600",
    icon: "😅"
  },
  {
    min: 21,
    max: 45,
    title: "Instagram Analyst",
    subtitle: "Thought you understood. You did not.",
    description: "I scored X/100. Thought I understood what's happening. I did not. Try the WW3 Tracker quiz →",
    color: "from-blue-500 to-blue-600",
    icon: "📱"
  },
  {
    min: 46,
    max: 65,
    title: "Casually Dangerous",
    subtitle: "You know more than Congress",
    description: "X/100 on the WW3 quiz. I know more than most of Congress. That's not a compliment. →",
    color: "from-yellow-500 to-orange-500",
    icon: "⚠️"
  },
  {
    min: 66,
    max: 85,
    title: "Pentagon Intern",
    subtitle: "You could brief the NSC",
    description: "X/100. I could brief the National Security Council. They'd ignore me, but I could do it. →",
    color: "from-orange-500 to-red-500",
    icon: "🎯"
  },
  {
    min: 86,
    max: 100,
    title: "You Should Be On a List",
    subtitle: "Either you read WW3 Tracker or you work for intel",
    description: "X/100. Either I read WW3 Tracker daily or I work for an intelligence agency. There's no third option. →",
    color: "from-red-500 to-red-600",
    icon: "🔥"
  }
];

// Helper function to get random questions from each act
export function getQuizQuestions() {
  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
  
  return {
    act1: shuffle(ACT1_QUESTIONS).slice(0, 5),
    act2: shuffle(ACT2_QUESTIONS).slice(0, 5),
    act3: shuffle(ACT3_QUESTIONS).slice(0, 5)
  };
}

// Helper function to get result tier based on score
export function getResultTier(score) {
  return SCORE_TIERS.find(tier => score >= tier.min && score <= tier.max) || SCORE_TIERS[0];
}
