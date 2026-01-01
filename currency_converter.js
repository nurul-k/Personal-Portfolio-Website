

const API_KEY = "f0bdbe2bfcb90795b630b9a1";


const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
for (currCode in countryList) {
  let newOption = document.createElement("option");
  newOption.innerText = currCode;
  newOption.value = currCode;
  if (select.name === "from" && currCode === "USD") {
    newOption.selected = "selected";
  } else if (select.name === "to" && currCode === "INR") {
    newOption.selected = "selected";
  }
  select.append(newOption);
}

select.addEventListener("change", (evt) => {
  updateFlag(evt.target);
});
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  // Validate amount
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Build ExchangeRate-API URL (pair endpoint)
  const URL = `${BASE_URL}/pair/${fromCurr.value}/${toCurr.value}`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    // Check if API call was successful
    if (data.result !== "success") {
      msg.innerText = "API error: " + (data["error-type"] || "Unknown error");
      return;
    }

    // ExchangeRate-API returns the rate as "conversion_rate"
    let rate = data.conversion_rate;

    // Calculate final amount
    let finalAmount = (amtVal * rate).toFixed(2);  // round to 2 decimal places
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "Network error, please try again.";
  }
};

const updateFlag = (element) => {
let currCode = element.value;
let countryCode = countryList[currCode];
let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
let img = element.parentElement.querySelector("img");
img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
evt.preventDefault();
updateExchangeRate();
});

window.addEventListener("load", () => {
updateExchangeRate();
});


/*
const BASE_URL =
"https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
for (currCode in countryList) {
  let newOption = document.createElement("option");
  newOption.innerText = currCode;
  newOption.value = currCode;
  if (select.name === "from" && currCode === "USD") {
    newOption.selected = "selected";
  } else if (select.name === "to" && currCode === "INR") {
    newOption.selected = "selected";
  }
  select.append(newOption);
}

select.addEventListener("change", (evt) => {
  updateFlag(evt.target);
});
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc =`https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", async (evt) =>{
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }
});

const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
let response = await fetch(URL);
let data = await response.json();
let rate = data[toCurr.value.toLowerCase()];

let finalAmount = amtVal * rate;
msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
*/
/*const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
    }
}*/