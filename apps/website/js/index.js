const consentForm = document.querySelector("#consent-form");
const bankInfoForm = document.querySelector("#bank-info-form");

const paymentSection = document.querySelector("#payment");
const introSection = document.querySelector("#intro");

consentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  hideElement(introSection);
  showElement(paymentSection);
});

bankInfoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  hideElement(paymentSection);
  showElement(introSection);
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
