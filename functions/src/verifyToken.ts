// import * as functions from "firebase-functions";
const functions = require("firebase-functions");

const admin = require("./conf").admin;

// import cors from "cors";
const cors = require("cors");

const corsHandler = cors({ origin: true });

export const verifyToken = functions.https.onRequest(async (req: { headers: { authorization: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; uid?: any; email?: any; }): any; new(): any; }; }; }) => {
  corsHandler(req, res, async () => {
    try {
      const idToken = req.headers.authorization?.split("Bearer ")[1];

      if (!idToken) {
        return res.status(401).json({ error: "No token provided" });
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return res.status(200).json({ uid: decodedToken.uid, email: decodedToken.email });
    } catch (error) {
      return res.status(403).json({ error: "Invalid token" });
    }
  });
});