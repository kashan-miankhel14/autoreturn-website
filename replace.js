const fs = require('fs');
const file = '/home/kashan-saeed/Desktop/autoreturn-website/client/src/pages/home.tsx';
let content = fs.readFileSync(file, 'utf8');

const newFlowDiagram = `function FlowDiagram() {
  return (
    <div className="relative h-full w-full py-2 lg:py-6 max-w-5xl mx-auto">
      <div className="flex flex-col items-center justify-center gap-6 lg:flex-row lg:items-center lg:gap-4 xl:gap-8">
        
        {/* Step 1: Input Apps */}
        <div className="flex flex-col gap-4 w-full max-w-[200px] shrink-0">
          {[
            {
              label: "Gmail",
              icon: (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 6L12 13L2 6" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              label: "Slack",
              icon: (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12.5C6 11.12 4.88 10 3.5 10S1 11.12 1 12.5 2.12 15 3.5 15H6V12.5Z" fill="#36C5F0" />
                  <path d="M7 12.5C7 11.12 8.12 10 9.5 10S12 11.12 12 12.5V21.5C12 22.88 10.88 24 9.5 24S7 22.88 7 21.5V12.5Z" fill="#36C5F0" />
                  <path d="M11.5 6C12.88 6 14 4.88 14 3.5S12.88 1 11.5 1 9 2.12 9 3.5V6H11.5Z" fill="#2EB67D" />
                  <path d="M11.5 7C12.88 7 14 8.12 14 9.5S12.88 12 11.5 12H2.5C1.12 12 0 10.88 0 9.5S1.12 7 2.5 7H11.5Z" fill="#2EB67D" />
                  <path d="M18 11.5C18 12.88 19.12 14 20.5 14S23 12.88 23 11.5 21.88 9 20.5 9H18V11.5Z" fill="#ECB22E" />
                  <path d="M17 11.5C17 12.88 15.88 14 14.5 14S12 12.88 12 11.5V2.5C12 1.12 13.12 0 14.5 0S17 1.12 17 2.5V11.5Z" fill="#ECB22E" />
                  <path d="M12.5 18C11.12 18 10 19.12 10 20.5S11.12 23 12.5 23 15 21.88 15 20.5V18H12.5Z" fill="#E01E5A" />
                  <path d="M12.5 17C11.12 17 10 15.88 10 14.5S11.12 12 12.5 12H21.5C22.88 12 24 13.12 24 14.5S22.88 17 21.5 17H12.5Z" fill="#E01E5A" />
                </svg>
              ),
            }
          ].map((app, idx) => (
            <motion.div
              key={app.label}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="aur-card flex items-center gap-4 rounded-xl px-5 py-4 shadow-xl border border-white/5"
            >
              <div className="bg-white/5 p-2 rounded-lg">{app.icon}</div>
              <span className="text-sm font-semibold text-white/90">{app.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Step 2: "Sending Things" Animation (Apps -> Engine) */}
        <div className="flex flex-col items-center justify-center lg:flex-row py-2 lg:py-0 w-12 lg:w-20 shrink-0">
          <div className="relative w-full flex items-center justify-center">
            {/* Outline path */}
            <div className="hidden lg:block h-[2px] w-full bg-[#0FA4AF]/20 rounded-full" />
            <div className="lg:hidden w-[2px] h-12 bg-[#0FA4AF]/20 rounded-full" />
            
            {/* Animated Packet */}
            <motion.div
              animate={{
                x: ["-200%", "200%"],
                opacity: [0, 1, 0, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute hidden lg:flex items-center justify-center"
            >
              <div className="px-2 py-0.5 rounded text-[8px] font-bold bg-[#0FA4AF] text-black shadow-[0_0_10px_#0FA4AF] uppercase tracking-wider">Sync</div>
            </motion.div>

            <motion.div
              animate={{
                y: ["-150%", "150%"],
                opacity: [0, 1, 0, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute lg:hidden flex items-center justify-center"
            >
              <div className="p-1 rounded bg-[#0FA4AF] text-black shadow-[0_0_10px_#0FA4AF] rotate-90">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </motion.div>

            {/* Arrowhead */}
            <div className="absolute right-0 hidden lg:block text-[#0FA4AF]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
            <div className="absolute bottom-0 lg:hidden text-[#0FA4AF]">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Step 3: AutoReturn Engine */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <motion.div
            animate={{
              boxShadow: ["0 0 20px rgba(15,164,175,0.15)", "0 0 50px rgba(15,164,175,0.4)", "0 0 20px rgba(15,164,175,0.15)"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-[#0FA4AF]/50 bg-black/60 backdrop-blur-xl relative overflow-hidden"
          >
            {/* Spinning gradient inside */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
               className="absolute -inset-10 bg-[conic-gradient(from_0deg,transparent_0_300deg,#0FA4AF_360deg)] opacity-40 rounded-full blur-xl"
            />
            {/* Core Box */}
            <div className="h-full w-full bg-black/80 rounded-[2rem] flex items-center justify-center z-10 p-2">
              <div className="text-center">
                <MessageSquare className="mx-auto h-8 w-8 text-[#0FA4AF] drop-shadow-[0_0_8px_rgba(15,164,175,0.8)]" strokeWidth={2} />
              </div>
            </div>
          </motion.div>

          <div className="mt-5 text-center">
            <h4 className="font-[Outfit] text-lg font-bold text-white tracking-wide">AutoReturn Engine</h4>
            <div className="inline-flex mt-1 items-center px-2.5 py-1 rounded-full bg-[#0FA4AF]/10 border border-[#0FA4AF]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0FA4AF] mr-1.5 animate-pulse" />
              <p className="text-[10px] text-[#0FA4AF] font-semibold uppercase tracking-wider">Local Privacy Engine</p>
            </div>
          </div>
        </div>

        {/* Step 4: "Sending Things" Animation (Engine -> Inbox) */}
        <div className="flex flex-col items-center justify-center lg:flex-row py-2 lg:py-0 w-12 lg:w-20 shrink-0">
          <div className="relative w-full flex items-center justify-center">
            {/* Outline path */}
            <div className="hidden lg:block h-[3px] w-full bg-[#0FA4AF]/30 rounded-full" />
            <div className="lg:hidden w-[3px] h-12 bg-[#0FA4AF]/30 rounded-full" />
            
            {/* Animated Packet */}
            <motion.div
              animate={{
                x: ["-200%", "200%"],
                opacity: [0, 0, 1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
              className="absolute hidden lg:flex items-center justify-center"
            >
              <div className="px-2 py-0.5 rounded text-[8px] font-bold bg-[#0FA4AF] text-black shadow-[0_0_12px_#0FA4AF] uppercase tracking-wider">Done</div>
            </motion.div>

            <motion.div
               animate={{
                y: ["-150%", "150%"],
                opacity: [0, 0, 1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
              className="absolute lg:hidden flex items-center justify-center"
            >
              <div className="p-1 rounded bg-[#0FA4AF] text-black shadow-[0_0_12px_#0FA4AF] rotate-90">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </motion.div>

            {/* Arrowhead */}
            <div className="absolute right-0 hidden lg:block text-[#0FA4AF]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
            <div className="absolute bottom-0 lg:hidden text-[#0FA4AF]">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Step 5: Unified Output */}
        <div className="shrink-0 w-full lg:w-fit">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="aur-card aur-glow relative overflow-hidden rounded-[1.5rem] p-5 border-2 border-[#0FA4AF]/60 bg-black/40 shadow-[0_0_30px_rgba(15,164,175,0.15)] h-full min-w-[220px]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0FA4AF]/10 blur-2xl rounded-full" />
            
            <div className="flex items-center gap-2.5 mb-5 relative z-10 border-b border-white/10 pb-3">
              <div className="h-2 w-2 rounded-full bg-[#0FA4AF] animate-ping" />
              <span className="text-[11px] font-extrabold text-white uppercase tracking-widest">Unified Inbox</span>
            </div>

            <div className="space-y-3 relative z-10">
              {[
                { label: "Daily Brief", icon: <Mic className="h-3.5 w-3.5" /> },
                { label: "Draft Suggestion", icon: <MessageSquare className="h-3.5 w-3.5" /> },
                { label: "Task Spotted", icon: <Shield className="h-3.5 w-3.5" /> }
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 hover:bg-white/10 transition-colors">
                  <div className="text-[#0FA4AF] bg-[#0FA4AF]/10 p-1.5 rounded-md">
                     {task.icon}
                  </div>
                  <span className="text-xs font-medium text-white/90">{task.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}`;

content = content.replace(/function FlowDiagram\(\) \{[\s\S]*?^export default function Home\(\)/m, newFlowDiagram + '\n\nexport default function Home()');
fs.writeFileSync(file, content);
console.log('Successfully replaced FlowDiagram!');
