import express from "express";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import dotenv from "dotenv";
import cors from 'cors';
dotenv.config();
const APP_ID = process.env.APP_ID;
const PORT = process.env.PORT;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const app = express();
const corsOptions = {
  origin: '*',
}
app.use(cors(corsOptions));
app.use(express.json());

const nocache = (req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

const generateAccessToken = (req, res) => {
  console.log("generateAccessToken");
  //set response header
  res.header("Access-Control-Allow-Origin", "*");
  //get channel name
  const channelName = req.query.channelName;
  if (!channelName) {
    return res.status(500).json({ error: "Channel is required" });
  }
  //get uid
  let uid = req.query.uid;
  if (!uid || uid == "") {
    uid = 0;
  }
  //get role
  let role = RtcRole.SUBSCRIBER;
  if (req.query.role === "publisher") {
    role = RtcRole.PUBLISHER;
  }
  //get the expire time
  let expireTime = req.query.expireTime;
  if (!expireTime || expireTime == "") {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  //calculate privilege expire time
  const currentTime = Math.floor(Date.now() / 100);
  const privilegeExpireTime = currentTime + expireTime;
  //build the token
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName
  );

  //return the token
  return res.json({ token: token });
};
app.get("/access_token",nocache, generateAccessToken);

app.get("/", (req, res) => {
  res.json({ message: "Token generator started" });
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
