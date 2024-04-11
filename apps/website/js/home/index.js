import { ACCOUNT_NUMBER_LENGTH, STORAGE_KEYS } from "../constants";
import {
  accountNumberInput,
  accountNumberInputMessage,
  bankInfoForm,
  bankListInput,
  noMoreSlotBanner,
  proceedToPayButton,
  remainingSlotSpan,
} from "./ui";
import { makePayment, verifyAccountDetails } from "./api";
import { clearAccountNumberInput, disablePaymentFormFields } from "./utils";
import { currentMonthAndYear, getFromLocalStroage } from "../utils";
import { api } from "../api";

window.addEventListener("load", async () => {
  const currentMonth = await getFromLocalStroage(STORAGE_KEYS.CURRENT_MONTH);

  if (currentMonth === currentMonthAndYear()) {
    await disablePaymentFormFields();
    noMoreSlotBanner.style.display = "block";
  }

  const { remaining_slots = "", has_slots } = await api.get("/donation_info");
  remainingSlotSpan.innerHTML =
    remaining_slots < 10 ? `0${remaining_slots}` : remaining_slots;
  if (!has_slots) {
    await disablePaymentFormFields();
    remainingSlotSpan.innerHTML = 10;
    noMoreSlotBanner.style.display = "block";
  }
});

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

accountNumberInput.addEventListener("keyup", async (e) => {
  const accountNumber = e.target.value;

  const lengthOfAccountNumber = accountNumber.length;

  if (lengthOfAccountNumber === ACCOUNT_NUMBER_LENGTH) {
    accountNumberInputMessage.innerHTML = `<span id="hourglass">⏳</span> Fetching Account Details`;
    await verifyAccountDetails(accountNumber, bankListInput.value);
  }
});

bankInfoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  proceedToPayButton.innerHTML = `<span id="hourglass">⏳</span> Processing`;
  proceedToPayButton.setAttribute("disabled", "disabled");

  await makePayment(e);
});
