'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RedeemPage() {
  const router = useRouter();
  const [prize, setPrize] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: '',
  });

  useEffect(() => {
    const storedPrize = sessionStorage.getItem('prize_data');
    if (!storedPrize) {
      router.push('/');
      return;
    }
    setPrize(JSON.parse(storedPrize));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/redeem-prize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, code: prize.code }),
      });

      if (!res.ok) throw new Error('Failed to submit');

      router.push('/result?type=success');
    } catch (error) {
      alert('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    (e.target as HTMLInputElement).setCustomValidity('Please fill out this field.');
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).setCustomValidity('');
  };

  if (!prize) return null;

  return (
    <main className="min-h-screen flex flex-col items-center overflow-x-hidden font-sans bg-[#CDE4FF]">
      
      {/* --- TOP SECTION (Banner) --- */}
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

      {/* --- BOTTOM SECTION Container --- */}
      <div className="relative w-full z-10 -mt-[6%] flex flex-col items-center">
        
        {/* Background Image */}
        <div className="absolute top-0 left-0 right-0 -bottom-96 -z-10">
             <Image 
                src="/new-ui-assets/背景色.png" 
                alt="Background Texture" 
                fill 
                className="object-cover"
                quality={100}
             />
        </div>

        {/* MIDDLE: 斜面.png */}
        <div className="relative w-full z-10">
           <Image 
              src="/new-ui-assets/斜面.png" 
              alt="Power Up Strip" 
              width={1920} 
              height={100} 
              className="w-full h-auto object-cover block -mt-10 sm:-mt-16 md:-mt-20 lg:-mt-24"
           />
        </div>

        {/* CONTENT */}
        <div className="relative w-full z-10 flex flex-col items-center pt-8 pb-20 px-4">
            
            <button onClick={() => router.back()} className="self-start md:ml-[10%] mb-6 text-[#0056D2] hover:text-[#007AFF] flex items-center gap-2 transition-colors font-bold bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
                ← Back
            </button>

            {/* Form Card */}
            <div className="glass-card w-full max-w-2xl rounded-[30px] p-6 md:p-10 shadow-xl relative overflow-hidden">
                
                {/* Header */}
                <div className="text-center mb-8 border-b border-white/30 pb-6">
                    <span className="bg-[#0056D2]/10 text-[#0056D2] text-xs font-bold px-3 py-1 rounded-full border border-[#0056D2]/20 uppercase tracking-widest inline-block mb-3">
                        Congratulations
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0056D2] mb-2">
                        You Won: <span className="text-[#007AFF]">{prize.prize_type}</span>
                    </h1>
                    <p className="text-[#5A8BBF] text-sm">Please provide your shipping details to receive your reward.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-xs uppercase text-[#5A8BBF] font-bold tracking-wider ml-1">First Name <span className="text-red-400">*</span></label>
                            <input required name="firstName" onChange={handleChange} onInvalid={handleInvalid} onInput={handleInput} className="w-full bg-[#D6E8FF]/40 border border-[#FFF] rounded-xl p-3 text-[#0056D2] placeholder-[#8BADCF] focus:border-[#0056D2] focus:outline-none transition-colors" placeholder="John" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase text-[#5A8BBF] font-bold tracking-wider ml-1">Last Name <span className="text-red-400">*</span></label>
                            <input required name="lastName" onChange={handleChange} onInvalid={handleInvalid} onInput={handleInput} className="w-full bg-[#D6E8FF]/40 border border-[#FFF] rounded-xl p-3 text-[#0056D2] placeholder-[#8BADCF] focus:border-[#0056D2] focus:outline-none transition-colors" placeholder="Doe" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase text-[#5A8BBF] font-bold tracking-wider ml-1">Email Address <span className="text-red-400">*</span></label>
                        <input required type="email" name="email" onChange={handleChange} onInvalid={handleInvalid} onInput={handleInput} className="w-full bg-[#D6E8FF]/40 border border-[#FFF] rounded-xl p-3 text-[#0056D2] placeholder-[#8BADCF] focus:border-[#0056D2] focus:outline-none transition-colors" placeholder="john@example.com" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase text-[#5A8BBF] font-bold tracking-wider ml-1">Phone Number <span className="text-red-400">*</span></label>
                        <input required type="tel" name="phone" onChange={handleChange} onInvalid={handleInvalid} onInput={handleInput} className="w-full bg-[#D6E8FF]/40 border border-[#FFF] rounded-xl p-3 text-[#0056D2] placeholder-[#8BADCF] focus:border-[#0056D2] focus:outline-none transition-colors" placeholder="+1 (555) 000-0000" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase text-[#5A8BBF] font-bold tracking-wider ml-1">Shipping Address <span className="text-red-400">*</span></label>
                        <input required name="address" onChange={handleChange} onInvalid={handleInvalid} onInput={handleInput} className="w-full bg-[#D6E8FF]/40 border border-[#FFF] rounded-xl p-3 text-[#0056D2] placeholder-[#8BADCF] focus:border-[#0056D2] focus:outline-none transition-colors" placeholder="123 Main St, Apt 4B" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        <div className="space-y-1">
                            <label className="text-xs uppercase text-[#5A8BBF] font-bold tracking-wider ml-1">City <span className="text-red-400">*</span></label>
                            <input required name="city" onChange={handleChange} onInvalid={handleInvalid} onInput={handleInput} className="w-full bg-[#D6E8FF]/40 border border-[#FFF] rounded-xl p-3 text-[#0056D2] placeholder-[#8BADCF] focus:border-[#0056D2] focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase text-[#5A8BBF] font-bold tracking-wider ml-1">Zip Code <span className="text-red-400">*</span></label>
                            <input required name="zip" onChange={handleChange} onInvalid={handleInvalid} onInput={handleInput} className="w-full bg-[#D6E8FF]/40 border border-[#FFF] rounded-xl p-3 text-[#0056D2] placeholder-[#8BADCF] focus:border-[#0056D2] focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-1 col-span-2 md:col-span-1">
                            <label className="text-xs uppercase text-[#5A8BBF] font-bold tracking-wider ml-1">Country <span className="text-red-400">*</span></label>
                            <input required name="country" onChange={handleChange} onInvalid={handleInvalid} onInput={handleInput} className="w-full bg-[#D6E8FF]/40 border border-[#FFF] rounded-xl p-3 text-[#0056D2] placeholder-[#8BADCF] focus:border-[#0056D2] focus:outline-none transition-colors" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full bg-[#0056D2] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? 'Submitting...' : 'CONFIRM & CLAIM PRIZE'}
                    </button>
                </form>
            </div>

            <p className="mt-12 text-[#5A8BBF] text-xs">
                &copy; 2026 Highscore. All rights reserved.
            </p>
        </div>
      </div>
    </main>
  );
}
