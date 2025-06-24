import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

export async function addScoreToLeaderboard(playerName: string, score: number): Promise<void> {
    const todayKey = new Date().toISOString().split("T")[0];
    await addDoc(
        collection(db, "leaderboard", todayKey, "scores"),
        { playerName, score }
    );
}

export async function getLeaderboardForToday(): Promise<{ playerName: string; score: number }[]> {
    const todayKey = new Date().toISOString().split("T")[0];
    const scoresCollection = collection(db, "leaderboard", todayKey, "scores");
    const scoresSnapshot = await getDocs(scoresCollection);
    const scores: { playerName: string; score: number }[] = [];
    
    scoresSnapshot.forEach(doc => {
        scores.push({ playerName: doc.data().playerName, score: doc.data().score });
    });

    // Sort scores in descending order
    scores.sort((a, b) => b.score - a.score);
    
    return scores;
}