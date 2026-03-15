"use strict";

// === ELEMENTI DOM ===
const amtPerson = document.getElementById("tip-amount");
const amtTotal = document.getElementById("total");
const billInput = document.querySelector(".form__input-bill");
const peopleInput = document.querySelector(".form__input-people");
const customTipInput = document.querySelector(".form__input--custom");
const billWarning = document.querySelector(".warning-bill");
const peopleWarning = document.querySelector(".warning-people");
const resetBtn = document.querySelector(".form__button");
const radios = document.querySelectorAll('input[name="tip"]');

// === FUNZIONI DI CALCOLO ===
const getTipPercent = () => {
  const custom = Number(customTipInput.value);
  if (custom > 0) return custom;

  const selected = document.querySelector('input[name="tip"]:checked');
  return selected ? Number(selected.value) : 0;
};

const updateResults = (tipPerPerson, totalPerPerson) => {
  amtPerson.textContent = `$${tipPerPerson.toFixed(2)}`;
  amtTotal.textContent = `$${totalPerPerson.toFixed(2)}`;
};

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

// === VALIDAZIONE ===
const showError = (input, warning, message) => {
  input.classList.add("input--error");
  warning.textContent = message;
  warning.style.display = "block";
};

const hideError = (input, warning) => {
  input.classList.remove("input--error");
  warning.style.display = "none";
};

const validateInputs = () => {
  const bill = Number(billInput.value);
  const people = Number(peopleInput.value);
  let valid = true;

  if (!bill || bill <= 0) {
    showError(billInput, billWarning, bill === 0 ? "Can't be 0" : "Can't be empty");
    valid = false;
  } else hideError(billInput, billWarning);

  if (!people || people <= 0) {
    showError(peopleInput, peopleWarning, people === 0 ? "Can't be 0" : "Can't be empty");
    valid = false;
  } else hideError(peopleInput, peopleWarning);

  if (!valid) updateResults(0, 0);
  return valid;
};

// === GESTIONE EVENTI ===
const resetRadios = () => radios.forEach(r => (r.checked = false));

const handleFocusBlur = (input, warning) => {
  input.addEventListener("focus", () => hideError(input, warning));
  input.addEventListener("blur", () => {
    if (!input.value) showError(input, warning, "Can't be empty");
    else validateInputs();
  });
};

billInput.addEventListener("input", calcTip);
peopleInput.addEventListener("input", calcTip);

customTipInput.addEventListener("focus", () => {
  resetRadios();
  customTipInput.value = "";
});
customTipInput.addEventListener("input", calcTip);

radios.forEach(radio =>
  radio.addEventListener("change", () => {
    customTipInput.value = "";
    calcTip();
  })
);

handleFocusBlur(billInput, billWarning);
handleFocusBlur(peopleInput, peopleWarning);

resetBtn.addEventListener("click", () => {
  updateResults(0, 0);
  hideError(billInput, billWarning);
  hideError(peopleInput, peopleWarning);
  customTipInput.value = "";
  resetRadios();
});
