import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";


// Return the rank of the player in the leaderboard
export async function addScoreToLeaderboard(playerName: string, score: number): Promise<number> {
    const todayKey = new Date().toISOString().split("T")[0];
    const playerDocRef = doc(db, "leaderboard", todayKey, "scores", playerName);
    const playerDoc = await getDoc(playerDocRef)
    if (playerDoc.exists()) {
        if (playerDoc.data().score > score) {
            await updateDoc(playerDocRef, { score });
        }
    } else {
        await setDoc(
            playerDocRef,
            { playerName, score }
        );
    }            
    
    const scoresCollection = collection(db, "leaderboard", todayKey, "scores");
    const scoresSnapshot = await getDocs(scoresCollection);
    const scores: { playerName: string; score: number }[] = [];
    scoresSnapshot.forEach(doc => {
        scores.push({ playerName: doc.data().playerName, score: doc.data().score });
    });

    scores.sort((a, b) => a.score - b.score);
    const playerIndex = scores.findIndex(s => s.playerName === playerName);
    return playerIndex !== -1 ? playerIndex + 1 : -1;
}

export async function getLeaderboardForToday(): Promise<{ playerName: string; score: number; rank: number }[]> {
    const todayKey = new Date().toISOString().split("T")[0];
    const scoresCollection = collection(db, "leaderboard", todayKey, "scores");
    const scoresSnapshot = await getDocs(scoresCollection);
    const scores: { playerName: string; score: number }[] = [];
    
    scoresSnapshot.forEach(doc => {
        scores.push({ playerName: doc.data().playerName, score: doc.data().score });
    });

    // Sort scores in descending order
    scores.sort((a, b) => a.score - b.score);
    
    return scores.map((score, index) => ({
        ...score,
        rank: index + 1
    }));
}