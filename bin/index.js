#!/usr/bin/env node

const chalk = require("chalk");
let prompt = require("prompt-sync")();
const fetch = require("cross-fetch");
const cookie = require("cookie");

require("dotenv").config();

const { signInUser } = require("../auth-utils");
const { fetchAccounts, postAccounts, postCC, postInvestment, postSavings } = require("../fetch-utils");

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

  console.log(
    chalk.bold.cyan(
      "You have successfully logged in! Now, provide us with some info to help you achieve your money goals."
    )
  );

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
  console.log(
    chalk.bold.cyan("You have $" + remaining + " remaining each month")
  );
  console.log(userAccountInput);
  // This is where we would have the option to choose 'Get out of Debt', 'Save', or 'Invest'

  while(validUser) {
    const userTrack = prompt(chalk.bold.cyan("Which financial track best fits your needs? (type Debt, Save, or Invest) "));
  
    if (userTrack === 'Debt') {
        console.log(chalk.bold.green("Great! Let's get started in our Debt Management track."));
        // Credit card debt track
        const ccBalance = prompt("What is your credit card balance? ");
        const interest = prompt("What is your credit card's interest rate? ");
        const monthlyPayment = prompt("What is your monthly credit card payment? ");
        const monthsUntilPayoff = prompt(
          "In how many months do you want to pay off your debt? "
        );
      
        const userCCInput = {
          ccBalance,
          interest,
          monthlyPayment,
          monthsUntilPayoff,
        };
        const userCCInfo = await postCC(userCCInput, cookieInfo);
        console.log(userCCInput);
      
        // Fake equation
        const ccEquation =
          ccBalance -
          interest * monthsUntilPayoff -
          monthlyPayment * monthsUntilPayoff;
        console.log(
          chalk.bold.cyan(
            "You will need to increase your monthly payment to $" +
              ccEquation +
              " each month to hit your goal."
          )
        );
    } else if (userTrack === 'Save') {
      console.log(
        chalk.bold.green("Great! Let's get started in our Savings Growth track.")
      );
      // Savings track
      const savingsGoal = prompt("How much would you like to save? ");
  
      const userSavingsInput = {
        savingsGoal
      };
      const userSavingsInfo = await postSavings(
        userSavingsInput,
        cookieInfo
      );
      console.log(userSavingsInput);
  
      // Fake equation
      const savingsEquation = savingsGoal * 20;
      console.log(
        chalk.bold.cyan(
          "It will take " +
            savingsEquation +
            " months to reach your goal."
        )
      );
    } else if (userTrack === 'Invest') {
      // Investment - retirement track
      console.log(
        chalk.bold.green("Great! Let's get started in our Investments track.")
      );
      const age = prompt("What is your current age? ");
      const retirementAge = prompt("At what age do you wish to retire? ");
      const retirementAccountBalance = prompt(
        "What is your current retirement account balance? "
      );
      const retirementAmountGoal = prompt(
        "How much money do you want to retire with? "
      );
    
      const userRetirementInput = { 
        age, 
        retirementAge, 
        retirementAccountBalance,
        retirementAmountGoal,
       };

      const userRetirementInfo = await postInvestment(
        userRetirementInput,
        cookieInfo
      );
      console.log(userRetirementInput);
    
      const retirementEquation = (
        retirementAge, 
        retirementAccountBalance, 
        retirementAmountGoal 
      ) => {
        const amountNeeded = retirementAmountGoal - retirementAccountBalance
        const yearsToGo = retirementAge - age;
        const totalNeeded = (amountNeeded / yearsToGo);
        const result = (totalNeeded * (1 + .06)) / 12;
        return result
      }

      console.log(
        chalk.bold.cyan(
          "You will need to invest $" +
            retirementEquation(retirementAge, retirementAccountBalance, retirementAmountGoal) +
            " each month to hit your retirement goal."
        )
      );
    } else if (userTrack != 'Debt' | 'Save' | 'Invest') {
      console.log(chalk.bold.red('Not a valid selection. Please try again.'));
    }
  }
}

loadPrompts();

