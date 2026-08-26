import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="w-full overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0F2FE] via-[#F0E7FF] to-[#DCFCE7]"></div>

        {/* Gradient Orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-[80px] animate-pulse-slow"></div>
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-cyan-300/30 rounded-full blur-[80px] animate-float"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[450px] h-[450px] bg-green-300/20 rounded-full blur-[80px] animate-pulse-slow delay-1000"></div>
        <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-pink-300/20 rounded-full blur-[60px] animate-float delay-2000"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#7C3AED 1px, transparent 1px), linear-gradient(90deg, #7C3AED 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}></div>

        {/* Floating Icons */}
        <div className="absolute top-[15%] left-[8%] text-purple-400/40 animate-float text-3xl">
          <i className="fa-solid fa-camera"></i>
        </div>
        <div className="absolute top-[25%] right-[12%] text-cyan-400/40 animate-float delay-1000 text-2xl">
          <i className="fa-solid fa-download"></i>
        </div>
        <div className="absolute top-[60%] left-[15%] text-green-400/40 animate-pulse-slow text-2xl">
          <i className="fa-solid fa-bolt"></i>
        </div>
        <div className="absolute top-[70%] right-[8%] text-pink-400/40 animate-float delay-2000 text-3xl">
          <i className="fa-solid fa-heart"></i>
        </div>
        <div className="absolute top-[40%] left-[5%] text-indigo-400/30 animate-pulse-slow delay-1000 text-xl">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <div className="absolute top-[80%] right-[20%] text-purple-400/30 animate-float text-xl">
          <i className="fa-solid fa-share-nodes"></i>
        </div>
        <div className="absolute top-[10%] right-[25%] text-cyan-400/30 animate-pulse-slow text-lg">
          <i className="fa-solid fa-star"></i>
        </div>
        <div className="absolute bottom-[15%] left-[30%] text-green-400/30 animate-float delay-2000 text-lg">
          <i className="fa-solid fa-circle-check"></i>
        </div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8" data-aos="fade-down">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-purple-200 text-sm font-semibold text-cyan-600 shadow-lg hover:shadow-xl transition-all cursor-default group">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
              </span>
              <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">AI-Powered Video Intelligence</span>
              <i className="fa-solid fa-sparkles animate-pulse"></i>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center relative z-10" data-aos="fade-up" data-aos-duration="1200">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
              Turn long videos into
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-purple-500 via-cyan-500 to-green-500 bg-clip-text text-transparent relative z-10">viral short clips.</span>
                <span className="absolute inset-0 blur-[15px] opacity-40 bg-gradient-to-r from-purple-500 via-cyan-500 to-green-500 -z-10"></span>
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Automatically find the best highlights, generate engaging hooks, and format them for
              <span className="text-purple-600 font-semibold"> Shorts</span>,
              <span className="text-cyan-600 font-semibold"> Reels</span>, and
              <span className="text-green-600 font-semibold"> TikTok</span> in just one click.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/dashboard"
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:from-purple-500 hover:via-purple-600 hover:to-cyan-600 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10">Get Started for Free</span>
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform relative z-10"></i>
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur hover:bg-white text-gray-800 rounded-xl font-semibold text-base transition-all hover:scale-105 flex items-center justify-center gap-2 border border-gray-200 hover:border-purple-300 group shadow-md"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <i className="fa-solid fa-play text-purple-600 text-sm"></i>
                </div>
                <span>See how it works</span>
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-xs" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="font-medium"><span className="text-gray-800 font-bold">2,000+</span> creators trust ClipForge</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <i key={i} className="fa-solid fa-star text-yellow-400 text-xs"></i>
                ))}
                <span className="ml-2 font-medium"><span className="text-gray-800 font-bold">4.9/5</span> from 500+ reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/70 backdrop-blur p-8 rounded-2xl border border-gray-200 shadow-xl relative overflow-hidden" data-aos="zoom-in">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-200/30 rounded-full blur-[60px]"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-200/30 rounded-full blur-[60px]"></div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              {[
                { icon: 'fa-video', number: '10K+', label: 'Videos Processed', color: 'text-purple-600', bg: 'bg-purple-100' },
                { icon: 'fa-scissors', number: '50K+', label: 'Clips Generated', color: 'text-cyan-600', bg: 'bg-cyan-100' },
                { icon: 'fa-clock', number: '100K+', label: 'Hours Saved', color: 'text-green-600', bg: 'bg-green-100' },
                { icon: 'fa-globe', number: '150+', label: 'Countries', color: 'text-pink-600', bg: 'bg-pink-100' },
              ].map((stat, i) => (
                <div key={i} className="text-center group" data-aos="fade-up" data-aos-delay={i * 100}>
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <i className={`fa-solid ${stat.icon} text-lg ${stat.color}`}></i>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-gray-200 text-xs font-semibold text-cyan-600 mb-5 shadow-md">
              <i className="fa-solid fa-bolt"></i>
              <span>Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to <br/><span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">dominate short-form</span></h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">ClipForge gives you superpowers to create viral content at scale.</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: 'fa-brain',
                title: 'AI Highlight Detection',
                description: 'Our advanced models analyze audio and visual context to extract the most engaging moments perfectly.',
                color: 'text-purple-600',
                bgColor: 'bg-purple-100',
                features: ['Speech pattern analysis', 'Emotion detection', 'Visual cue recognition']
              },
              {
                icon: 'fa-quote-left',
                title: 'Smart Hooks & Captions',
                description: 'Automatically generates compelling hooks and explains why each clip will perform well.',
                color: 'text-cyan-600',
                bgColor: 'bg-cyan-100',
                features: ['Attention-grabbing hooks', 'Viral potential scoring', 'Auto captions']
              },
              {
                icon: 'fa-crop-simple',
                title: 'Vertical Formatting',
                description: 'Instantly crops and reformats 16:9 landscape videos into perfectly centered 9:16 vertical clips.',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                features: ['Auto face tracking', 'Smart subject detection', 'Perfect 9:16 framing']
              },
              {
                icon: 'fa-wand-magic-sparkles',
                title: 'One-Click Processing',
                description: 'From URL to viral clips in minutes. No editing skills required.',
                color: 'text-pink-600',
                bgColor: 'bg-pink-100',
                features: ['Fully automated', 'No manual editing', 'Batch processing']
              },
              {
                icon: 'fa-cloud-arrow-down',
                title: 'Instant Downloads',
                description: 'Download your clips in the highest quality. Ready to post immediately.',
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-100',
                features: ['HD & 4K support', 'No watermarks', 'Platform-optimized']
              },
              {
                icon: 'fa-chart-line',
                title: 'Performance Analytics',
                description: 'Track which clips perform best and learn what makes content go viral.',
                color: 'text-teal-600',
                bgColor: 'bg-teal-100',
                features: ['Viral score prediction', 'Platform insights', 'A/B testing']
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-white/80 backdrop-blur p-6 rounded-2xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl relative overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`fa-solid ${feature.icon} text-xl ${feature.color}`}></i>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{feature.description}</p>

                <ul className="space-y-1.5">
                  {feature.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-gray-500">
                      <i className="fa-solid fa-check text-green-500 text-xs"></i>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-gray-200 text-xs font-semibold text-green-600 mb-5 shadow-md">
              <i className="fa-solid fa-list-check"></i>
              <span>Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">3 Steps to <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">Viral Content</span></h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">From idea to viral clip in under 5 minutes.</p>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-6" data-aos="fade-right">
              <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <div className="flex-1 bg-white/80 backdrop-blur p-6 rounded-2xl border border-gray-200 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Paste Your URL</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">Just drop a link to your long-form YouTube video. No downloading, no uploading — we handle everything.</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <i className="fa-solid fa-link text-purple-600"></i>
                  <span>Supports YouTube, Vimeo & more</span>
                </div>
              </div>
              <div className="hidden md:block w-48 bg-white/80 backdrop-blur p-4 rounded-2xl border border-gray-200 text-center">
                <i className="fa-brands fa-youtube text-4xl text-red-500 mb-2"></i>
                <p className="text-gray-400 font-mono text-xs">youtube.com/watch?v=...</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-6" data-aos="fade-right" data-aos-delay="100">
              <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <div className="flex-1 bg-white/80 backdrop-blur p-6 rounded-2xl border border-gray-200 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Magic Happens</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">Our AI analyzes the transcript, detects emotions, finds key moments, and identifies viral-worthy segments.</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <i className="fa-solid fa-microchip text-cyan-600"></i>
                  <span>Powered by advanced ML models</span>
                </div>
              </div>
              <div className="hidden md:block w-48 bg-white/80 backdrop-blur p-4 rounded-2xl border border-gray-200 text-center">
                <i className="fa-solid fa-brain text-4xl text-purple-500 mb-2 animate-pulse"></i>
                <p className="text-gray-400 font-mono text-xs">Analyzing...</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-6" data-aos="fade-right" data-aos-delay="200">
              <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <div className="flex-1 bg-white/80 backdrop-blur p-6 rounded-2xl border border-gray-200 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Download & Post</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">Review your AI-generated clips, customize captions, and download in perfect 9:16 format ready for any platform.</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <i className="fa-solid fa-mobile-screen text-green-600"></i>
                  <span>Optimized for all platforms</span>
                </div>
              </div>
              <div className="hidden md:block w-48 bg-white/80 backdrop-blur p-4 rounded-2xl border border-gray-200">
                <div className="flex justify-center gap-3">
                  <i className="fa-brands fa-tiktok text-3xl text-gray-800"></i>
                  <i className="fa-brands fa-instagram text-3xl text-pink-500"></i>
                  <i className="fa-brands fa-youtube text-3xl text-red-500"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-gray-200 text-xs font-semibold text-pink-600 mb-5 shadow-md">
              <i className="fa-solid fa-heart"></i>
              <span>Loved by Creators</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What creators <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">say about us</span></h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">Join thousands of content creators who trust ClipForge.</p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Sarah Chen',
                handle: '@sarahcreates',
                role: 'YouTube Creator',
                subscribers: '500K subs',
                avatar: 'SC',
                content: 'ClipForge literally changed my content strategy. I went from spending 10 hours editing shorts to just 30 minutes. My engagement doubled!',
                platform: 'youtube'
              },
              {
                name: 'Marcus Johnson',
                handle: '@marcusj',
                role: 'TikTok Creator',
                subscribers: '2M followers',
                avatar: 'MJ',
                content: 'The AI hook generation is insane. It understands what makes content viral better than most editors I have worked with.',
                platform: 'tiktok'
              },
              {
                name: 'Emma Rodriguez',
                handle: '@emmarod',
                role: 'Brand Manager',
                subscribers: '50+ clients',
                avatar: 'ER',
                content: 'We use ClipForge for all our client content. The consistency and quality is unmatched. Best investment for our agency.',
                platform: 'instagram'
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-gray-200 hover:border-purple-300 transition-all hover:shadow-xl group"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <i className={`fa-brands fa-${testimonial.platform} text-xl text-gray-400 group-hover:text-purple-600 transition-colors`}></i>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{testimonial.content}"</p>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

                <div>
                  <div className="font-bold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.handle}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>{testimonial.subscribers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Section Header */}
          <div className="mb-14" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-gray-200 text-xs font-semibold text-green-600 mb-5 shadow-md">
              <i className="fa-solid fa-tag"></i>
              <span>Simple Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Start free, <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">scale as you grow</span></h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">No credit card required. Upgrade when you need more.</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                description: 'Perfect for trying out ClipForge',
                features: ['3 videos per month', '720p export', 'Basic AI analysis', 'Watermarked clips'],
                cta: 'Get Started',
                popular: false
              },
              {
                name: 'Pro',
                price: '$19',
                period: 'per month',
                description: 'For serious content creators',
                features: ['Unlimited videos', '1080p & 4K export', 'Advanced AI hooks', 'No watermarks', 'Priority processing', 'Custom branding'],
                cta: 'Start Free Trial',
                popular: true
              },
              {
                name: 'Agency',
                price: '$49',
                period: 'per month',
                description: 'For teams and agencies',
                features: ['Everything in Pro', 'Team collaboration', 'API access', 'White-label option', 'Dedicated support', 'Custom integrations'],
                cta: 'Contact Sales',
                popular: false
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative bg-white/80 backdrop-blur p-6 rounded-2xl border transition-all hover:shadow-xl ${plan.popular ? 'border-purple-400 scale-105 shadow-xl' : 'border-gray-200'}`}
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-bold rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-xs text-gray-500">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6 text-left">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <i className={`fa-solid fa-check text-green-500 ${plan.popular ? 'text-base' : ''}`}></i>
                      <span className={plan.popular ? 'font-medium text-gray-900' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-105' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur p-10 md:p-12 rounded-[2rem] border border-gray-200 relative overflow-hidden shadow-2xl" data-aos="zoom-in">
            <div className="absolute top-[-40%] right-[-15%] w-[400px] h-[400px] bg-gradient-to-bl from-purple-200/40 via-cyan-200/30 to-transparent rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-40%] left-[-15%] w-[400px] h-[400px] bg-gradient-to-tr from-green-200/30 via-purple-200/30 to-transparent rounded-full blur-[80px]"></div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-gray-200 text-xs font-semibold text-purple-600 mb-6 shadow-md">
                <i className="fa-solid fa-rocket"></i>
                <span>Ready to scale your content?</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Start creating <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">viral clips</span> today
              </h2>

              <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto">
                Join 2,000+ creators who are saving hours every week and growing their audience with AI-powered clips.
              </p>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-purple-600 to-cyan-500 hover:from-purple-600 hover:via-purple-500 hover:to-cyan-600 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span>Start Clipping Now — It's Free</span>
              </Link>

              <p className="text-xs text-gray-500 mt-5">
                <i className="fa-solid fa-check text-green-500 mr-1.5"></i>
                No credit card required
                <span className="mx-2">•</span>
                <i className="fa-solid fa-check text-green-500 mr-1.5"></i>
                Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 relative z-10 bg-white/50 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-md">
                  <i className="fa-solid fa-scissors text-white text-sm"></i>
                </div>
                <span className="text-lg font-bold text-gray-900">ClipForge</span>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mb-4">
                AI-powered video clipping for the modern creator. Turn long videos into viral short clips in one click.
              </p>
              <div className="flex gap-2">
                {['twitter', 'instagram', 'tiktok', 'youtube'].map((social) => (
                  <a key={social} href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-purple-100 transition-all">
                    <i className={`fa-brands fa-${social} text-sm`}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="#features" className="hover:text-purple-600 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-purple-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Roadmap</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="#" className="hover:text-purple-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Community</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-500">
              © 2026 ClipForge. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Made with</span>
              <i className="fa-solid fa-heart text-red-500"></i>
              <span>for creators worldwide</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(3deg); }
          66% { transform: translateY(-8px) rotate(-3deg); }
        }

        @keyframes particle {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
          50% { opacity: 1; }
          25%, 75% { opacity: 0.5; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-particle {
          animation: particle 4s ease-in-out infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
