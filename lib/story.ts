/**
 * Before / After storytelling data — "Checkout UX, Baymard Edition".
 *
 * The host walks the team through eight checkout moments, flipping each from the
 * friction version ("before") to the research-backed fix ("after"). Each card
 * links back to the trivia question(s) it relates to, so the story and the quiz
 * reinforce each other.
 *
 * Content is drawn from the Baymard Checkout UX Guide:
 * https://baymard.com/learn/checkout-flow-ux-optimization
 * The mock screens are original illustrations of the concepts, not screenshots.
 */

/** A single rendered line inside a mock checkout screen. */
export type MockRow =
  | { t: "steps"; steps: { label: string; state?: "done" | "now" }[] }
  | { t: "field"; label: string; value?: string; state?: "empty" | "filled" | "error" | "cleared" }
  | { t: "button"; label: string; variant?: "primary" | "ghost" | "pay"; badge?: string }
  | { t: "msg"; text: string; tone: "bad" | "good" | "info" }
  | { t: "note"; text: string }
  | { t: "check"; label: string }
  | { t: "summary"; items: { label: string; value: string; surprise?: boolean }[]; total: string }
  | { t: "suggest"; items: string[] }
  | { t: "keyboard"; numeric: boolean };

export interface StoryCard {
  key: string;
  guideline: string;
  title: string;
  lede: string;
  before: MockRow[];
  after: MockRow[];
  whyBefore: string;
  whyAfter: string;
  refs: { label: string; url: string }[];
  /** 1-based trivia question numbers this card maps to. Empty = bonus concept. */
  relatedTrivia: number[];
}

export const STORY_STATS: { value: string; label: string }[] = [
  { value: "70.2%", label: "avg. cart abandonment" },
  { value: "39%", label: "leave over surprise fees" },
  { value: "19%", label: "leave over forced signup" },
  { value: "+35%", label: "possible conversion lift" },
];

