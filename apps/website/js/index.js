const bankInfoForm = document.querySelector("#bank-info-form");

const paymentSection = document.querySelector("#payment");
const introSection = document.querySelector("#intro");

const bankListInput = document.querySelector("#bank-list");
const accountNumberInput = document.querySelector("#account-number");
const proceedToPayButton = document.querySelector("#proceed-to-pay");

const accountNumberInputMessage = accountNumberInput.nextElementSibling;

const lottieConfetti = document.querySelector("dotlottie-player#confetti");

const remainingSlotSpan = document.querySelector("#remaining-slots");
const noMoreSlotBanner = document.querySelector("#banner");

let userAccountName;

const clearAccountNumberInput = () => {
  accountNumberInput.value = "";
  accountNumberInputMessage.innerHTML = "";
};

window.addEventListener("load", async () => {
  loadMonthAndYear();
  const { remaining_slots = "", has_slots } = await api.get("/donation_info");
  remainingSlotSpan.innerHTML =
    remaining_slots < 10 ? `0${remaining_slots}` : remaining_slots;
  if (!has_slots) {
    await disableAllFields();
    remainingSlotSpan.innerHTML = 10;
    noMoreSlotBanner.style.display = "block";
  }
});

const disableAllFields = async () => {
  const allFormFields = bankInfoForm.querySelectorAll("input, select");

  allFormFields.forEach((formField) => {
    formField.setAttribute("disabled", "disabled");
  });
};

const loadMonthAndYear = () => {
  const monthAndYearParagraph = document.querySelector("#month-and-year");
  const today = new Date();
  const monthAndYear = today.toLocaleString("en", {
    month: "long",
    year: "numeric",
  });

  monthAndYearParagraph.innerText = monthAndYear;
};
bankListInput.addEventListener("change", (e) => {
  const selectedBank = e.target.value;

  if (!selectedBank) {
    accountNumberInput.setAttribute("disabled", "disabled");
  } else {
    if (!!accountNumberInput.value) {
      clearAccountNumberInput();
    }
    accountNumberInput.removeAttribute("disabled");
    accountNumberInput.setAttribute("placeholder", "9010761375");
    accountNumberInput.focus();
  }
});

const ACCOUNT_NUMBER_LENGTH = 10;
accountNumberInput.addEventListener("keyup", async (e) => {
  const accountNumber = e.target.value;

  const lengthOfAccountNumber = accountNumber.length;

  if (lengthOfAccountNumber === ACCOUNT_NUMBER_LENGTH) {
    accountNumberInputMessage.innerHTML = `<span id="hourglass">⏳</span> Fetching Account Details`;
    await verifyAccountDetails(accountNumber, bankListInput.value);
  }
});

const verifyAccountDetails = async (account_number, bank_code) => {
  if (!account_number || !bank_code) {
    console.error(
      "[verifyAccountDetails], possible missing values: account_number, bank_code"
    );
    return;
  }

  const { account_name = "" } = await api.get("/validate_account_number", {
    account_number,
    bank_code,
  });

  if (!account_name) {
    accountNumberInputMessage.innerHTML = `<span>❌</span> Account not found. Kindly check account number`;
    return;
  }
  userAccountName = account_name;
  accountNumberInputMessage.innerHTML = `<span>✅</span> Account Name: ${account_name}`;
  proceedToPayButton.removeAttribute("disabled");
};

const isObjectEmpty = (object = {}) => {
  Object.keys(object).length == 0;
};

bankInfoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  proceedToPayButton.innerHTML = `<span id="hourglass">⏳</span> Processing`;
  proceedToPayButton.setAttribute("disabled", "disabled");
  const { status } = await api.post("/pay", {
    account_number: accountNumberInput.value,
    bank_code: bankListInput.value,
    name: userAccountName,
  });

  if (status === 200) {
    lottieConfetti.style.opacity = 1;
    e.target.reset();
    accountNumberInputMessage.innerHTML = "";
    proceedToPayButton.innerHTML = `<span>🥳</span> Payment Successful`;
    setTimeout(() => {
      lottieConfetti.style.opacity = 0;
      proceedToPayButton.innerHTML = `Proceed`;
      proceedToPayButton.removeAttribute("disabled");
    }, 5_000);
  } else {
    proceedToPayButton.innerHTML = `<span>😔</span> Payment Failed. Try again`;
    setTimeout(() => {
      proceedToPayButton.innerHTML = `Proceed`;
      proceedToPayButton.removeAttribute("disabled");
    }, 3_000);
  }
});

const hideElement = (element) => {
  if (!element) {
    throw new Error("Kindly set an element to hide");
  }
  const hasVisibility = element.getAttribute("data-visible");
  if (!hasVisibility) {
    console.error("element does not have the [data-visible] attribute");
  }
  element.setAttribute("data-visible", "false");
};
const showElement = (element) => {
  if (!element) {
    throw new Error("Kindly set an element to hide");
  }

  element.setAttribute("data-visible", "true");
};
