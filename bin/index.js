#!/usr/bin/env node

const chalk = require("chalk");
let prompt = require("prompt-sync")();
const fetch = require("cross-fetch");
const env = require("dotenv").config()

async function loadPrompts() {
  console.log(chalk.bold.underline.bgWhite.cyan("Welcome to Money Goals!"));

  const email = prompt("Hello. What is your email? ");

  console.log(chalk.bold.red(`Hello ${email}!`));
  const password = prompt.hide("What is your password? ");
  await loadUser(email, password);
}

loadPrompts();

async function loadUser(email, password) {
  const resp = await fetch(`http://localhost:7890/api/v1/users/sessions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const data = await resp.json();
  console.log(data);
}
