"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Star } from "lucide-react"
import { auth, db } from "@/firebase/init"
import { User } from "firebase/auth"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

interface FeedbackData {
  name: string
  email: string
  company: string
  role: string
  experienceLevel: string
  eventVenue: string
  eventDate: string
  ratings: {
    contentQuality: number
    speakerDelivery: number
    technicalDepth: number
    engagement: number
    overallExperience: number
  }
  questions: string
  improvements: string
}

export default function FeedbackPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState<FeedbackData>({
    name: "",
    email: "",
    company: "",
    role: "",
    experienceLevel: "",
    eventVenue: "",
    eventDate: "",
    ratings: {
      contentQuality: 0,
      speakerDelivery: 0,
      technicalDepth: 0,
      engagement: 0,
      overallExperience: 0,
    },
    questions: "",
    improvements: "",
  })

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        // Pre-fill name and email from auth
        setFormData(prev => ({
          ...prev,
          name: currentUser.displayName || "",
          email: currentUser.email || "",
        }))
      } else {
        // Redirect to sign-in if not authenticated
        router.push("/signup")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleRatingChange = (category: keyof typeof formData.ratings, rating: number) => {
    setFormData(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [category]: rating }
    }))
  }

  const handleInputChange = (field: keyof FeedbackData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push("/signup")
      return
    }

    setSubmitting(true)

    try {
      // Save feedback to Firestore
      const feedbackRef = collection(db, "feedback")
      await addDoc(feedbackRef, {
        ...formData,
        userId: user.uid,
        userDisplayName: user.displayName,
        userPhotoURL: user.photoURL,
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      })

      console.log("Feedback submitted successfully!")
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      // You could add error state handling here
      alert("Failed to submit feedback. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const StarRating = ({
    category,
    value,
    onChange,
  }: { 
    category: keyof typeof formData.ratings
    value: number
    onChange: (rating: number) => void 
  }) => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none">
            <Star
              className={`w-8 h-8 ${
                star <= value ? "text-accent fill-current" : "text-cream/30"
              } hover:text-accent transition-colors border-2 border-black`}
            />
          </button>
        ))}
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-cream font-sharetech flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold">LOADING...</p>
        </div>
      </div>
    )
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen text-cream font-sharetech flex items-center justify-center p-4">
        <Card className="w-full max-w-[80vw] text-center bg-accent text-primary neo-card">
          <CardHeader>
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-black">
              <svg className="w-10 h-10 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-3xl font-black">FEEDBACK RECEIVED!</CardTitle>
            <CardDescription className="text-primary font-bold text-lg">
              YOUR VOICE HAS BEEN HEARD. TOGETHER WE'RE BUILDING BETTER WEB3 EXPERIENCES.
            </CardDescription>
            <div className="pt-6">
              <Button
                onClick={async () => {
                  await auth.signOut()
                  setSubmitted(false)
                  router.push("/")
                }}
                className="bg-primary text-cream border-4 border-black font-black text-lg py-4 px-8 neo-button"
              >
                LOG OUT
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-cream font-sharetech py-8 px-4">
      <div className="max-w-[70vw] mx-auto">
        <Card className="bg-primary border-4 border-black neo-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-4xl font-black text-cream">FEEDBACK MATTERS</CardTitle>
                <CardDescription className="text-cream/80 font-bold text-lg">
                  YOUR INPUT SHAPES THE FUTURE OF WEB3 EDUCATION. EVERY OPINION COUNTS. MAKE IT COUNT.
                </CardDescription>
              </div>
              {user && (
                <div className="text-right">
                  <p className="text-cream/60 text-sm">SIGNED IN AS</p>
                  <p className="text-cream font-bold">{user.displayName}</p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information - Pre-filled from auth */}
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-accent">CONTACT INFO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-cream font-bold text-lg">
                      FULL NAME *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="YOUR FULL NAME"
                      className="bg-cream text-primary border-4 border-black font-bold neo-input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-cream font-bold text-lg">
                      EMAIL ADDRESS *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="YOUR@EMAIL.COM"
                      className="bg-cream text-primary border-4 border-black font-bold neo-input"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-cream font-bold text-lg">
                      COMPANY/ORGANIZATION
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="YOUR COMPANY"
                      className="bg-cream text-primary border-4 border-black font-bold neo-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-cream font-bold text-lg">
                      ROLE/POSITION
                    </Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      placeholder="YOUR ROLE"
                      className="bg-cream text-primary border-4 border-black font-bold neo-input"
                    />
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-accent">YOUR WEB3 JOURNEY</h3>
                <div className="space-y-4">
                  <Label className="text-cream font-bold text-lg">YEARS OF EXPERIENCE IN WEB3</Label>
                  <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange("experienceLevel", value)}>
                    <SelectTrigger className="bg-cream text-primary border-4 border-black font-bold neo-input">
                      <SelectValue placeholder="SELECT YOUR EXPERIENCE LEVEL" />
                    </SelectTrigger>
                    <SelectContent className="bg-cream text-primary border-4 border-black">
                      <SelectItem value="0-1">0-1 YEARS (NEWBIE)</SelectItem>
                      <SelectItem value="1-3">1-3 YEARS (LEARNING)</SelectItem>
                      <SelectItem value="3-5">3-5 YEARS (EXPERIENCED)</SelectItem>
                      <SelectItem value="5+">5+ YEARS (EXPERT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-accent">EVENT DETAILS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="eventVenue" className="text-cream font-bold text-lg">
                      EVENT VENUE
                    </Label>
                    <Input
                      id="eventVenue"
                      value={formData.eventVenue}
                      onChange={(e) => handleInputChange("eventVenue", e.target.value)}
                      placeholder="E.G., WEB3 SUMMIT MIAMI"
                      className="bg-cream text-primary border-4 border-black font-bold neo-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDate" className="text-cream font-bold text-lg">
                      EVENT DATE
                    </Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => handleInputChange("eventDate", e.target.value)}
                      className="bg-cream text-primary border-4 border-black font-bold neo-input"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Categories */}
              <div className="space-y-8">
                <h3 className="text-2xl font-black text-accent">RATE THE EXPERIENCE</h3>

                <div className="space-y-8">
                  <div className="bg-secondary/20 p-6 border-4 border-black neo-card">
                    <Label className="text-cream font-bold text-xl">CONTENT QUALITY</Label>
                    <p className="text-cream/80 font-bold mb-4">HOW VALUABLE AND RELEVANT WAS THE CONTENT?</p>
                    <StarRating
                      category="contentQuality"
                      value={formData.ratings.contentQuality}
                      onChange={(rating) => handleRatingChange("contentQuality", rating)}
                    />
                  </div>

                  <div className="bg-accent/20 p-6 border-4 border-black neo-card">
                    <Label className="text-cream font-bold text-xl">SPEAKER DELIVERY</Label>
                    <p className="text-cream/80 font-bold mb-4">HOW ENGAGING AND CLEAR WAS THE PRESENTATION?</p>
                    <StarRating
                      category="speakerDelivery"
                      value={formData.ratings.speakerDelivery}
                      onChange={(rating) => handleRatingChange("speakerDelivery", rating)}
                    />
                  </div>

                  <div className="bg-primary/40 p-6 border-4 border-black neo-card">
                    <Label className="text-cream font-bold text-xl">TECHNICAL DEPTH</Label>
                    <p className="text-cream/80 font-bold mb-4">WAS THE TECHNICAL LEVEL RIGHT FOR YOU?</p>
                    <StarRating
                      category="technicalDepth"
                      value={formData.ratings.technicalDepth}
                      onChange={(rating) => handleRatingChange("technicalDepth", rating)}
                    />
                  </div>

                  <div className="bg-secondary/20 p-6 border-4 border-black neo-card">
                    <Label className="text-cream font-bold text-xl">AUDIENCE ENGAGEMENT</Label>
                    <p className="text-cream/80 font-bold mb-4">HOW WELL DID THE SPEAKER CONNECT WITH THE CROWD?</p>
                    <StarRating
                      category="engagement"
                      value={formData.ratings.engagement}
                      onChange={(rating) => handleRatingChange("engagement", rating)}
                    />
                  </div>

                  <div className="bg-secondary/20 p-6 border-4 border-black neo-card">
                    <Label className="text-cream font-bold text-xl">OVERALL EXPERIENCE</Label>
                    <p className="text-cream/80 font-bold mb-4">YOUR OVERALL RATING OF THE EVENT</p>
                    <StarRating
                      category="overallExperience"
                      value={formData.ratings.overallExperience}
                      onChange={(rating) => handleRatingChange("overallExperience", rating)}
                    />
                  </div>
                </div>
              </div>

              {/* Questions and Comments */}
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-accent">QUESTIONS & FEEDBACK</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="questions" className="text-cream font-bold text-lg">
                      QUESTIONS FOR THE SPEAKER
                    </Label>
                    <Textarea
                      id="questions"
                      value={formData.questions}
                      onChange={(e) => handleInputChange("questions", e.target.value)}
                      placeholder="GOT QUESTIONS? FIRE AWAY!"
                      className="bg-cream text-primary border-4 border-black font-bold neo-input min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="improvements" className="text-cream font-bold text-lg">
                      HOW CAN WE LEVEL UP?
                    </Label>
                    <Textarea
                      id="improvements"
                      value={formData.improvements}
                      onChange={(e) => handleInputChange("improvements", e.target.value)}
                      placeholder="WHAT WOULD MAKE FUTURE PRESENTATIONS EVEN BETTER?"
                      className="bg-cream text-primary border-4 border-black font-bold neo-input min-h-[120px]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-accent hover:bg-accent/90 text-primary font-black text-2xl py-8 neo-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
                      SUBMITTING...
                    </>
                  ) : (
                    "SUBMIT FEEDBACK NOW"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}