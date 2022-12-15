#!/usr/bin/env node

const chalk = require("chalk");
let prompt = require("prompt-sync")();
const fetch = require("cross-fetch");
const cookie = require("cookie");
const inquirer = require("inquirer");

require("dotenv").config();

const { signInUser } = require("../auth-utils");
const { fetchAccounts, postAccounts } = require("../fetch-utils");

async function loadPrompts() {
  console.log(chalk.bold.underline.bgWhite.cyan("Welcome to Money Goals!"));

  let validUser = false;
  let cookieInfo;
  while (!validUser) {
    const email = prompt("Hello. What is your email? ");
    console.log(chalk.bold.red(`Hello ${email}!`));
    const password = prompt.hide("What is your password? ");
    try {
      cookieInfo = await signInUser(email, password);
      validUser = true;
    } catch (e) {
      console.log(chalk.bold.red(e.message));
    }
  }

  const monthlyIncome = prompt("What is your net income per month? ");
  const housing = prompt("How much do you spend on housing per month? ");
  const transportation = prompt(
    "How much do you spend on transportation per month? "
  );
  const groceries = prompt("How much do you spend on groceries per month? ");
  const insurance = prompt(
    "How much do you spend on insurance per month (including auto insurance, health insurance, life insurance, disability insurance?) "
  );
  const healthcare = prompt(
    "How much do you spend on additional healthcare costs per month? "
  );
  const utilities = prompt("How much do you spend on utilities per month? ");
  const miscellaneous = prompt(
    "How much do you spend on miscellaneous items (clothing, home furnishings, gym memberships, entertainment) per month? "
  );
  const savings = prompt(
    "How much do you spend on savings, investments, and debt payments per month? "
  );

  const userAccountInput = {
    monthlyIncome,
    housing,
    transportation,
    groceries,
    insurance,
    healthcare,
    utilities,
    miscellaneous,
    savings,
  };

  const accountInfo = await postAccounts(userAccountInput, cookieInfo);
  const remaining =
    monthlyIncome -
    housing -
    transportation -
    groceries -
    insurance -
    healthcare -
    utilities -
    miscellaneous -
    savings;
  console.log("You have $", remaining, "remaining each month");

  //INQUIRER BREAK//
  const questions = [
    {
      type: "list",
      name: "track",
      message: "Which financial track best fits your needs?",
      choices: ["Debt", "Saving", "Invest"],
      filter(val) {
        return val.toLowerCase();
      },
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    console.log(JSON.stringify(answers, null, " "));
  });
  //INQUIRER BREAK//
}
loadPrompts();