export const STORY: StoryCard[] = [
  {
    key: "guest",
    guideline: "Guideline #652",
    title: "Make guest checkout the obvious choice",
    lede: "18–19% of shoppers abandon because they don't want an account — yet 62% of sites bury the guest option.",
    before: [
      { t: "steps", steps: [{ label: "Account", state: "now" }, { label: "Shipping" }, { label: "Payment" }, { label: "Review" }] },
      { t: "field", label: "Email", value: "you@email.com", state: "filled" },
      { t: "field", label: "Password", value: "••••••••", state: "filled" },
      { t: "button", label: "Sign in & continue", variant: "primary" },
      { t: "button", label: "Create an account", variant: "ghost" },
      { t: "note", text: "…checkout as guest? a tiny link, way down here." },
    ],
    after: [
      { t: "steps", steps: [{ label: "Account", state: "now" }, { label: "Shipping" }, { label: "Payment" }, { label: "Review" }] },
      { t: "button", label: "Continue as Guest", variant: "primary", badge: "Fastest" },
      { t: "note", text: "No password needed — create an account later if you want." },
      { t: "field", label: "Returning? Email", value: "you@email.com", state: "filled" },
      { t: "button", label: "Sign in", variant: "ghost" },
    ],
    whyBefore: "The guest path is a faint link below sign-in and register. Users scanning for “Guest” miss it, feel forced to register, and leave.",
    whyAfter: "Guest checkout sits at the top as a high-contrast button with reassuring microcopy. It matches the weight of sign-in so no one feels trapped.",
    refs: [
      { label: "#652 Guest Checkout Prominence", url: "https://baymard.com/guidelines/652-guest-checkout-prominence" },
      { label: "#637 Guest Checkout Options", url: "https://baymard.com/guidelines/637-guest-checkout-options" },
    ],
    relatedTrivia: [6],
  },
  {
    key: "cost",
    guideline: "Guideline #732 · #2384",
    title: "Show the full cost early — no surprises",
    lede: "39% of abandonment is caused by unexpected charges appearing late. The review step should only confirm known facts.",
    before: [
      { t: "steps", steps: [{ label: "Cart", state: "done" }, { label: "Shipping", state: "done" }, { label: "Payment", state: "done" }, { label: "Review", state: "now" }] },
      { t: "summary", items: [
        { label: "Subtotal", value: "$84.00" },
        { label: "Shipping (surprise!)", value: "+ $12.99", surprise: true },
        { label: "Tax (surprise!)", value: "+ $6.72", surprise: true },
      ], total: "$103.71" },
      { t: "msg", tone: "bad", text: "Wait — where did $19.71 come from?" },
      { t: "button", label: "Place order", variant: "pay" },
    ],
    after: [
      { t: "steps", steps: [{ label: "Cart", state: "now" }, { label: "Shipping" }, { label: "Payment" }, { label: "Review" }] },
      { t: "summary", items: [
        { label: "Subtotal", value: "$84.00" },
        { label: "Est. shipping", value: "$12.99" },
        { label: "Est. tax", value: "$6.72" },
      ], total: "$103.71" },
      { t: "msg", tone: "info", text: "All costs shown here in the cart — before you invest any effort." },
      { t: "button", label: "Continue to checkout", variant: "primary" },
    ],
    whyBefore: "Shipping and tax appear for the first time at review — users feel ambushed at the moment of highest commitment.",
    whyAfter: "Estimated shipping and tax are disclosed in the cart, so review just confirms a total the user already accepted.",
    refs: [
      { label: "#732 Essential Price Info for the Cart", url: "https://baymard.com/guidelines/732-essential-price-info-for-the-cart" },
      { label: "#2384 New Info at Review", url: "https://baymard.com/guidelines/2384-new-information-at-the-review-step" },
    ],
    relatedTrivia: [],
  },
  {
    key: "preserve",
    guideline: "Guideline #720 · #723",
    title: "Never clear the form after an error",
    lede: "Wiping fields after a validation error — especially card data — is one of the most damaging failures.",
    before: [
      { t: "msg", tone: "bad", text: "Something went wrong. Please try again." },
      { t: "field", label: "Card number", value: "•••• (cleared)", state: "cleared" },
      { t: "field", label: "Expiry", value: "MM/YY", state: "cleared" },
      { t: "field", label: "CVC", value: "•••", state: "cleared" },
      { t: "field", label: "Name on card", value: "(cleared)", state: "cleared" },
      { t: "button", label: "Pay again", variant: "pay" },
    ],
    after: [
      { t: "msg", tone: "good", text: "Almost there — just fix the highlighted field." },
      { t: "field", label: "Card number", value: "4242 4242 4242 4242", state: "filled" },
      { t: "field", label: "Expiry", value: "08 / 27", state: "filled" },
      { t: "field", label: "CVC", value: "1", state: "error" },
      { t: "field", label: "Name on card", value: "Manuel Palli", state: "filled" },
      { t: "button", label: "Pay $103.71", variant: "pay" },
    ],
    whyBefore: "A generic error plus a wiped form forces users to re-type everything, including a full card number. Most give up.",
    whyAfter: "Valid input is preserved; only the wrong field (CVC) is flagged. The user fixes one thing and keeps moving.",
    refs: [
      { label: "#720 Preserving User Input", url: "https://baymard.com/guidelines/720-preserving-user-input-when-errors-arise" },
      { label: "#723 Retaining Card Field Data", url: "https://baymard.com/guidelines/723-retaining-data-in-credit-card-fields" },
    ],
    relatedTrivia: [],
  },
  {
    key: "adaptive",
    guideline: "Guideline #722",
    title: "Adaptive error messages, not “Invalid input”",
    lede: "98% of sites use vague error text. Specific messages tell users exactly what's wrong and how to fix it.",
    before: [
      { t: "field", label: "Card number", value: "4242 4242 4242", state: "error" },
      { t: "msg", tone: "bad", text: "⚠ Invalid input." },
      { t: "field", label: "Email", value: "manuel.email.com", state: "error" },
      { t: "msg", tone: "bad", text: "⚠ Invalid input." },
      { t: "note", text: "…now guess what “invalid” means." },
    ],
    after: [
      { t: "field", label: "Card number", value: "4242 4242 4242", state: "error" },
      { t: "msg", tone: "bad", text: "⚠ Your card number is incomplete — it needs 16 digits." },
      { t: "field", label: "Email", value: "manuel.email.com", state: "error" },
      { t: "msg", tone: "bad", text: "⚠ Missing “@” in your email address." },
    ],
    whyBefore: "“Invalid input” makes users diagnose the problem themselves. They can't, so they abandon.",
    whyAfter: "Adaptive messages state the precise issue and the fix in plain language, so recovery is effortless.",
    refs: [
      { label: "#722 Adaptive Error Messages", url: "https://baymard.com/guidelines/722-using-adaptive-error-messages" },
      { label: "#719 Autoscroll / Error Summary", url: "https://baymard.com/guidelines/719-autoscrolling-users-to-the-field-with-errors-or-an-error-summary" },
    ],
    relatedTrivia: [],
  },
  {
    key: "lookup",
    guideline: "Guideline #2266 · #618",
    title: "Automatic address lookup",
    lede: "Address entry is a top friction point. Auto-lookup saves time, cuts errors, and users now expect it.",
    before: [
      { t: "field", label: "Address line 1", state: "empty" },
      { t: "field", label: "Address line 2", state: "empty" },
      { t: "field", label: "City", state: "empty" },
      { t: "field", label: "State", state: "empty" },
      { t: "field", label: "ZIP", state: "empty" },
      { t: "note", text: "Type all of it, manually. Good luck on mobile." },
    ],
    after: [
      { t: "field", label: "Start typing your address", value: "123 Elm", state: "filled" },
      { t: "suggest", items: [
        "123 Elm Street, Philadelphia, PA 19103",
        "123 Elm Court, Ardmore, PA 19003",
        "123 Elmwood Ave, Narberth, PA 19072",
      ] },
      { t: "msg", tone: "good", text: "One tap fills line 1, city, state & ZIP — even with a typo mid-entry." },
    ],
    whyBefore: "Five separate fields, all manual — high effort and high error rate, especially on a phone.",
    whyAfter: "A single field with live suggestions completes the whole address in one tap and tolerates typos.",
    refs: [
      { label: "#2266 Address Lookup Features", url: "https://baymard.com/guidelines/2266-address-lookup-features" },
      { label: "#618 Optimizing for Autofill", url: "https://baymard.com/guidelines/618-optimizing-checkout-steps-for-browser-autofill" },
    ],
    relatedTrivia: [],
  },
  {
    key: "keyboard",
    guideline: "Guideline #1100",
    title: "Trigger the right mobile keyboard",
    lede: "Numeric fields (ZIP, card, phone) should invoke a numeric keypad — bigger keys, fewer typos.",
    before: [
      { t: "field", label: "ZIP code", value: "19103", state: "filled" },
      { t: "keyboard", numeric: false },
      { t: "note", text: "Full QWERTY for a number? Now find the 123 key…" },
    ],
    after: [
      { t: "field", label: "ZIP code", value: "19103", state: "filled" },
      { t: "keyboard", numeric: true },
      { t: "note", text: "Big numeric keys — faster, far fewer typos." },
    ],
    whyBefore: "An alpha keyboard for a numeric field forces users to hunt for the number layout and increases mis-taps.",
    whyAfter: "The correct input type surfaces a numeric keypad automatically — a free mobile win.",
    refs: [
      { label: "#1100 Mobile Keyboard Layouts", url: "https://baymard.com/guidelines/1100-appropriate-mobile-keyboard-layouts" },
      { label: "#948 Disable Auto-Correct", url: "https://baymard.com/guidelines/948-where-to-disable-mobile-keyboard-auto-correct" },
    ],
    relatedTrivia: [],
  },
  {
    key: "progress",
    guideline: "Guideline #611 · #586",
    title: "A literal progress path + explicit buttons",
    lede: "Users must always know where they are and what happens next. Hidden steps and vague buttons cause hesitation.",
    before: [
      { t: "steps", steps: [{ label: "Checkout" }, { label: "…" }, { label: "Done?" }] },
      { t: "field", label: "Shipping", value: "123 Elm St, Philadelphia", state: "filled" },
      { t: "button", label: "Continue", variant: "primary" },
      { t: "note", text: "Continue to… what? Payment? Placing the order? Charging my card?" },
    ],
    after: [
      { t: "steps", steps: [{ label: "Account", state: "done" }, { label: "Shipping", state: "done" }, { label: "Payment", state: "now" }, { label: "Review" }] },
      { t: "field", label: "Shipping", value: "123 Elm St, Philadelphia", state: "filled" },
      { t: "button", label: "Continue to Payment →", variant: "primary" },
      { t: "note", text: "Clear step map + a button that names the next step." },
    ],
    whyBefore: "Grouped/vague steps break the linear mental model, and “Continue” hides whether the next click charges the card.",
    whyAfter: "A 1:1 progress bar plus descriptive labels removes uncertainty and hesitation before the final commit.",
    refs: [
      { label: "#611 Checkout & Process Steps", url: "https://baymard.com/guidelines/611-checkout-steps-and-corresponding-process-steps" },
      { label: "#586 Clarifying Button Functionality", url: "https://baymard.com/guidelines/586-clarifying-primary-button-functionality" },
    ],
    relatedTrivia: [1, 7],
  },
  {
    key: "fields",
    guideline: "Guideline #566 · #562 · #557",
    title: "Minimize visible form fields",
    lede: "The average checkout has 19.9 form elements; an optimized one can be ~12. Perceived effort matters as much as real effort.",
    before: [
      { t: "field", label: "First name", state: "empty" },
      { t: "field", label: "Last name", state: "empty" },
      { t: "field", label: "Address line 1", state: "empty" },
      { t: "field", label: "Address line 2", state: "empty" },
      { t: "field", label: "Billing — first name", state: "empty" },
      { t: "field", label: "Billing — last name", state: "empty" },
      { t: "field", label: "Billing address", state: "empty" },
      { t: "note", text: "A wall of fields = form fatigue." },
    ],
    after: [
      { t: "field", label: "Full name", value: "Manuel Palli", state: "filled" },
      { t: "field", label: "Address", value: "123 Elm St, Philadelphia, PA", state: "filled" },
      { t: "note", text: "+ Add apartment, suite, etc." },
      { t: "check", label: "Billing address same as shipping" },
      { t: "msg", tone: "good", text: "7 fields become 2 + a checkbox." },
    ],
    whyBefore: "Split names, an always-visible “Address Line 2”, and a duplicate billing block make the form look exhausting.",
    whyAfter: "One “Full Name” field, “Line 2” behind a link, and billing defaulted to shipping slash perceived and actual work.",
    refs: [
      { label: "#557 Customer Name Fields", url: "https://baymard.com/guidelines/557-customer-name-fields" },
      { label: "#562 Display Address Line 2", url: "https://baymard.com/guidelines/562-how-to-display-address-line-2" },
      { label: "#566 Shipping & Billing", url: "https://baymard.com/guidelines/566-shipping-address-and-billing-address" },
    ],
    relatedTrivia: [2, 3, 4, 5, 9],
  },
];
