const prizePerCar = 21200;
const storageKey = "539CalculatorData_v2";
const dayNames = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];

const daysBox = document.getElementById("days");

dayNames.forEach((day, index) => {
  daysBox.innerHTML += `
    <div class="card">
     <h2 class="dayTitle">
    <span>${day}</span>
    ${index > 0 ? `<button class="copyBtn" onclick="copyYesterday(${index})">📋</button>` : ""}
</h2>

      <label>號碼</label>
      <input id="numbers${index}" type="text" placeholder="132333" />

      <label>單顆車數</label>
      <input id="carCount${index}" type="number" placeholder="1" />

      <div class="result">本日牌隻金額：<span id="todayAmount${index}">$0</span></div>
      <div class="result">目前牌隻合計：<span id="totalAmount${index}">$0</span></div>
      <div class="result">淨利合計：<span id="profitAmount${index}">$0</span></div>
    </div>
  `;
});

function formatNumbers(value) {
  const onlyNumbers = value.replace(/\D/g, "");
  const groups = onlyNumbers.match(/.{1,2}/g);
  return groups ? groups.join("/") : "";
}

function getNumberCount(formattedNumbers) {
  if (!formattedNumbers) return 0;
  return formattedNumbers.split("/").filter(x => x.length === 2).length;
}

function money(num) {
  const rounded = Math.round(num);

  if (rounded < 0) {
    return "-$" + Math.abs(rounded).toLocaleString();
  }

  return "$" + rounded.toLocaleString();
}

function setMoneyText(id, value) {
  const el = document.getElementById(id);
  el.textContent = money(value);

  if (value < 0) {
    el.classList.add("negative");
  } else {
    el.classList.remove("negative");
  }
}

function calculate() {
  const carPrice = Number(document.getElementById("carPrice").value) || 0;
  let runningTotal = 0;

  for (let i = 0; i < dayNames.length; i++) {
    const numbersInput = document.getElementById(`numbers${i}`);
    const carCountInput = document.getElementById(`carCount${i}`);

    const formatted = formatNumbers(numbersInput.value);
    numbersInput.value = formatted;

    const carCount = Number(carCountInput.value) || 0;
    const numberCount = getNumberCount(formatted);

    const todayAmount = numberCount * carCount * carPrice;
    runningTotal += todayAmount;

    const prizeAmount = prizePerCar * carCount;
    const profitAmount = prizeAmount - runningTotal;

    setMoneyText(`todayAmount${i}`, todayAmount);
    setMoneyText(`totalAmount${i}`, runningTotal);
    setMoneyText(`profitAmount${i}`, profitAmount);
  }
}

function saveData() {
  const data = {
    carPrice: document.getElementById("carPrice").value,
    days: []
  };

  for (let i = 0; i < dayNames.length; i++) {
    data.days.push({
      numbers: document.getElementById(`numbers${i}`).value,
      carCount: document.getElementById(`carCount${i}`).value
    });
  }

  localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadData() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    calculate();
    return;
  }

  const data = JSON.parse(saved);

  document.getElementById("carPrice").value = data.carPrice || 2800;

  data.days.forEach((day, i) => {
    document.getElementById(`numbers${i}`).value = day.numbers || "";
    document.getElementById(`carCount${i}`).value = day.carCount || "";
  });

  calculate();
}

function clearAll() {
  document.getElementById("carPrice").value = 2800;

  for (let i = 0; i < dayNames.length; i++) {
    document.getElementById(`numbers${i}`).value = "";
    document.getElementById(`carCount${i}`).value = "";
  }

  localStorage.removeItem(storageKey);
  calculate();
}
function copyYesterday(index) {

    const yesterday = document.getElementById(`numbers${index - 1}`).value;

    if (!yesterday) return;

    document.getElementById(`numbers${index}`).value = yesterday;

    calculate();
    saveData();

}
function handleInput() {
  calculate();
  saveData();
}

document.getElementById("carPrice").addEventListener("input", handleInput);

for (let i = 0; i < dayNames.length; i++) {
  document.getElementById(`numbers${i}`).addEventListener("input", handleInput);
  document.getElementById(`carCount${i}`).addEventListener("input", handleInput);
}

loadData();