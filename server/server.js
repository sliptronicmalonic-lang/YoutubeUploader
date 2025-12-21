require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { TonClient } = require("@tonclient/core");
const { libNode } = require("@tonclient/lib-node");

TonClient.useBinaryLibrary(libNode);

const app = express();
app.use(bodyParser.json());

const PORT = 3000;
const MAX_ENTRIES = 20;
const ENTRY_PRICE = 0.2;

let entries = [];
let winnerData = null;

const client = new TonClient({
  network: { server_address: "https://toncenter.com/api/v2/jsonRPC" }
});

app.post("/entries", async (req, res) => {
  const { wallet } = req.body;

  if (!wallet) return res.status(400).send("Invalid wallet");
  if (entries.includes(wallet))
    return res.status(400).send("Wallet already entered");

  entries.push(wallet);
  console.log("Entry added:", wallet);

  if (entries.length === MAX_ENTRIES) {
    await pickWinner();
  }

  res.send({ success: true, total: entries.length });
});

async function pickWinner() {
  const winner = entries[Math.floor(Math.random() * entries.length)];
  const totalPot = MAX_ENTRIES * ENTRY_PRICE;
  const payout = totalPot * 0.8;

  winnerData = { winner, payout };

  await client.crypto.transfer({
    secretKey: process.env.HOST_SECRET,
    toAddress: winner,
    amount: (payout * 1e9).toString()
  });

  console.log("🎉 Winner paid:", winner);
  entries = [];
}

app.get("/winner", (req, res) => {
  if (!winnerData) return res.status(404).send("No winner yet");
  res.send(winnerData);
  winnerData = null;
});

app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);