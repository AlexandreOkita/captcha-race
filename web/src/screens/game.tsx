"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, Check, X } from "lucide-react";
import { Captcha, getTodayCaptchas } from "../actions/captcha.actions";

interface GameScreenProps {
  playerName: string;
  onBack: () => void;
  onGameComplete: (score: number) => void;
}

export default function GameScreen({ playerName, onBack, onGameComplete }: GameScreenProps) {
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [captchas, setCaptchas] = useState<Captcha[]>([]);
  const [currentCaptchaIndex, setCurrentCaptchaIndex] = useState(0);
  const [showResult, setShowResult] = useState<"correct" | "incorrect" | null>(null)


  useEffect(() => {
    if (captchas.length === 0) {
      getTodayCaptchas().then((fetchedCaptchas) => {
        setCaptchas(fetchedCaptchas);
      });
    } else {
      if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
      } else {
        setTimeout(() => {
          setGameStarted(true);
          setStartTime(Date.now());
        }, 500);
      }
    }
  }, [countdown, captchas]);
    
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && startTime) {
      const endTime = Date.now();
      const timeElapsed = (endTime - startTime) / 1000;
      console.log(`Answer: ${answer}, Time: ${timeElapsed}s`);
      
      if (answer.trim().toLowerCase() === captchas[currentCaptchaIndex].solution.toLowerCase()) {
        setShowResult("correct");
        if (currentCaptchaIndex == captchas.length - 1) {
          console.log("Game completed!");
          // Here you would handle the end of the game, maybe show a summary or score
          setGameStarted(false);
          setCountdown(3);
          setCurrentCaptchaIndex(0);
          onGameComplete(timeElapsed);
        } else {
          setCurrentCaptchaIndex(currentCaptchaIndex + 1);
          console.log("Correct answer, moving to next captcha");
        }
      } else {
        setShowResult("incorrect");
      }
      setTimeout(() => {
        setShowResult(null)
        setAnswer("")
        setTimeout(() => {
          console.log("Focusing input after submit");
          if (inputRef.current) {
            console.log("Input ref is set, focusing now");
            inputRef.current.focus();
          }
        }, 100);
      }, 1000)
    }
  };

  if (captchas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Loading Captchas...
            </h2>
            <p className="text-slate-600">
              Please wait while we fetch daily captchas.
            </p>
            <div className="mt-6">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
          <p className="text-xl text-slate-600 mt-4">
            Get ready, {playerName}!
          </p>
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
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 transition-all duration-1000 ${
        gameStarted ? "opacity-100" : "opacity-0"
      }`}>
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-4">
          <div className="text-slate-600">
            Player: <span className="font-semibold">{playerName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Challenge {currentCaptchaIndex + 1} of {captchas.length}
              </h2>
              <p className="text-slate-600">
                Solve the captcha as fast as you can!
              </p>
            </div>

            <div className="mb-8">
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {!showResult && (
                <img
                  src={captchas[currentCaptchaIndex].imageUrl}
                  alt="Captcha challenge"
                  className="mx-auto mb-4 rounded border"
                  width={300}
                  height={120}
                />
              )}
              {showResult && (
                  <div className="inset-0 flex items-center justify-center">
                    <div
                      className={`transform transition-all duration-500 ease-out ${
                        showResult ? "scale-100 opacity-100" : "scale-0 opacity-0"
                      }`}
                    >
                      {showResult === "correct" ? (
                        <div className="bg-green-500 rounded-full p-4 shadow-xl animate-bounce">
                          <Check className="w-12 h-12 text-white stroke-[3]" />
                        </div>
                      ) : (
                        <div className="bg-red-500 rounded-full p-4 shadow-xl animate-pulse">
                          <X className="w-12 h-12 text-white stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Answer Input */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="captcha-answer"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Enter the text you see above:
                </label>
                <Input
                  id="captcha-answer"
                  ref={inputRef}
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

              </div>
            </form>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">
                Instructions:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Look at the captcha image carefully</li>
                <li>• Type exactly what you see (case insensitive)</li>
                <li>• Submit as fast as possible for better score</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
