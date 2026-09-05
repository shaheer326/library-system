import { cert, initializeApp } from "firebase-admin/app";
import { readFileSync } from "fs";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(readFileSync("./school-library-4b6ed-firebase-adminsdk-fbsvc-957f46d306.json"));

initializeApp({
    credential: cert(serviceAccount)
});

const auth = getAuth();
const email = process.argv[2];
const user = await auth.getUserByEmail(email)

await auth.setCustomUserClaims( user.uid , {admin: true} )
console.log("success")