const express = require('express');
const Agora = require('agora-access-token');

const app = express();

app.get('/generate_token', (req, res) => {
  const channelName = req.query.channelName;
  const uid = req.query.uid || 0;
  const role = req.query.role || Agora.RtcRole.PUBLISHER;
  const expireTime = req.query.expireTime || 3600;

  const token = Agora.RtcTokenBuilder.buildTokenWithUid(
    "cfa9cd79da0e478084f0e2cecaec9972",
    "218fc23b86f3442f9edf552bd086a282",
    channelName,
    uid,
    role,
    Math.floor(Date.now() / 1000) + parseInt(expireTime)
  );

  res.json({ token });
});

app.listen(3000, () => {
  console.log('Token server running on port 3000');
});
