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
        const interest = prompt("What is your credit card's interest rate? (10 percent = 0.1) ");
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
        

        const calculateDebt = ({ ccBalance, monthlyPayment, interest, monthsUntilPayoff }) => {
          const rawMonths = ccBalance / monthlyPayment;
          const annualI = (monthlyPayment * 12) * interest;
          const newMonthlyPayment = (ccBalance / monthsUntilPayoff);
          return Math.floor(Number(newMonthlyPayment));
        }
        
        console.log(chalk.bold.cyan(
          "You will need to make a monthly payment of $" + calculateDebt({ ccBalance, monthlyPayment, interest, monthsUntilPayoff }) + " to hit your goal.")
        );
    } else if (userTrack === 'Save') {
      console.log(
        chalk.bold.green("Great! Let's get started in our Savings Growth track.")
      );
      // Savings track
      const savingsGoal = prompt("How much would you like to save? ");
  
      const userSavingsInput = {
        savingsGoal: Number(savingsGoal)
      };
      
      const userSavingsInfo = await postSavings(
        userSavingsInput,
        cookieInfo
      );
      console.log(userSavingsInput);

      const monthlySavings = monthlyIncome * 0.2;
     
      const calculateMonths = (savingsGoal, monthlySavings) => {
        const timeToGoal = Number(savingsGoal) / monthlySavings;
        return Math.floor(timeToGoal);
      };
      
      console.log(chalk.bold.cyan("The recommended savings per month based on your monthly income is " + monthlySavings + ". It will take you " + calculateMonths(savingsGoal, monthlySavings) + " months to reach your goal."));
      
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
    
      const userRetirementInput = { age, retirementAge, retirementAccountBalance };
      const userRetirementInfo = await postInvestment(
        userRetirementInput,
        cookieInfo
      );
      console.log(userRetirementInput);
    
      // Fake equation
      const retirementEquation =
        (retirementAmountGoal - retirementAccountBalance) * (retirementAge - age);
      console.log(
        chalk.bold.cyan(
          "You will need to invest $" +
            retirementEquation +
            " each month to hit your retirement goal."
        )
      );
    } else if (userTrack != 'Debt' | 'Save' | 'Invest') {
      console.log(chalk.bold.red('Not a valid selection. Please try again.'));
    }
  }
}

loadPrompts();

