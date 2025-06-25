"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Trophy, Medal, Award, Crown, Loader2, Badge } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { addScoreToLeaderboard, getLeaderboardForToday } from "../actions/leaderboard.actions"
import { DateTime } from "luxon"

interface LeaderboardScreenProps {
  playerName: string
  playerScore: number
  onBack: () => void
  redirect: boolean
}

interface LeaderboardEntry {
  rank: number
  playerName: string
  score: number
}

export default function LeaderboardScreen({ playerName, playerScore, onBack }: LeaderboardScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [playerRank, setPlayerRank] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  useEffect(() => {
    const loadData = async () => {

      let currentPlayerRank = null

      // If player has a score, insert them into leaderboard
      if (playerScore > 0) {
        currentPlayerRank = await addScoreToLeaderboard(playerName, playerScore)
      }

      const data = await getLeaderboardForToday()

      setPlayerRank(currentPlayerRank)
      
      setLeaderboard(data)
      setIsLoading(false)
    }

    loadData()
    setInterval(() => {
      setTimeRemaining(getTimeRemaining())
    }, 1000)
  }, [playerName, playerScore])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <Trophy className="w-5 h-5 text-slate-400" />
    }
  }

  const getTimeRemaining = () => {
    const now = DateTime.utc()
    let midnight = DateTime.utc()

    midnight = midnight.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).plus({ days: 1 })

    const diff = midnight.diff(now, ["hours", "minutes", "seconds"]).toObject()
    const hours = Math.floor(diff.hours || 0)
    const minutes = Math.floor(diff.minutes || 0)
    const seconds = Math.floor(diff.seconds || 0)

    const timeRemaining = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return timeRemaining;
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600"
      default:
        return "bg-slate-500"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Loading Leaderboard</h3>
            <p className="text-slate-600 text-center">Fetching the latest rankings...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {
          playerScore < 0 && (
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          )
        }
        
        <h1 className="text-2xl font-bold text-slate-800">Leaderboard</h1>
        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Player Score Card (only if player has score > 0) */}
        {playerScore > 0 && playerRank && (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-xl">Your Performance</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-blue-100 text-sm">Your Rank</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    {getRankIcon(playerRank)}
                    <span className="text-2xl font-bold">#{playerRank}</span>
                  </div>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Time</p>
                  <p className="text-2xl font-bold mt-1">{playerScore}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Player</p>
                  <p className="text-lg font-semibold mt-1 truncate">{playerName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Top Players
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {leaderboard.slice(0, 10).map((entry) => (
                <div
                  key={`${entry.playerName}-${entry.rank}`}
                  className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${
                    entry.playerName === playerName && playerScore > 0 ? "bg-blue-50 border-l-4 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[60px]">
                      {getRankIcon(entry.rank)}
                      <Badge className={`${getRankBadgeColor(entry.rank)} text-white`}>#{entry.rank}</Badge>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {entry.playerName}
                        {entry.playerName === playerName && playerScore > 0 && (
                          <span className="ml-2 text-blue-600 text-sm">(You)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-800">{entry.score}</p>
                    <p className="text-sm text-slate-500">seconds</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold text-slate-800">{leaderboard.length}</p>
                    <p className="text-sm text-slate-600">Total Players</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-800">{timeRemaining}</p>
                    <p className="text-sm text-slate-600">Time until next round</p>
                </div>
            </div>          
        </CardContent>
        </Card>
      </div>
    </div>
  )
}
