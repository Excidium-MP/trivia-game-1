import type { Question } from "./types";

/**
 * UX Quiz Challenge — Baymard Edition.
 * Checkout UX trivia. `correctIndex` is 0-based (A=0, B=1, C=2, D=3).
 */
export const QUESTIONS: Question[] = [
  {
    prompt: "According to Baymard, what is one of the biggest checkout UX mistakes?",
    choices: [
      "Having product recommendations in checkout",
      "Non-linear checkout flows",
      "Showing shipping costs early",
      "Using progress indicators",
    ],
    correctIndex: 1,
    funFact:
      "Baymard found that users become confused when the checkout doesn't follow a predictable sequence.",
  },
  {
    prompt: "What matters more than the number of checkout steps?",
    choices: ["Button color", "Number of payment methods", "Perceived effort", "Product images"],
    correctIndex: 2,
    funFact:
      "Baymard emphasizes reducing perceived complexity rather than simply reducing step count.",
  },
  {
    prompt:
      "What is the average number of form elements found in checkout flows according to Baymard?",
    choices: ["8", "12", "19.9", "35"],
    correctIndex: 2,
    funFact: "Optimized checkouts can be significantly shorter.",
  },
  {
    prompt: "Which field should often be hidden unless needed?",
    choices: ["Email", "Phone Number", "Address Line 2", "Zip Code"],
    correctIndex: 2,
    funFact: "Baymard recommends hiding secondary fields to reduce friction.",
  },
  {
    prompt:
      "What percentage of users abandon checkout because the process feels too long or complicated?",
    choices: ["8%", "15%", "26%", "50%"],
    correctIndex: 2,
    funFact: "One of Baymard's most cited checkout findings.",
  },
  {
    prompt: "Which checkout feature is frequently recommended to improve conversion?",
    choices: [
      "Mandatory account creation",
      "Guest Checkout",
      "More promotional banners",
      "More navigation options",
    ],
    correctIndex: 1,
    funFact: "Mandatory sign-up creates unnecessary friction.",
  },
  {
    prompt: "What should a checkout progress indicator represent?",
    choices: [
      "Marketing funnel stages",
      "Internal system steps",
      "A 1:1 map of the checkout process",
      "Estimated completion percentage",
    ],
    correctIndex: 2,
    funFact: "Users expect the progress bar to match reality.",
  },
  {
    prompt: "Which UX issue can make users leave checkout to search elsewhere?",
    choices: [
      "Hidden shipping options",
      "Coupon Code field visibility",
      "Large product images",
      "Sticky headers",
    ],
    correctIndex: 1,
    funFact: "Users often leave checkout to hunt for discount codes.",
  },
  {
    prompt: "According to Baymard, an optimized checkout can be reduced to approximately:",
    choices: ["20 fields", "15 fields", "10 fields", "6–8 fields"],
    correctIndex: 3,
    funFact:
      "Many sites ask for almost twice as much as needed. A lean checkout needs roughly: Email, Full Name, Street Address, City, ZIP, Card Number, Expiration, CVV.",
  },
  {
    prompt: "What is the ultimate goal of checkout optimization?",
    choices: ["More pages", "More fields", "Less perceived friction", "More upsells"],
    correctIndex: 2,
    funFact: "The easier checkout feels, the more likely users are to complete purchases.",
  },
];

/** Seconds allowed per question (used for the timer and speed-based scoring). */
export const TIME_LIMIT_SECONDS = 20;
