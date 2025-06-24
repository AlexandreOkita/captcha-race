import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export class Captcha {
    constructor(
        public imageUrl: string,
        public solution: string,
    ) {}
}

function _generateImageUrl(url: string): string {
    // https://storage.googleapis.com/captcha-race.firebasestorage.app/captchas/2025-06-22-0.svg
    // https://firebasestorage.googleapis.com/v0/b/captcha-race.firebasestorage.app/o/captchas%2F2025-06-22-0.svg?alt=media&height=120&width=300
    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/captcha-race.firebasestorage.app/o/captchas%2F";
    const urlParts = url.split("/captchas/");
    const fileName = urlParts[1];
    return `${baseUrl}${fileName}?alt=media&height=120&width=300`;
}

export async function getTodayCaptchas(): Promise<Captcha[]> {
    const todayKey = new Date().toISOString().split("T")[0];
    const captchasDocRef = doc(db, "captchas", todayKey);
    const captchasSnap = await getDoc(captchasDocRef);
    if (!captchasSnap.exists()) {
        console.error("No captchas found for today:", todayKey);
        return [];
    }
    const captchas = captchasSnap.data()?.captchas?.map((captcha: {
        imageUrl: string;
        solution: string;
    }) => {
        return new Captcha(_generateImageUrl(captcha.imageUrl), captcha.solution);
    }) || [];
    console.log("Today's captchas:", captchas);
    return captchas;
}