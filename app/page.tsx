'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      sessionStorage.setItem('prize_data', JSON.stringify(data.prize));

      if (data.prize.category === 'VOUCHER') {
        router.push('/result?type=voucher');
      } else {
        router.push('/redeem');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container with fallback background color matching the bottom section
    <main className="min-h-screen flex flex-col items-center overflow-x-hidden font-sans bg-[#CDE4FF]">
      
      {/* 1. TOP SECTION: 首页.png */}
      <div className="relative w-full z-0">
        <Image 
           src="/new-ui-assets/首页.png" 
           alt="Event Banner" 
           width={1920} 
           height={1080}
           className="w-full h-auto block" // block removes bottom spacing
           priority
        />
      </div>

      {/* 2. BOTTOM SECTION Container: Includes Middle Strip + Content + Background */}
      {/* -mt-[6%] creates a stronger overlap effect to cover the top banner slightly more. */}
      <div className="relative w-full z-10 -mt-1 flex flex-col items-center">
        
        {/* Background Image: 背景色.png */}
        {/* Placed absolute to cover the entire bottom section */}
        <div className="absolute inset-0 z-0">
             <Image 
                src="/new-ui-assets/背景色.png" 
                alt="Background Texture" 
                fill 
                className="object-cover"
                quality={100}
             />
        </div>

        {/* 2.1 MIDDLE: 斜面.png (The Slope Strip) */}
        {/* Placed at the top of the bottom section, above the background */}
        <div className="relative w-full z-10">
           <Image 
              src="/new-ui-assets/斜面.png" 
              alt="Power Up Strip" 
              width={1920} 
              height={100} 
              className="w-full h-auto object-cover block -mt-10 sm:-mt-16 md:-mt-20 lg:-mt-24" // Responsive negative margin to eat up whitespace
           />
        </div>

        {/* 2.2 CONTENT: Logo & Form */}
        <div className="relative w-full z-10 flex flex-col items-center pt-8 pb-20">
          
          {/* Title Logo */}
          <div className="w-[80%] max-w-lg mb-8 animate-bounce-slow">
               <Image 
                  src="/new-ui-assets/主题.png" 
                  alt="Scratch Your High Score" 
                  width={600} 
                  height={200} 
                  className="w-full h-auto"
               />
          </div>

          {/* Input Card Container */}
          <div className="glass-card w-[90%] max-w-md rounded-[30px] p-8 md:p-10 text-center relative overflow-hidden">
            
            <h2 className="text-[#0056D2] text-2xl font-bold mb-2">Claim Your Prize</h2>
            <p className="text-[#5A8BBF] text-xs md:text-sm mb-8 px-4">
              Enter the unique code found on your scratch card to unlock your reward.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="ENTER CODE (E.G. HS-XXX-XXXXX)"
                  className="w-full bg-[#D6E8FF]/60 border border-[#FFF] text-center text-[#0056D2] font-bold text-lg tracking-widest py-4 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:bg-[#D6E8FF] placeholder:text-[#8BADCF] placeholder:font-normal placeholder:text-sm transition-all uppercase"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-100 py-2 px-4 rounded-lg border border-red-200 animate-pulse">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full bg-[#0056D2] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'UNLOCKING...' : 'UNLOCK REWARD'}
              </button>
            </form>
          </div>

          {/* Rules & Info */}
          <div className="w-[90%] max-w-2xl mt-12 text-[#5A8BBF] text-xs md:text-sm text-left space-y-6 bg-white/30 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-sm">
              <div>
                  <h3 className="text-[#0056D2] font-bold mb-2 uppercase tracking-wide">How to Participate:</h3>
                  <ol className="list-decimal pl-5 space-y-1 marker:text-[#0056D2] marker:font-bold">
                      <li>Purchase any High Score product at an authorized vape retailer.</li>
                      <li>Open the box to reveal a mini surprise gift — and a Scratch Card.</li>
                      <li>Scratch to reveal your prize code, then enter it above to redeem.</li>
                  </ol>
              </div>

              <div>
                  <h3 className="text-[#0056D2] font-bold mb-2 uppercase tracking-wide">Prize Shipping:</h3>
                  <ul className="list-disc pl-5 space-y-1 marker:text-[#0056D2]">
                      <li>Physical prizes will be shipped on the 15th of each month.</li>
                      <li>Make sure to enter accurate shipping information when prompted after code submission.</li>
                      <li>For any questions, feel free to DM us on Instagram <a href="https://www.instagram.com/highscore_vape/" target="_blank" rel="noopener noreferrer" className="text-[#0056D2] font-bold underline hover:text-[#007AFF] transition-colors">@highscore_vape</a>.</li>
                  </ul>
              </div>

              <p className="italic opacity-80 border-t border-[#5A8BBF]/20 pt-4 mt-2">
                  * High Score reserves the right to interpret and make final decisions for this promotion.
              </p>
          </div>

          {/* Footer Text */}
          <p className="mt-8 text-[#5A8BBF] text-xs">
            &copy; 2026 Highscore. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
