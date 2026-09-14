import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { LeafMark } from '@/components/brand/Logo'
import { StatusBar } from '@/components/layout/StatusBar'
import hero from '@/assets/images/leaves-hero.jpg'

const SLIDES = [
  {
    title: 'A cleaner campus starts with you.',
    body: 'Smart waste management for a sustainable tomorrow.',
  },
  {
    title: 'Sort it right, earn as you go.',
    body: 'Every correct deposit adds Eco Points to your balance.',
  },
  { title: 'See the difference you make.', body: 'Track every gram you divert from landfill.' },
]

export default function Splash() {
  const navigate = useNavigate()
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 3400)
    return () => clearInterval(id)
  }, [])

  const next = () => (i === SLIDES.length - 1 ? navigate('/login') : setI(i + 1))

  return (
    <div className="relative flex h-full flex-col text-white">
      <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,38,26,.82)_0%,rgba(8,38,26,.5)_38%,rgba(8,38,26,.72)_72%,rgba(8,38,26,.96)_100%)]" />

      <div className="relative z-10 flex h-full flex-col">
        <StatusBar tone="light" />

        <div className="flex-1 px-7 pt-10">
          <motion.div
            key={`t-${i}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="max-w-[16rem] text-[40px] font-extrabold leading-[1.06] tracking-tight">
              {SLIDES[i].title}
            </h1>
            <div className="mt-5 h-px w-10 bg-white/50" />
            <p className="mt-4 max-w-[15rem] text-[13.5px] leading-relaxed text-white/75">
              {SLIDES[i].body}
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 px-7 pb-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <LeafMark size={30} tone="light" />
                <span className="text-[22px] font-extrabold tracking-tight">ENGO</span>
              </div>
              <p className="mt-1.5 text-[11px] font-medium tracking-wide text-white/60">
                Small Actions. A Cleaner Tomorrow.
              </p>
            </div>

            <button
              onClick={next}
              aria-label="Continue"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-400 text-brand-950 shadow-lift transition-transform duration-150 active:scale-95"
            >
              <ArrowRight size={22} strokeWidth={2.5} />
            </button>
          </div>

          <div className="mt-7 flex items-center gap-1.5">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === i ? 'w-7 bg-white' : 'w-3 bg-white/35'
                }`}
              />
            ))}
            <button
              onClick={() => navigate('/login')}
              className="ml-auto text-[12px] font-semibold text-white/65 transition-colors hover:text-white"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
