import { hidePreloader, loadMonthAndYear, loadNavigation } from "./utils";

window.addEventListener("load", async () => {
  loadMonthAndYear();
  loadNavigation();
  hidePreloader();
});
