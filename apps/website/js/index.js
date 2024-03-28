const consentForm = document.querySelector("#consent-form");
const bankInfoForm = document.querySelector("#bank-info-form");

const paymentSection = document.querySelector("#payment");
const introSection = document.querySelector("#intro");

const bankListInput = document.querySelector("#bank-list");
const accountNumberInput = document.querySelector("#account-number");

const userAccountNameSpan = document.querySelector("#user-account-name");

window.addEventListener("load", async () => {
  const bank_list = await api.get("/list_banks");
  await setBankOptions(bank_list);
});

bankListInput.addEventListener("change", (e) => {
  const selectedBank = e.target.value;

  console.log({ selectedBank });

  if (!selectedBank) {
    accountNumberInput.setAttribute("disabled", "disabled");
  } else {
    accountNumberInput.removeAttribute("disabled");
    accountNumberInput.focus();
  }
});

const ACCOUNT_NUMBER_LENGTH = 10;
accountNumberInput.addEventListener("keyup", async (e) => {
  const accountNumber = e.target.value;

  const lengthOfAccountNumber = accountNumber.length;

  if (lengthOfAccountNumber === ACCOUNT_NUMBER_LENGTH) {
    await verifyAccountDetails(accountNumber, bankListInput.value);
  }
});

const setBankOptions = async (bank_list) => {
  const noBankList = isObjectEmpty(bank_list);

  if (noBankList) {
    alert("Unable to fetch bank list, please refresh and trya gain");
    return;
  }

  bank_list.forEach((bank) => {
    const bankOption = document.createElement("option");
    bankOption.innerText = bank.name;
    bankOption.setAttribute("value", bank.code);

    bankListInput.appendChild(bankOption);
  });
};

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
    alert("No account detais, kindly check your account number and bank");
    return;
  }
  userAccountNameSpan.innerText = account_name;
};

const isObjectEmpty = (object = {}) => {
  Object.keys(object).length == 0;
};
consentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  hideElement(introSection);
  showElement(paymentSection);
});

bankInfoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const { status } = await api.post("/pay", {
    account_number: accountNumberInput.value,
    bank_code: bankListInput.value,
    name: userAccountNameSpan.innerText,
  });

  if (status === 200) {
    alert("Transfer successful, kindly check your account");
    e.target.reset();
    hideElement(paymentSection);
    showElement(introSection);
  } else {
    alert("Something went wrong, please try again");
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
