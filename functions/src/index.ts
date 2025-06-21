import * as admin from "firebase-admin";
admin.initializeApp();

import {setGlobalOptions} from "firebase-functions";
import {generateCaptcha} from "./generate_captchas";
import * as functions from "firebase-functions/v1";

setGlobalOptions({maxInstances: 2});

export const generateCaptchaFunction = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("America/Sao_Paulo")
  .onRun(generateCaptcha);

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
