"use strict";

/* ============================
   DOM ELEMENTS
   ============================ */
const amtPerson = document.getElementById("tip-amount");
const amtTotal = document.getElementById("total");
const billInput = document.querySelector(".form__input-bill");
const peopleInput = document.querySelector(".form__input-people");
const customTipInput = document.querySelector(".form__input--custom");
const billWarning = document.querySelector(".warning-bill");
const peopleWarning = document.querySelector(".warning-people");
const resetBtn = document.querySelector(".form__button");
const radios = document.querySelectorAll('input[name="tip"]');

/* ============================
   TIP CALCULATION LOGIC
   ============================ */

/* Returns the selected tip percentage.
   Custom tip has priority over radio buttons. */
const getTipPercent = () => {
  const custom = Number(customTipInput.value);
  if (custom > 0) return custom;

  const selected = document.querySelector('input[name="tip"]:checked');
  return selected ? Number(selected.value) : 0;
};

/* Updates the UI with the calculated values. */
const updateResults = (tipPerPerson, totalPerPerson) => {
  amtPerson.textContent = `$${tipPerPerson.toFixed(2)}`;
  amtTotal.textContent = `$${totalPerPerson.toFixed(2)}`;
};

/* Main calculation function.
   Validates inputs before performing any math. */
const calcTip = () => {
  if (!validateInputs()) return;

  const bill = Number(billInput.value);
  const people = Number(peopleInput.value);
  const percent = getTipPercent();

  const tip = (bill * percent) / 100;
  const tipPerPerson = tip / people;
  const totalPerPerson = (bill + tip) / people;

  updateResults(tipPerPerson, totalPerPerson);
};

/* ============================
   INPUT VALIDATION
   ============================ */

/* Displays an error message and highlights the input. */
const showError = (input, warning, message) => {
  input.classList.add("input--error");
  warning.textContent = message;
  warning.style.display = "block";
};

/* Removes error styles and hides the warning message. */
const hideError = (input, warning) => {
  input.classList.remove("input--error");
  warning.style.display = "none";
};

/* Validates bill and people inputs.
   Returns true only if both fields contain valid values. */
const validateInputs = () => {
  const bill = Number(billInput.value);
  const people = Number(peopleInput.value);
  let valid = true;

  if (!bill || bill <= 0) {
    showError(billInput, billWarning, bill === 0 ? "Can't be 0" : "Can't be empty");
    valid = false;
  } else {
    hideError(billInput, billWarning);
  }

  if (!people || people <= 0) {
    showError(peopleInput, peopleWarning, people === 0 ? "Can't be 0" : "Can't be empty");
    valid = false;
  } else {
    hideError(peopleInput, peopleWarning);
  }

  if (!valid) updateResults(0, 0);
  return valid;
};

/* Adds focus/blur behavior to inputs.
   Hides errors on focus and revalidates on blur. */
const handleFocusBlur = (input, warning) => {
  input.addEventListener("focus", () => hideError(input, warning));
  input.addEventListener("blur", () => {
    if (!input.value) showError(input, warning, "Can't be empty");
    else validateInputs();
  });
};

/* ============================
   EVENT HANDLERS
   ============================ */

/* Clears all radio selections. */
const resetRadios = () => radios.forEach(r => (r.checked = false));

/* Recalculate when bill or people inputs change. */
billInput.addEventListener("input", calcTip);
peopleInput.addEventListener("input", calcTip);

/* When focusing on custom tip, clear radio buttons. */
customTipInput.addEventListener("focus", () => {
  resetRadios();
  customTipInput.value = "";
});
customTipInput.addEventListener("input", calcTip);

/* When selecting a radio tip, clear custom input. */
radios.forEach(radio =>
  radio.addEventListener("change", () => {
    customTipInput.value = "";
    calcTip();
  })
);

/* Attach focus/blur validation behavior. */
handleFocusBlur(billInput, billWarning);
handleFocusBlur(peopleInput, peopleWarning);

/* Reset button: clears all values and UI states. */
resetBtn.addEventListener("click", () => {
  updateResults(0, 0);
  hideError(billInput, billWarning);
  hideError(peopleInput, peopleWarning);
  customTipInput.value = "";
  resetRadios();
});

