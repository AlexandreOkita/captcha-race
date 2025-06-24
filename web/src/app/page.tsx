"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Trophy, Play } from "lucide-react";
import GameScreen from "../screens/game";

export default function Component() {
  const [playerName, setPlayerName] = useState("");
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "game" | "leaderboard"
  >("home");

  const handleStart = () => {
    if (playerName.trim()) {
      setCurrentScreen("game");
    }
  };

  const handleLeaderboard = () => {
    setCurrentScreen("leaderboard");
  };

  const handleBack = () => {
    setCurrentScreen("home");
  };

  if (currentScreen === "game") {
    return <GameScreen playerName={playerName} onBack={handleBack} />;
  }

  if (currentScreen === "leaderboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Leaderboard coming soon...</p>
            <Button onClick={handleBack} className="mt-4">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Captcha Race
          </CardTitle>
          <p className="text-slate-600 mt-2">
            Teste sua velocidade resolvendo captchas
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="player-name"
              className="text-sm font-medium text-slate-700"
            >
              Seu nome
            </label>
            <Input
              id="player-name"
              type="text"
              placeholder="Digite seu nome..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="h-12 text-center text-lg border-2 focus:border-blue-500 transition-colors"
              maxLength={20}
            />
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleStart}
              disabled={!playerName.trim()}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Começar
            </Button>

            <Button
              onClick={handleLeaderboard}
              variant="outline"
              className="w-full h-12 text-lg font-semibold border-2 hover:bg-slate-50 transition-colors"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
