import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Atom, History, FileText, AlertTriangle, CheckCircle, XCircle,
  ArrowRight, Calendar, Globe, TrendingUp, ChevronRight
} from 'lucide-react';
import SEO from '../components/SEO';
import { FAQSchema, BreadcrumbSchema, HowToSchema } from '../components/StructuredData';

const IranNuclearDealPage = () => {
  // Breadcrumb data
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Iran Nuclear Deal", url: "/iran-nuclear-deal" }
  ];

  // FAQ data for rich snippets
  const faqs = [
    {
      question: "What is the Iran nuclear deal?",
      answer: "The Iran nuclear deal (JCPOA - Joint Comprehensive Plan of Action) is a 2015 agreement between Iran and world powers (US, UK, France, Russia, China, Germany). Iran agreed to limit its nuclear program in exchange for sanctions relief. The deal restricted uranium enrichment, reduced centrifuges, and allowed international inspections."
    },
    {
      question: "Why did the US pull out of the Iran nuclear deal?",
      answer: "In May 2018, the Trump administration withdrew from the JCPOA, claiming the deal didn't address Iran's ballistic missile program, regional activities, and had sunset clauses allowing Iran to eventually resume enrichment. The US reimposed sanctions, and Iran gradually began exceeding the deal's limits."
    },
    {
      question: "Is the Iran nuclear deal still active?",
      answer: "As of March 2026, the JCPOA is effectively dead. The US withdrew in 2018, Iran has far exceeded the deal's enrichment limits (now at 60%, approaching weapons-grade 90%), and direct military conflict between the US/Israel and Iran is underway. A new agreement would need to be negotiated."
    },
    {
      question: "What happens if Iran gets a nuclear weapon?",
      answer: "If Iran develops nuclear weapons: (1) Israel would likely launch immediate military strikes, (2) Saudi Arabia and Turkey would likely pursue their own nuclear programs, triggering a regional arms race, (3) Iran would gain a 'nuclear umbrella' for its regional activities, and (4) the risk of nuclear conflict in the Middle East would increase dramatically."
    },
    {
      question: "Can the Iran nuclear deal be revived?",
      answer: "Reviving the original JCPOA is unlikely given current circumstances. A new deal would require: (1) Ceasefire in the current US-Iran war, (2) Iran rolling back its advanced enrichment, (3) US lifting sanctions, (4) Addressing Iran's missile program and regional activities, and (5) Political will from both sides. Negotiations would be complex and time-consuming."
    }
  ];

  // Timeline of the nuclear deal
  const dealTimeline = [
    {
      year: "2002",
      event: "Secret Nuclear Sites Exposed",
      description: "Iranian opposition group reveals hidden facilities at Natanz and Arak. Crisis begins.",
      type: "crisis"
    },
    {
      year: "2006-2010",
      event: "Sanctions Begin",
      description: "UN imposes multiple rounds of sanctions targeting Iran's nuclear program and economy.",
      type: "sanctions"
    },
    {
      year: "2015",
      event: "JCPOA Signed",
      description: "Iran agrees to nuclear limits in exchange for sanctions relief. Deal implemented in 2016.",
      type: "success"
    },
    {
      year: "2016-2018",
      event: "Deal in Effect",
      description: "IAEA confirms Iran is complying. Sanctions lifted, oil exports increase, economy improves.",
      type: "success"
    },
    {
      year: "May 2018",
      event: "US Withdrawal",
      description: "Trump pulls US out of deal, reimposes sanctions. Other parties try to keep deal alive.",
      type: "crisis"
    },
    {
      year: "2019-2021",
      event: "Deal Collapses",
      description: "Iran gradually exceeds limits. Enrichment increases from 3.67% to 20%, then 60%.",
      type: "crisis"
    },
    {
      year: "2022-2024",
      event: "Failed Negotiations",
      description: "Indirect talks between US and Iran fail to restore deal. Iran advances enrichment.",
      type: "crisis"
    },
    {
      year: "Feb 2026",
      event: "War Begins",
      description: "Israel and US launch strikes on Iranian nuclear facilities. Deal is effectively dead.",
      type: "war"
    }
  ];

  // Deal provisions comparison
  const dealProvisions = [
    {
      provision: "Uranium Enrichment Level",
      jcpoaLimit: "3.67%",
      currentStatus: "60%",
      status: "breached"
    },
    {
      provision: "Enriched Uranium Stockpile",
      jcpoaLimit: "300 kg",
      currentStatus: "Over 4,000 kg",
      status: "breached"
    },
    {
      provision: "Advanced Centrifuges",
      jcpoaLimit: "None",
      currentStatus: "Thousands installed",
      status: "breached"
    },
    {
      provision: "IAEA Inspections",
      jcpoaLimit: "Full access",
      currentStatus: "Limited access since 2021",
      status: "breached"
    },
    {
      provision: "Breakout Time",
      jcpoaLimit: "12+ months",
      currentStatus: "Weeks to months",
      status: "breached"
    }
  ];

  return (
    <>
      <SEO
        title="Iran Nuclear Deal (JCPOA) Explained | History & Current Status 2026"
        description="Complete guide to the Iran nuclear deal: What is JCPOA, why the US withdrew, current status, and what happens next. Updated March 2026."
        pathname="/iran-nuclear-deal"
        ogImage="/og-image.png"
      />
      
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen bg-grid text-white">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center text-xl">
                  <span>🦅</span>
                  <span className="text-gray-600 mx-1">vs</span>
                  <span>☠️</span>
                </div>
                <Link to="/" className="font-heading font-bold text-xl text-white hover:text-blue-400 transition-colors">
                  WW3 TRACKER
                </Link>
              </div>
              <Link 
                to="/" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="py-4 text-sm text-gray-500">
            <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to="/" itemProp="item" className="hover:text-white">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li>/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name" className="text-white">Iran Nuclear Deal</span>
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </nav>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-full mb-6">
              <Atom className="w-4 h-4 animate-pulse" />
              <span className="font-heading text-sm tracking-wider">JCPOA EXPLAINED</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              Iran Nuclear Deal (JCPOA)
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The complete history of the Iran nuclear agreement: what it was, why it failed, 
              and what it means for the current conflict.
            </p>
          </motion.div>

          {/* Status Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-bold text-xl text-white mb-2">Current Status: DEAL SUSPENDED</h2>
                <p className="text-gray-300">
                  The JCPOA is effectively dead as of March 2026. The US withdrew in 2018, Iran has 
                  exceeded all limits, and direct military conflict is underway. A new agreement 
                  would require extensive negotiations after the current war ends.
                </p>
              </div>
            </div>
          </motion.div>

          {/* What is JCPOA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="comic-panel p-8 mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-400" />
              What Was the Iran Nuclear Deal?
            </h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg">
                The <strong className="text-white">Joint Comprehensive Plan of Action (JCPOA)</strong>, 
                commonly known as the Iran nuclear deal, was an agreement reached on July 14, 2015, between 
                Iran and the P5+1 (the five permanent UN Security Council members—US, UK, France, Russia, 
                China—plus Germany), together with the European Union.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                  <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Iran Agreed To:
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Limit uranium enrichment to 3.67%</li>
                    <li>• Reduce centrifuges by two-thirds</li>
                    <li>• Shrink enriched uranium stockpile by 98%</li>
                    <li>• Allow IAEA inspections and monitoring</li>
                    <li>• Redesign heavy-water reactor at Arak</li>
                    <li>• Export spent fuel</li>
                  </ul>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                  <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    World Powers Agreed To:
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Lift nuclear-related sanctions</li>
                    <li>• Allow Iran to access frozen assets (~$100B)</li>
                    <li>• Permit Iran to resume oil exports</li>
                    <li>• Reconnect Iran to SWIFT banking system</li>
                    <li>• Support Iran's peaceful nuclear program</li>
                    <li>• Remove arms embargo after 5 years</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed">
                The deal was designed to extend Iran's "breakout time"—the time needed to produce 
                enough fissile material for a nuclear weapon—from an estimated 2-3 months to at least 
                <strong className="text-white"> 12 months</strong>, giving the international community 
                time to respond if Iran tried to develop weapons.
              </p>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="comic-panel p-8 mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-2">
              <History className="w-6 h-6 text-yellow-400" />
              JCPOA Timeline
            </h2>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />
              
              <div className="space-y-8">
                {dealTimeline.map((item, index) => (
                  <div key={index} className="relative pl-12">
                    <div className={`absolute left-2 w-4 h-4 rounded-full border-2 ${
                      item.type === 'success' ? 'bg-green-500 border-green-500' :
                      item.type === 'crisis' ? 'bg-yellow-500 border-yellow-500' :
                      'bg-red-500 border-red-500'
                    }`} />
                    
                    <div className="flex flex-wrap items-baseline gap-3 mb-1">
                      <span className="text-lg font-bold text-blue-400">{item.year}</span>
                      <span className="text-white font-semibold">{item.event}</span>
                    </div>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Current Deal Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="comic-panel p-8 mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6">
              Current Deal Limits vs Reality
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Provision</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">JCPOA Limit</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Current Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dealProvisions.map((item, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-4 px-4 text-white">{item.provision}</td>
                      <td className="py-4 px-4 text-green-400">{item.jcpoaLimit}</td>
                      <td className="py-4 px-4 text-red-400">{item.currentStatus}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                          BREACHED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Why US Withdrew */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="comic-panel p-8 mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6">
              Why Did the US Withdraw?
            </h2>

            <div className="space-y-6">
              <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-white mb-2">Trump Administration Criticisms (May 2018)</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Deal didn't address Iran's ballistic missile program</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Sunset clauses allowed Iran to resume enrichment after 10-15 years</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Didn't restrict Iran's regional activities (Syria, Lebanon, Yemen)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Inspections weren't intrusive enough (military sites)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Gave Iran too much economic relief upfront</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-500/10 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-white mb-2">Supporters of the Deal Argued:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Iran was complying with nuclear restrictions (verified by IAEA)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Extended breakout time to 12+ months</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Comprehensive inspection regime was working</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Without the deal, Iran would accelerate its program (which happened)</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Consequences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="comic-panel p-8 mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6">
              What Happened After US Withdrawal?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-red-400 mb-4">Iran's Response (2019-2026)</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Increased enrichment to 4.5%, then 20%, then 60%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Installed thousands of advanced centrifuges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Stockpiled enough material for several nuclear weapons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Reduced IAEA inspector access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>February 2026: Full-scale war with US/Israel</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-yellow-400 mb-4">Impact Assessment</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Breakout time: 12+ months → weeks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Iran's economy suffered but didn't collapse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Regional tensions increased dramatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Diplomatic channels severely damaged</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Current result: Active military conflict</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="comic-panel p-8 mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-white/10 pb-6 last:border-0">
                  <h3 className="font-bold text-white mb-2 text-lg">{faq.question}</h3>
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Related Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="comic-panel p-6"
          >
            <h3 className="font-heading font-bold text-lg text-white mb-4">
              Related Articles
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                to="/blog/iran-nuclear-program" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white text-sm">Iran Nuclear Program</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/blog/why-america-fighting-iran" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white text-sm">Why US Fights Iran</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/us-iran-war-tracker" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white text-sm">War Tracker</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/ww3-probability" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white text-sm">WW3 Probability</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-4 mt-12">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-gray-500 text-sm">
              Sources: IAEA reports, US State Department, Iranian government statements, academic analysis
            </p>
            <p className="text-gray-600 text-xs mt-2">
              ⚠️ Educational content based on publicly available information.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default IranNuclearDealPage;
