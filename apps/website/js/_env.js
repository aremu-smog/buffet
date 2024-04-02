const DEV_ENV = {
  API_URL: "http://127.0.0.1:3000",
};

const PROD_ENV = {
  API_URL: "https://santa-smog.api.onrender.com",
};

const hasSameKeys =
  Object.keys(DEV_ENV).sort().join(" ") ===
  Object.keys(PROD_ENV).sort().join(" ");

if (!hasSameKeys) {
  throw new Error("[DEV_ENV] must have the same shape as [PROD_ENV]");
}
const PROD_URL = "https://buffet.aremusmog.com";

const current_location = document.location;
const site_origin = current_location.origin;
const is_prod = site_origin === PROD_URL;
const ENV = is_prod ? PROD_ENV : DEV_ENV;
