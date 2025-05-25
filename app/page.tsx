import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Users, MessageSquare, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-cream font-sharetech">
      {/* Header */}
      <header className="border-b-4 border-black bg-primary">
        <div className="px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-accent border-4 border-black flex items-center justify-center neo-card">
              <MessageSquare className="w-6 h-6 text-primary font-black" />
            </div>
            <span className="text-2xl font-black text-cream tracking-tight">FEEDBACK MATTERS</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#1a1a1a] to-[#2a1a2a]">
        <div className="text-center max-w-6xl mx-auto">
          <div className="bg-accent text-primary p-4 inline-block neo-card mb-8">
            <h1 className="text-6xl md:text-8xl font-black leading-none">
              SHAPE THE
              <br />
              <span className="text-secondary">WEB3 FUTURE</span>
            </h1>
          </div>
          <p className="text-2xl text-cream/80 mb-12 max-w-3xl mx-auto font-sharetech">
            YOUR FEEDBACK POWERS BETTER WEB3 EDUCATION.
            <br />
            SPEAK UP. MAKE AN IMPACT. CHANGE THE GAME.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/feedback">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-cream font-black text-xl px-12 py-6 neo-button"
              >
                SUBMIT FEEDBACK NOW
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-cream mb-4">WHY YOUR VOICE MATTERS</h2>
            <div className="w-32 h-2 bg-accent mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-accent text-primary neo-card">
              <CardHeader className="text-center p-8">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 font-black" />
                <CardTitle className="text-2xl font-black mb-4">LEVEL UP CONTENT</CardTitle>
                <CardDescription className="text-primary font-sharetech text-lg">
                  HELP CRAFT WEB3 PRESENTATIONS THAT HIT DIFFERENT AND ACTUALLY MATTER
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-secondary text-cream neo-card">
              <CardHeader className="text-center p-8">
                <Users className="w-16 h-16 mx-auto mb-4" />
                <CardTitle className="text-2xl font-black mb-4">BOOST ENGAGEMENT</CardTitle>
                <CardDescription className="text-cream font-sharetech text-lg">
                  SHAPE INTERACTIVE EXPERIENCES THAT KEEP AUDIENCES LEARNING
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-cream text-primary neo-card">
              <CardHeader className="text-center p-8">
                <Star className="w-16 h-16 mx-auto mb-4" />
                <CardTitle className="text-2xl font-black mb-4">CUSTOM CONTENT</CardTitle>
                <CardDescription className="text-primary font-sharetech text-lg">
                  GET PRESENTATIONS TAILORED TO YOUR LEVEL AND INTERESTS IN THE WEB3 SPACE
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4 bg-accent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black text-primary mb-6">READY TO MAKE WAVES?</h2>
          <p className="text-2xl text-primary font-sharetech mb-12">2 MINUTES - LET'S GO.</p>
          <Link href="/feedback">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-cream font-black text-2xl px-16 py-8 neo-button"
            >
              SUBMIT FEEDBACK NOW
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-cream py-12 px-4 border-t-4 border-accent">
        <div className="text-center">
          <p className="text-lg font-sharetech">© 2025 FEEDBACK MATTERS. BUILT FOR THE WEB3 REVOLUTION.</p>
        </div>
      </footer>
    </div>
  )
}
