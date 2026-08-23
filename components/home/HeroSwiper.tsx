"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import Link from "next/link";
import { Trophy, Crown, Zap, TrendingUp, ChevronRight, Target } from "lucide-react";

interface SlideData {
  title: string;
  highlight: string;
  subtitle: string;
  cta: string;
  href: string;
  icon: React.ReactNode;
  bgIcon: React.ReactNode;
  gradient: string;
  badges?: string[];
}

const SLIDES: SlideData[] = [
  {
    title: "Today's",
    highlight: "Premium Picks",
    subtitle: "Data-driven insights from expert analysts. Tips curated daily with detailed match breakdowns and odds.",
    cta: "View Today's Tips",
    href: "/",
    icon: <Trophy size={24} />,
    bgIcon: <Trophy size={140} />,
    gradient: "from-[#042f2e] via-[#0f766e] to-[#134e4a]",
    badges: ["Expert Analysis", "Daily Updates"],
  },
  {
    title: "Exclusive",
    highlight: "VIP Access",
    subtitle: "Unlock premium high-confidence selections with team logos, detailed odds, and match intelligence.",
    cta: "Unlock VIP",
    href: "/predictions/vip",
    icon: <Crown size={24} />,
    bgIcon: <Crown size={140} />,
    gradient: "from-[#422006] via-[#a16207] to-[#ca8a04]",
    badges: ["Members Only", "Premium Picks"],
  },
  {
    title: "Daily",
    highlight: "Special Markets",
    subtitle: "Goal scorers, cards & corners, BTTS, Over 2.5, Halftime, basketball and tennis in one hub.",
    cta: "Explore Daily Special",
    href: "/predictions/special",
    icon: <Zap size={24} />,
    bgIcon: <Zap size={140} />,
    gradient: "from-[#14532d] via-[#15803d] to-[#0f766e]",
    badges: ["BTTS", "Over 2.5", "Basketball"],
  },
  {
    title: "Accumulator",
    highlight: "& Bet of the Day",
    subtitle: "Multiple selections combined into one ticket with boosted odds, plus our single best pick daily.",
    cta: "See Accumulators",
    href: "/predictions/accumulator-tips",
    icon: <TrendingUp size={24} />,
    bgIcon: <Target size={140} />,
    gradient: "from-[#0c4a6e] via-[#0369a1] to-[#0f766e]",
    badges: ["Combined Odds", "Best Pick"],
  },
];

export default function HeroSwiper() {
  return (
    <div className="mb-5 rounded-2xl overflow-hidden shadow-xl">
      <Swiper
        modules={[Autoplay, Pagination, EffectCoverflow]}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true, dynamicBullets: true }}
        effect="coverflow"
        coverflowEffect={{
          rotate: 18,
          stretch: 0,
          depth: 120,
          modifier: 1.1,
          slideShadows: false,
        }}
        loop
        speed={900}
        grabCursor
        className="w-full hero-swiper"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div className={`relative bg-gradient-to-br ${slide.gradient} min-h-[220px] sm:min-h-[240px] overflow-hidden`}>
              {/* Large decorative background icon */}
              <div className="absolute -right-8 -bottom-8 text-white/[0.04] pointer-events-none select-none float-animation-slow">
                {slide.bgIcon}
              </div>

              {/* Grid pattern overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Glowing orbs — bouncing */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-30%] right-[10%] w-48 h-48 rounded-full bg-white/[0.06] blur-3xl float-animation" />
                <div className="absolute bottom-[-20%] left-[5%] w-36 h-36 rounded-full bg-white/[0.04] blur-2xl float-animation-delayed" />
                <div className="absolute top-[20%] left-[40%] w-24 h-24 rounded-full bg-white/[0.03] blur-xl bounce-soft" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5 p-6 sm:p-8 h-full">
                {/* Left: text content */}
                <div className="flex-1 min-w-0">
                  {/* Icon + category label */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 bounce-soft">
                      {slide.icon}
                    </div>
                    <div className="flex gap-1.5">
                      {slide.badges?.slice(0, 2).map((badge, i) => (
                        <span
                          key={badge}
                          className={`text-[9px] font-bold uppercase tracking-wider text-white/70 bg-white/10 border border-white/10 rounded-full px-2 py-0.5 ${
                            i === 0 ? "float-animation" : "float-animation-delayed"
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-white font-display font-bold text-2xl sm:text-3xl lg:text-[2.15rem] mb-1.5 leading-[1.05] tracking-wide uppercase">
                    {slide.title}{" "}
                    <span className="text-lime-300 normal-case tracking-normal">
                      {slide.highlight}
                    </span>
                  </h2>

                  {/* Subtitle */}
                  <p className="text-white/65 text-sm mb-5 max-w-lg leading-relaxed line-clamp-2">
                    {slide.subtitle}
                  </p>

                  {/* CTA */}
                  <Link
                    href={slide.href}
                    className="group inline-flex items-center gap-2 bg-white text-teal-950 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:bg-lime-300"
                  >
                    {slide.cta}
                    <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* Right: decorative icon circle */}
                <div className="flex-shrink-0 hidden sm:flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-white/10 blur-xl scale-150 bounce-soft" />
                    <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/40 bounce-soft-delayed">
                      {slide.icon}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom decorative line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
