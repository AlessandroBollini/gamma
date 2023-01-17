const express = require('express');
const app = express();
const fs = require('fs');
const parseUrl = require('body-parser');
const encodeUrl = parseUrl.urlencoded({ extended: true });
const controller = require('./database/controller');
const exec = require('await-exec');
require("dotenv").config();
const contract = process.env.CONTRACT;

const port = 8080 || process.env.PORT;
app.set('view engine', 'ejs');
const myCss = {
    style: fs.readFileSync('./views/style.css', 'utf-8')
};

app.get('/', (_req, res) => {
    res.render("form", { myCss: myCss });
});

app.post('/', encodeUrl, async (req, res) => {
    const levelLenght = 1;
    const alreadyExist = await controller.checkUser(req.body.userAddress);
    try {
        if (alreadyExist == 0) {
            await exec('node scripts/transfer.js', {
                env: { USERWALLET: req.body.userAddress, EMAIL: req.body.email, ALCHEMY_MUMBAI_KEY:process.env.ALCHEMY_MUMBAI_KEY ,PRIVATE_KEY: process.env.PRIVATE_KEY, CONTRACT: process.env.CONTRACT, WALLET: process.env.WALLET }, function(error, stdout, stderr) {
                    if (error !== null) {
                        console.log('exec error: ', error);
                    }
                }
            });
            const id = await controller.findUser(req.body.userAddress);
            res.render("receipt", { myCss: myCss, contract: contract, id: id.id });
        } else {
            const checkLevel = await controller.hasUpgraded(req.body.userAddress, levelLenght);
            const id = await controller.findUser(req.body.userAddress);
            if (checkLevel == 0) {
                await exec('node scripts/levelUp.js', {
                    env: { TOKEN_ID: id.id, USERWALLET: id.wallet, ALCHEMY_MUMBAI_URL: process.env.ALCHEMY_MUMBAI_URL, ALCHEMY_MUMBAI_KEY:process.env.ALCHEMY_MUMBAI_KEY ,PRIVATE_KEY: process.env.PRIVATE_KEY, CONTRACT: process.env.CONTRACT, WALLET: process.env.WALLET }, function(error, stdout, stderr) {
                        if (error !== null) {
                            console.log('exec error: ', error);
                        }
                    }
                });
                res.render("update", { myCss: myCss });
            }
            res.render("receipt", { myCss: myCss, contract: contract, id: id.id });
        }
    } catch (err) {
        console.error(err);
        res.render("error", { myCss: myCss });
    }
});

app.listen(port, () => {
    console.log("App is up and running.");
})