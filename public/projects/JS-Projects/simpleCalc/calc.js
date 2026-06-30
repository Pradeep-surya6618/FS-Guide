 function add() {
      let a = Number(document.getElementById("num1").value);
      let b = Number(document.getElementById("num2").value);

      document.getElementById("result").innerText =
        "Result: " + (a + b);
    }

    function subtract() {
      let a = Number(document.getElementById("num1").value);
      let b = Number(document.getElementById("num2").value);

      document.getElementById("result").innerText =
        "Result: " + (a - b);
    }

    function multiply() {
      let a = Number(document.getElementById("num1").value);
      let b = Number(document.getElementById("num2").value);

      document.getElementById("result").innerText =
        "Result: " + (a * b);
    }

    function divide() {
      let a = Number(document.getElementById("num1").value);
      let b = Number(document.getElementById("num2").value);

      document.getElementById("result").innerText =
        "Result: " + (a / b);
    }