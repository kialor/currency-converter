const baseCurrency = document.querySelector("#base-currency");
const amountValue = document.querySelector("#amount");
const targetCurrency = document.querySelector("#target-currency");
const convertedAmount = document.querySelector("#converted-amount");
const historicalButton = document.querySelector("#historical-rates");
const historicalResults = document.querySelector("#historical-rates-container");
const saveFavButton = document.querySelector("#save-favorite");
const favPairs = document.querySelector("#favorite-currency-pairs");

let myHeaders = new Headers();
myHeaders.append("apiKey", "hfDr4hTfzPaTWE8nqaFazBCYbUVC0zXO");

let requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

//FETCH TO GET LIST OF CURRENCY ABBREVIATIONS

fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
  .then((response) => response.json())
  .then((data) => {
    const baseCurrencyList = document.querySelector("#base-currency");
    const targetCurrencyList = document.querySelector("#target-currency");
    for (let symbol in data.symbols) {
      const option = document.createElement("option");
      option.value = symbol;
      option.text = symbol;
      baseCurrencyList.appendChild(option);
      const targetOption = option.cloneNode(true);
      targetCurrencyList.appendChild(targetOption);
    }
  })
  .catch((error) => console.log("error", error));

//FETCH TO COVERT

function convert() {
  const from = baseCurrency.value;
  const to = targetCurrency.value;
  const amount = amountValue.value;

  fetch(
    `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      const result = data.result;
      convertedAmount.textContent = `${result.toFixed(2)} ${
        targetCurrency.value
      }`;
      console.log(result);
    })
    .catch((error) => {
      console.log("error", error);
      alert("Error: Amount must be a number value greater than zero.");
    });
}

[baseCurrency, amountValue, targetCurrency].forEach((input) => {
  input.addEventListener("change", convert);
});

amountValue.addEventListener('input', () => {
  const amount = amountValue.value;
  if (isNaN(amount) || amount < 0) {
    amountValue.value = '';
  }
});

//HISTORICAL EXCHANGE RATES

historicalButton.addEventListener("click", () => {
  const baseCurrency = document.querySelector("#base-currency").value;
  const targetCurrency = document.querySelector("#target-currency").value;
  const date = "2023-05-05";

  fetch(
    `https://api.apilayer.com/exchangerates_data/${date}?symbols=${targetCurrency}&base=${baseCurrency}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      let rates = data.rates;
      let rate = 0;
      for (let currency in rates) {
        if (currency === targetCurrency) {
          rate = rates[currency].toFixed(2);
          break;
        }
      }
      historicalResults.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
    })
    .catch((error) => console.log("error", error));
});

//SAVING FAVORITES

saveFavButton.addEventListener("click", () => {
  const selectedPair = `${baseCurrency.value}/${targetCurrency.value}`;
  const savedPairs = JSON.parse(localStorage.getItem("savedPairs"));
  savedPairs.push(selectedPair);
  localStorage.setItem("savedPairs", JSON.stringify(savedPairs));

  const favOption = document.createElement("option");
  favOption.value = selectedPair;
  favOption.text = selectedPair;
  favPairs.appendChild(favOption);
});

favPairs.addEventListener("change", () => {
  const selectedPair = favPairs.value;
  const currencies = selectedPair.split("/");
  baseCurrency.value = currencies[0];
  targetCurrency.value = currencies[1];
  convert();
});
