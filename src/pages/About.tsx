import React from 'react';
// import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Zap, ShieldCheck, Briefcase, CheckCircle, Sparkles, Lightbulb, Globe } from 'lucide-react';
import FloatInOnView from '@/components/FloatInOnView';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #eaffb2 0%, #b6e36b 40%, #29443e 100%)' }}>
      <FloatInOnView>
        <section id="vision" className="pt-20 pb-32 bg-transparent">
          <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-extrabold text-[#183a1d] mb-6 leading-tight drop-shadow-[0_2px_8px_rgba(127,174,46,0.7)]">Our Vision</h1>
              <p className="text-2xl text-[#29443e] max-w-3xl mx-auto md:mx-0 font-medium leading-relaxed">
                To be the leading force in sustainable business transformation,<br />
                empowering organizations to thrive through seamless ESG integration.
              </p>
            </div>
            <img
              src="/1701189738351.jpg"
              alt="Vision - ESG sustainability in hand"
              className="w-64 h-64 object-cover rounded-full shadow-2xl border-4 border-green-300 flex-shrink-0"
            />
          </div>
        </section>
      </FloatInOnView>
      <FloatInOnView>
        <section id="mission" className="pt-10 pb-32 bg-transparent">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-[#183a1d] mb-16 drop-shadow-[0_2px_8px_rgba(127,174,46,0.7)]">Our Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <Card className="rounded-3xl bg-white/90 shadow-xl border-0">
                <CardContent className="flex flex-col items-center py-10">
                  <Zap className="mb-6 w-12 h-12 text-green-700" />
                  <CardDescription className="text-lg text-[#29443e] text-center font-semibold">
                    Empower businesses to achieve a sustainable future through innovative tools and expert support for leveraging ESG data
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="rounded-3xl bg-white/90 shadow-xl border-0">
                <CardContent className="flex flex-col items-center py-10">
                  <ShieldCheck className="mb-6 w-12 h-12 text-green-700" />
                  <CardDescription className="text-lg text-[#29443e] text-center font-semibold">
                    Facilitate the transition to sustainable practices that enhance economic returns for businesses
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="rounded-3xl bg-white/90 shadow-xl border-0">
                <CardContent className="flex flex-col items-center py-10">
                  <Briefcase className="mb-6 w-12 h-12 text-green-700" />
                  <CardDescription className="text-lg text-[#29443e] text-center font-semibold">
                    Automate the ESG compliance process, making it accessible and efficient for all businesses
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FloatInOnView>
      <FloatInOnView>
        <section id="values" className="pt-10 pb-32 bg-transparent">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-[#183a1d] mb-16 drop-shadow-[0_2px_8px_rgba(127,174,46,0.7)]">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <Card className="rounded-3xl bg-white/90 shadow-xl border-0">
                <CardContent className="flex flex-col items-center py-10">
                  <ShieldCheck className="mb-6 w-12 h-12 text-green-700" />
                  <CardTitle className="text-2xl font-bold text-[#183a1d] mb-2">Integrity</CardTitle>
                  <CardDescription className="text-lg text-[#29443e] text-center font-semibold">Highest standards of honesty and ethical behavior</CardDescription>
                </CardContent>
              </Card>
              <Card className="rounded-3xl bg-white/90 shadow-xl border-0">
                <CardContent className="flex flex-col items-center py-10">
                  <Sparkles className="mb-6 w-12 h-12 text-green-700" />
                  <CardTitle className="text-2xl font-bold text-[#183a1d] mb-2">Excellence</CardTitle>
                  <CardDescription className="text-lg text-[#29443e] text-center font-semibold">We strive for excellence in products, services and customer support</CardDescription>
                </CardContent>
              </Card>
              <Card className="rounded-3xl bg-white/90 shadow-xl border-0">
                <CardContent className="flex flex-col items-center py-10">
                  <Lightbulb className="mb-6 w-12 h-12 text-green-700" />
                  <CardTitle className="text-2xl font-bold text-[#183a1d] mb-2">Innovation</CardTitle>
                  <CardDescription className="text-lg text-[#29443e] text-center font-semibold">Promoting new and existing solutions to sustainability challenges</CardDescription>
                </CardContent>
              </Card>
              <Card className="rounded-3xl bg-white/90 shadow-xl border-0">
                <CardContent className="flex flex-col items-center py-10">
                  <Globe className="mb-6 w-12 h-12 text-green-700" />
                  <CardTitle className="text-2xl font-bold text-[#183a1d] mb-2">Sustainability</CardTitle>
                  <CardDescription className="text-lg text-[#29443e] text-center font-semibold">We build for impact and build to last in all areas of business</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FloatInOnView>
      <Footer />
    </div>
  );
};

export default About;
