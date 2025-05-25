"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signInWithPopup, User } from "firebase/auth"
import { auth, provider, db } from "@/firebase/init"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      if (user) {
        // Redirect to feedback page after successful sign in
        router.push("/feedback")
      }
    })

    return () => unsubscribe()
  }, [router])

  const saveUserToFirestore = async (user: User) => {
    try {
      const userDocRef = doc(db, "users", user.uid)
      
      // Check if user already exists
      const userDoc = await getDoc(userDocRef)
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        lastSignIn: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      if (!userDoc.exists()) {
        // New user - add createdAt timestamp
        await setDoc(userDocRef, {
          ...userData,
          createdAt: serverTimestamp(),
          isNewUser: true
        })
        console.log("New user created in Firestore")
      } else {
        // Existing user - just update login info
        await setDoc(userDocRef, userData, { merge: true })
        console.log("User data updated in Firestore")
      }
    } catch (error) {
      console.error("Error saving user to Firestore:", error)
      // Don't throw error here to avoid disrupting sign-in flow
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      
      console.log("User signed in:", user.displayName, user.email)
      
      // Save user data to Firestore
      await saveUserToFirestore(user)
      
    } catch (error: any) {
      console.error("Error signing in with Google:", error)
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Sign-in was cancelled. Please try again.")
      } else if (error.code === 'auth/popup-blocked') {
        setError("Popup was blocked. Please allow popups and try again.")
      } else {
        setError("Failed to sign in. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // If user is already signed in, show a different UI
  if (user) {
    return (
      <div className="min-h-screen text-cream font-sharetech flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-primary border-4 border-black neo-card">
            <CardHeader className="space-y-4 text-center">
              <CardTitle className="text-3xl font-black text-cream">WELCOME BACK!</CardTitle>
              <CardDescription className="text-cream/80 font-bold text-lg">
                {user.displayName?.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-cream/80">You are already signed in!</p>
              <Button
                onClick={() => router.push("/feedback")}
                className="w-full bg-cream text-primary border-4 border-black font-black text-lg py-6 neo-button"
              >
                GO TO FEEDBACK
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-cream font-sharetech flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-primary border-4 border-black neo-card">
          <CardHeader className="space-y-4 text-center">
            <CardTitle className="text-3xl font-black text-cream">JOIN THE REVOLUTION</CardTitle>
            <CardDescription className="text-cream/80 font-bold text-lg">
              BECOME PART OF THE WEB3 FEEDBACK COMMUNITY
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/20 border-2 border-red-500 rounded text-cream text-center">
                {error}
              </div>
            )}
            
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full bg-cream text-primary border-4 border-black font-black text-lg py-6 neo-button disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 mr-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  SIGNING IN...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  SIGN IN WITH GOOGLE
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-cream/60 text-sm">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}