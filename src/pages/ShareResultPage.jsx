import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const archetypes = {
  bunker: { name: "BUNKER DADDY", emoji: "☢️", color: "#ef4444" },
  informed: { name: "THE INFORMED NORMIE", emoji: "📱", color: "#3b82f6" },
  coping: { name: "COPING CHRONICALLY ONLINE", emoji: "🎭", color: "#eab308" },
  main: { name: "MAIN CHARACTER SYNDROME", emoji: "🎬", color: "#a855f7" },
  npc: { name: "NPC VIBES", emoji: "🤖", color: "#22c55e" }
};

const getArchetype = (score) => {
  if (score >= 180) return archetypes.bunker;
  if (score >= 145) return archetypes.informed;
  if (score >= 110) return archetypes.coping;
  if (score >= 75) return archetypes.main;
  return archetypes.npc;
};

export default function ShareResultPage() {
  const { score } = useParams();
  const scoreNum = parseInt(score) || 50;
  const archetype = getArchetype(scoreNum);

  const shareUrl = `https://ww3tracker.live/share/${scoreNum}`;
  const title = `I scored ${scoreNum}% on the WW3 Readiness Test!`;
  const description = `I'm "${archetype.name}" 🎯 Even Kim Jong Un wasn't invited to WW3 😂 What's your score?`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={shareUrl} />
      </Helmet>

      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden">
          {/* Header */}
          <div 
            className="p-6 text-center"
            style={{ background: `linear-gradient(135deg, ${archetype.color}66, ${archetype.color}33)` }}
          >
            <div className="text-6xl mb-2">{archetype.emoji}</div>
            <h1 className="text-5xl font-black text-white mb-1">{scoreNum}%</h1>
            <p className="text-white/90 font-bold">{archetype.name}</p>
          </div>
          
          {/* Description */}
          <div className="p-4 text-center">
            <p className="text-zinc-300 text-sm mb-2">{description}</p>
          </div>
          
          {/* Share Buttons */}
          <div className="p-4 space-y-2">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I scored ${scoreNum}% on the WW3 Readiness Test! I'm "${archetype.name}" 🎯\n\nEven Kim Jong Un wasn't invited 😂\n\nWhat's your score?`)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-white text-black font-bold text-center rounded-xl hover:bg-zinc-100 transition-colors"
            >
              Share on X
            </a>
            <Link 
              to="/ready"
              className="block w-full py-3 bg-zinc-800 text-white font-bold text-center rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Take The Test Yourself
            </Link>
          </div>
        </div>
        
        <Link to="/" className="mt-6 text-zinc-600 text-sm hover:text-zinc-400">
          ww3tracker.live
        </Link>
      </div>
    </>
  );
}
