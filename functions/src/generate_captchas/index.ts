import {getFirestore} from "firebase-admin/firestore";
import {getStorage} from "firebase-admin/storage";
import * as svgCap from "svg-captcha";

const CAPTCHAS_PER_DAY = 10;

export const generateCaptcha = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate());
  const dateKey = tomorrow.toISOString().split("T")[0];
  const storage = getStorage();
  const firestore = getFirestore();
  const captchasObjects: {
    challengeNumber: string;
    createdAt: Date;
    imageUrl: string;
    solution: string;
  }[] = [];
  for (let i = 0; i < CAPTCHAS_PER_DAY; i++) {
    const challengeNumber = dateKey + "-" + i;
    // Randomly choose to create a text captcha or a math captcha
    const isMathCaptcha = Math.random() < 0.5;
    let captcha;
    if (isMathCaptcha) {
      captcha = svgCap.createMathExpr({
        size: 6,
        noise: 3,
        color: true,
        background: "#f0f0f0",
        mathMin: 1,
        mathMax: 10,
      });
    } else {
      captcha = svgCap.create({
        size: 6,
        noise: 3,
        color: true,
        background: "#f0f0f0",
      });
    }

    await storage
      .bucket()
      .file(`captchas/${challengeNumber}.svg`)
      .save(captcha.data, {
        contentType: "image/svg+xml",
      });

    const storageUrl = `https://storage.googleapis.com/${
      storage.bucket().name
    }/captchas/${challengeNumber}.svg`;

    const captchaObject = {
      challengeNumber,
      createdAt: new Date(),
      imageUrl: storageUrl,
      solution: captcha.text,
    };

    captchasObjects.push(captchaObject);
  }

  await firestore.collection("captchas").doc(dateKey).set({
    date: dateKey,
    captchas: captchasObjects,
  });

  return null;
};
