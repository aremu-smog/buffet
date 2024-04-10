import { api } from "../api";
import { STORAGE_KEYS } from "../constants";
import {
  accountNumberInput,
  accountNumberInputMessage,
  bankListInput,
  emailInput,
  lottieConfetti,
  noMoreSlotBanner,
  proceedToPayButton,
} from "../ui";
import { addToLocalStorage, currentMonthAndYear } from "../utils";
import { disablePaymentFormFields } from "./utils";

export const verifyAccountDetails = async (account_number, bank_code) => {
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

  accountNumberInputMessage.innerHTML = `<span>✅</span> Account Name: ${account_name}`;
  proceedToPayButton.removeAttribute("disabled");
  emailInput.focus();
};

export const makePayment = async (e) => {
  const { status } = await api.post("/pay", {
    account_number: accountNumberInput.value,
    bank_code: bankListInput.value.trim(),
    email: emailInput.value.trim(),
  });

  if (status === 200 || status == 419) {
    lottieConfetti.style.opacity = 1;
    e.target.reset();
    disablePaymentFormFields();
    accountNumberInputMessage.innerHTML = "";
    proceedToPayButton.innerHTML = `<span>🥳</span> Payment Successful`;

    await addToLocalStorage(STORAGE_KEYS.CURRENT_MONTH, currentMonthAndYear());
    setTimeout(() => {
      lottieConfetti.style.opacity = 0;
      proceedToPayButton.innerHTML = `Proceed`;
      noMoreSlotBanner.style.display = "block";
    }, 5_000);
  } else {
    proceedToPayButton.innerHTML = `<span>😔</span> Payment Failed. Try again`;
    setTimeout(() => {
      proceedToPayButton.innerHTML = `Proceed`;
      proceedToPayButton.removeAttribute("disabled");
    }, 3_000);
  }
};
