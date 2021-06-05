const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const jsoning = require("jsoning-no-limits");
var user = new jsoning(".env/.json");
const fetch = require("node-fetch");
const retronid = require("retronid");
// keep
app.get('/',(req,res)=>{
	res.send('hiiiiiiiiiiiiiii')
})
// auth pages
app.get("/auth", (req, res) => {
  res.redirect(
    `https://scratch.auth.onedot.cf/?url=https://state.onedot.cf/authcallback`
  );
});
app.get("/authcallback", (req, res) => {
  var response;
  if (req.query.verified == "true") {
    retroid = retronid.generate();
    res.send(
      `<h1>Welcome @${escape(
        req.query.username
      )}! Enter the following code in your client, but <b><i>DO NOT SHARE IT</i></b>:</h1><br><h2>${retroid}</h2>`
    );
    // welcome user
    user.set(`${req.query.username}`, {
      online: true,
      retroid: retroid,
      richpresense: "",
			richpresenseurl: "",
    });
  } else {
    res.redirect("/auth");
  }
});
// api
app.post("/api/v1/user/:user", async (req, res) => {
  authtoken = req.body.retroid;
  username = req.params.user;
  if ((await auth.get(req.params.user).retroid) === authtoken) {
    user.set(`${req.params.username}`, {
      online: req.body.online,
      retroid: authtoken,
      richpresense: req.body.richpresense || "",
			richpresenseurl : req.body.richpresenseurl || "",
    });
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});
app.get("/api/v1/user/:user", async (req, res) => {
  json = await (
    await fetch(`https://my-ocular.jeffalo.net/api/user/${req.params.user}`)
  ).json();
  data = {
    online: (await user.get(req.params.user)).online || false,
    richpresense: (await user.get(req.params.user)).richpresense || "",
		richpresenseurl: (await user.get(req.params.user)).richpresenseurl || "",
    ocular: json,
  };
  res.json(data);
});
app.listen(3000);
