'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type'); // 'voucher' or 'success'
  const [prize, setPrize] = useState<any>(null);

  useEffect(() => {
    const storedPrize = sessionStorage.getItem('prize_data');
    if (storedPrize) {
      setPrize(JSON.parse(storedPrize));
    }
  }, []);

  const isVoucher = type === 'voucher';

  return (
    <div className="w-full max-w-md text-center space-y-8 z-10 p-4">
        
        {/* Card Container */}
        <div className="glass-card w-full rounded-[30px] p-8 md:p-12 shadow-xl relative overflow-hidden">
            
            {/* Status Icon */}
            <div className="mb-6 flex justify-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isVoucher ? 'bg-yellow-100 text-yellow-500' : 'bg-green-100 text-green-500'}`}>
                    {isVoucher ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v9.632c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[#0056D2]">
                {isVoucher ? 'Voucher Unlocked!' : 'Claim Successful!'}
            </h1>

            {/* Content Body */}
            {isVoucher ? (
                <div className="space-y-6">
                    <div className="bg-[#D6E8FF]/60 border border-white/50 rounded-2xl p-6 shadow-inner">
                        <p className="text-[#5A8BBF] text-xs uppercase tracking-wider mb-2 font-bold">You have won</p>
                        <p className="text-3xl md:text-4xl font-black text-[#0056D2]">{prize?.prize_type || 'Discount Voucher'}</p>
                    </div>
                    
                    <div className="text-left bg-white/40 p-5 rounded-xl border-l-4 border-[#0056D2]">
                        <h3 className="font-bold text-[#0056D2] mb-1">How to use:</h3>
                        <p className="text-[#5A8BBF] text-sm leading-relaxed">
                            Please visit our nearest store and present your <strong className="text-[#0056D2]">original scratch card</strong> to the staff to redeem this voucher.
                        </p>
                    </div>
                    
                    <p className="text-xs text-[#8BADCF] italic">
                        * Note: You must surrender the physical card to the cashier.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-[#5A8BBF] leading-relaxed">
                        We have received your shipping details. Your prize will be processed and shipped within 5-7 business days.
                    </p>
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-100">
                        ✓ A confirmation email has been sent to your inbox.
                    </div>
                </div>
            )}

            {/* Action Button */}
            <div className="mt-10">
                <button 
                    onClick={() => router.push('/')}
                    className="w-full bg-[#0056D2] hover:bg-[#004bb5] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                    Back to Home
                </button>
            </div>
        </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <main className="min-h-screen flex flex-col items-center overflow-x-hidden font-sans bg-[#CDE4FF]">
      
      {/* --- TOP SECTION --- */}
      <div className="relative w-full z-0">
        <Image 
           src="/new-ui-assets/首页.png" 
           alt="Event Banner" 
           width={1920} 
           height={1080}
           className="w-full h-auto block"
           priority
        />
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="relative w-full z-10 -mt-[6%] flex flex-col items-center">
        
        {/* Background */}
        <div className="absolute top-0 left-0 right-0 -bottom-96 -z-10">
             <Image 
                src="/new-ui-assets/背景色.png" 
                alt="Background Texture" 
                fill 
                className="object-cover"
                quality={100}
             />
        </div>

        {/* Strip */}
        <div className="relative w-full z-10">
           <Image 
              src="/new-ui-assets/斜面.png" 
              alt="Power Up Strip" 
              width={1920} 
              height={100} 
              className="w-full h-auto object-cover block -mt-10 sm:-mt-16 md:-mt-20 lg:-mt-24"
           />
        </div>

        {/* Content */}
        <div className="relative w-full z-10 flex flex-col items-center pt-8 pb-20">
             <Suspense fallback={<div className="text-[#0056D2]">Loading...</div>}>
                <ResultContent />
            </Suspense>

            <p className="mt-12 text-[#5A8BBF] text-xs">
                &copy; 2026 Highscore. All rights reserved.
            </p>
        </div>
      </div>
    </main>
  );
}
