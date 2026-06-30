const display = document.getElementById("display");

let firstNumber = "";
let secondNumber = "";
let operator = "";

function appendValue(value) {
  if (
    value === "+" ||
    value === "-" ||
    value === "*" ||
    value === "/" ||
    value === "%"
  ) {
    operator = value;

    display.value += value;
  } else {
    display.value += value;
  }
}

function clearDisplay() {
  display.value = "";

  firstNumber = "";

  secondNumber = "";

  operator = "";
}

function calculate() {
  const expression = display.value;

  let result = 0;

  if (expression.includes("+")) {
    const parts = expression.split("+");

    result = Number(parts[0]) + Number(parts[1]);
  } else if (expression.includes("-")) {
    const parts = expression.split("-");

    result = Number(parts[0]) - Number(parts[1]);
  } else if (expression.includes("*")) {
    const parts = expression.split("*");

    result = Number(parts[0]) * Number(parts[1]);
  } else if (expression.includes("/")) {
    const parts = expression.split("/");

    result = Number(parts[0]) / Number(parts[1]);
  } else if (expression.includes("%")) {
    const parts = expression.split("%");

    result = Number(parts[0]) % Number(parts[1]);
  }

  display.value = result;
}
