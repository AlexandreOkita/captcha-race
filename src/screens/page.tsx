"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Clock } from "lucide-react"

interface GameScreenProps {
  playerName: string
  onBack: () => void
}

export default function GameScreen({ playerName, onBack }: GameScreenProps) {
  const [countdown, setCountdown] = useState(3)
  const [gameStarted, setGameStarted] = useState(false)
  const [answer, setAnswer] = useState("")
  const [startTime, setStartTime] = useState<number | null>(null)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Start the game
      setTimeout(() => {
        setGameStarted(true)
        setStartTime(Date.now())
      }, 500)
    }
  }, [countdown])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (answer.trim() && startTime) {
      const endTime = Date.now()
      const timeElapsed = (endTime - startTime) / 1000
      console.log(`Answer: ${answer}, Time: ${timeElapsed}s`)
      // Here you would implement the captcha validation logic
    }
  }

  const handleSkip = () => {
    console.log("Captcha skipped")
    // Here you would implement skip logic (maybe with penalty)
  }

  if (countdown > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div
            key={countdown}
            className="text-9xl font-bold text-blue-600 animate-pulse transform transition-all duration-300 ease-out"
            style={{
              animation: `countdownPulse 1s ease-out`,
            }}
          >
            {countdown}
          </div>
          <p className="text-xl text-slate-600 mt-4">Get ready, {playerName}!</p>
        </div>
        <style jsx>{`
          @keyframes countdownPulse {
            0% {
              transform: scale(1.5);
              opacity: 0;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 transition-all duration-1000 ${gameStarted ? "opacity-100" : "opacity-0"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4" />
            <span className="font-mono">00:00</span>
          </div>
          <div className="text-slate-600">
            Player: <span className="font-semibold">{playerName}</span>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Challenge Counter */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Challenge #1</h2>
              <p className="text-slate-600">Solve the captcha as fast as you can!</p>
            </div>

            {/* Captcha Image Placeholder */}
            <div className="mb-8">
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <img
                  src="/placeholder.svg?height=120&width=300"
                  alt="Captcha challenge"
                  className="mx-auto mb-4 rounded border"
                  width={300}
                  height={120}
                />
                <p className="text-sm text-gray-500">Captcha will appear here</p>
              </div>
            </div>

            {/* Answer Input */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="captcha-answer" className="block text-sm font-medium text-slate-700 mb-2">
                  Enter the text you see above:
                </label>
                <Input
                  id="captcha-answer"
                  type="text"
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="h-12 text-lg text-center border-2 focus:border-blue-500 transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={!answer.trim()}
                  className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200"
                >
                  Submit Answer
                </Button>

                <Button
                  type="button"
                  onClick={handleSkip}
                  variant="outline"
                  className="h-12 px-6 border-2 hover:bg-slate-50 transition-colors"
                >
                  Skip
                </Button>
              </div>
            </form>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Look at the captcha image carefully</li>
                <li>• Type exactly what you see (case sensitive)</li>
                <li>• Submit as fast as possible for better score</li>
                <li>• Skip if you cannot read it (with time penalty)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
