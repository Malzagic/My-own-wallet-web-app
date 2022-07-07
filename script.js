const addTransaction = document.querySelector('.add-transaction');
const removeTransaction = document.querySelector('.remove-transaction');
const cancelBtn = document.querySelector('.cancel');
const cancelDateBtn = document.querySelector('.cancel.date')
const saveBtn = document.querySelector('.save');
const saveDateBtn = document.querySelector('.save.date')
const closeBtn = document.querySelector('li');
const income = document.querySelector('.income');
const expenses = document.querySelector('.expenses');
const popUp = document.querySelector('.popup-body');
const popUpDate = document.querySelector('.popup-body-date');
const dateInput = document.querySelector('input[name=date]');
const nameInput = document.querySelector('input[name=name]');
const sumInput = document.querySelector('input[name=sum]');
const selectedCategory = document.querySelector('#select');
const daysLeft = document.querySelector('.days-left');
const today = document.querySelector('.today');
const changeDateBtn = document.querySelector('.change-date');

// Get date for calculate it
const date = new Date();
const currentYear = date.getFullYear();
const currentMonth = date.getMonth()+1;
const currentDay = date.getDate();
const currentHours = date.getHours();
const currentMinutes = date.getMinutes();

// Changing variables
let daysLeftInCurrentMonth;
let daysInCurrentMonth;
let diffrenceInDays;
let dataChecked = 0;
let changeDateClicked = 0;
let dateChoosen = 0;
let getPaycheckDays;

// Your budget avaible on start
let avaibleFunds = document.querySelector('.avaible');
let startFunds = 0;
avaibleFunds.innerHTML = `<span>${Number(startFunds)}</span> zł`;

// Your budget per days on start
let perDays = document.querySelector('.days');
let days = 0;
perDays.textContent = `${Number(days)} zł`;

// Your budget per month on start
let perMonth = document.querySelector('.monthly');
let month = 0;
perMonth.textContent = `${Number(month)} zł`;


// Open popup panel
const openPopUp = () => {
  closePopUpDate();
  // set display flex to first pop-up
  popUp.style.display = 'flex';
  // add animation
  popUp.classList.add('showpopup-animation');
}

const openPopUpDate = () => {
  // set display flex for second pop-up, named: date
  popUpDate.style.display = 'flex';
  // add animation
  popUpDate.classList.add('showpopup-animation');
}

// Close popup panel
const closePopUp = () => {
  // set display none
  popUp.style.display = 'none';
  // remove animation
  popUp.classList.remove('showpopup-animation');
  // clear all inputs if u cancel
  nameInput.value = '';
  sumInput.value = '';
  selectedCategory.selectedIndex = '0';
}

const closePopUpDate = () => {
  // set display none
  popUpDate.style.display = 'none';
  // remove animation
  popUpDate.classList.remove('showpopup-animation');
  // clear calendar
  dateInput.value = '';
}


// Checking values of inputs
const checkInput = e => {
  // checking input values & select value
  if(nameInput.value === '' || sumInput.value === '' || selectedCategory.value === '0'){
    // add class if input is incorrect
    nameInput.classList.add('error');
    if(nameInput.value !== ''){
      nameInput.classList.remove('error');
    }
    sumInput.classList.add('error');
    if(sumInput.value !== ''){
      sumInput.classList.remove('error');
    }
    selectedCategory.classList.add('error');
    if(selectedCategory.value !== '0'){
      selectedCategory.classList.remove('error');
    }
  } else {
    // clear class if input is correct
    nameInput.classList.remove('error');
    sumInput.classList.remove('error');
    selectedCategory.classList.remove('error');
    addElementEngine();
    closePopUp();
  }
  e.preventDefault();
}

// Create element for each one transaction
const addElementEngine = () => {
  // if is positive value and income category
  if(selectedCategory.value === 'income' && Number(sumInput.value) > 0){
    // create new ul element
    const newUl = document.createElement('ul');
    // add class to new ul element
    newUl.classList.add('list-item');
    // append new ul element to HTML
    income.appendChild(newUl);
    // create new li element
    const newLi = document.createElement('li');
    // add new text, icon to HTML
    newLi.innerHTML = `<span><i class="fas fa-money-bill-wave"></i> ${nameInput.value}: ${sumInput.value} <i class="fas fa-times-circle"></i></span>`;
    // add class to new element li
    newLi.classList.add('item');
    // append new li element to ul in HTML
    newUl.appendChild(newLi);
    // open funds engine to calc and add new funds to avaible funds
    fundsEngine(Number(sumInput.value));

  // else if negative value and expenses category
  } else {
    // checking if someone put a number greater then zero into a expenses and if is true add a number less then
    let newSumNumber;
    if(Number(sumInput.value) > 0){
      newSumNumber = Number(sumInput.value) * - 1;
    } else {
      newSumNumber = Number(sumInput.value);
    }
    // create ul element to HTML
    const newUl = document.createElement('ul');
    // add class to new element ul
    newUl.classList.add('list-item')
    // append new ul element to HTML
    expenses.appendChild(newUl);
    // create new li element to HTML
    const newLi = document.createElement('li');
    // add new text, icon to HTML
    newLi.innerHTML = `<span><i class="fas fa-hand-holding-usd"></i> ${nameInput.value}: ${newSumNumber} <i class="fas fa-times-circle"></i></span>`;
    // add class to new li element
    newLi.classList.add('item');
    // append new li element to ul in HTML
    newUl.appendChild(newLi);
    // open funds engine to calc and add new funds to avaible funds
    fundsEngine(newSumNumber);
  }

}

// Set here new date for calc your income and expenses
const setNewDate = () => {
  dateChoosen = new Date(dateInput.value)
  today.classList.add('answear');
  today.textContent = dateChoosen.toLocaleDateString();

  if(dateChoosen == 'Invalid Date') {
    dateInput.classList.add('error');
    changeDateClicked = 0;
  } else if(changeDateClicked === 1){
    dateChoosen = new Date(dateInput.value);
    let calcNewDays = calcDays()
    closePopUpDate();
    changeDateClicked = 0;
  } else {
    openPopUp();
    dataChecked++;
  }
  getPaycheckDays = getDaysLeftPaycheck(dateChoosen, date)
  daysLeft.classList.add('answear');
  daysLeft.textContent = `${getPaycheckDays}`;
}


// Function to get days in month and days left to the end of the month
const getDaysInMonth = (year, month, day) => {
  return new Date(year, month, day);
}
// Function calc days left to your paycheck
const getDaysLeftPaycheck = (dateChoosen, date) => {
  let diffrenceInTime = dateChoosen.getTime() - date.getTime();
  return diffrenceInDays = Math.round(diffrenceInTime / (1000 * 3600 * 24));
}

// Engine to adding new funds for daily and monthly budget and for avaible funds
const fundsEngine = (newSum) => {

  // calc new availbe funds
  Math.floor(startFunds += newSum);

  if(startFunds < 0){
    startFunds = 0;

    avaibleFunds.innerHTML = `<span>${startFunds.toFixed(0)}</span> zł`;
  }

  avaibleFunds.innerHTML = `<span>${startFunds.toFixed(2)}</span> zł`;

  fundsPerDayEngine(newSum);

  if(startFunds === 0) {
    alert('Brak przychodów!');
    removeAllEngine();
  } else {
    perDays.textContent = `${days.toFixed(2)} zł`;
    perMonth.textContent = `${month.toFixed(2)} zł`;

    perDays.classList.add('answear');
    perMonth.classList.add('answear');
  }
}

const fundsPerDayEngine = (newSum) => {
  
  daysLeftInCurrentMonth = getPaycheckDays;
  daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth, currentDay * 0).getDate();

  if(daysLeftInCurrentMonth === 0) daysLeftInCurrentMonth = 1;
  
  let getCalcDays = calcDays(newSum, daysLeftInCurrentMonth);
  let getCalcMonth = calcMonth(newSum, daysInCurrentMonth);

  days = getCalcDays;
  month = getCalcMonth;

  perDays.textContent = `${days.toFixed(2)} zł`;
  perMonth.textContent = `${month.toFixed(2)} zł`;

  perDays.classList.add('answear');
  perMonth.classList.add('answear');
}


const calcDays = (newSum, daysLeftInCurrentMonth) => {
  return days += newSum / daysLeftInCurrentMonth;
}

const calcMonth = (newSum, daysInCurrentMonth) => {
  return month += newSum / daysInCurrentMonth
}

const getNewestCalc = (newAvaibleFunds) => {
  console.log(newAvaibleFunds);
} 

// Remove one chosen element from list
const removeOneElement = e => {
  // if target has a class name, remove it
  if(e.target.classList.contains('fa-times-circle')){
    // remove element
    e.target.parentElement.parentElement.parentElement.remove();
    
    // remove monthly and days budget which element is removed
    let fund = e.target.parentElement.textContent.split(':');

    // function to remove every funds of removed element of a list
    fund.forEach((remove, index) => {
      if(index > 0){
        let removeFund = parseFloat(remove);

        Math.floor(startFunds -= removeFund);
        Math.floor(days -= removeFund / daysLeftInCurrentMonth);
        Math.floor(month -= removeFund / daysInCurrentMonth);

        if(startFunds < 0){
          removeAllEngine();
        } else {
          avaibleFunds.textContent = `${startFunds.toFixed(2)} zł`;
          perDays.textContent = `${days.toFixed(2)} zł`;
          perMonth.textContent = `${month.toFixed(2)} zł`;
        }

        if(startFunds === 0){
          perDays.classList.remove('answear');
          perMonth.classList.remove('answear');
        }
      }
    })
  }
}

// Clear all items from list of income and expenses
const removeAllEngine = () => {
  // when element contains class with typed name, remove it
  while(income.lastElementChild.className === 'list-item') {
    income.lastElementChild.remove();
  }

  // when element contains class with typed name, remove it
  while(expenses.lastElementChild.className === 'list-item'){
    expenses.lastElementChild.remove();
  }

  // clear all funds elements
  startFunds = 0;
  days = 0;
  month = 0;


  avaibleFunds.textContent = `${startFunds.toFixed(0)} zł`;
  perDays.textContent = `${days.toFixed(0)} zł`;
  perMonth.textContent = `${month.toFixed(0)} zł`;

  perDays.classList.remove('answear');
  perMonth.classList.remove('answear');
  daysLeft.classList.remove('answear');
  today.classList.remove('answear');
  daysLeft.textContent = '';
  today.textContent = '';
  dataChecked = 0;
}


// Load whole events here by using one function
const loadEvents = () => {
  // Start adding transaction, show popup
  addTransaction.addEventListener('click', () => {
    if(dataChecked === 1) {
      openPopUp();
    } else {
      openPopUpDate();
      dataChecked = 0;
    }
  });
  // Cancel adding transaction by using "cancelBtn"
  cancelBtn.addEventListener('click', closePopUp);
  // Cancel adding new date to calc founds
  cancelDateBtn.addEventListener('click', closePopUpDate);
  // Add transaction by saving them in popup panel
  saveBtn.addEventListener('click', checkInput);
  // Add new date to calc incomes and expenses
  saveDateBtn.addEventListener('click', setNewDate);
  // Remove one element child from income list
  income.addEventListener('click', removeOneElement);
  // Remove one element child from expenses list
  expenses.addEventListener('click', removeOneElement);
  // Remove all
  removeTransaction.addEventListener('click', removeAllEngine);
  // change date of founds
  changeDateBtn.addEventListener('click', () => {
    const newAvaibleFunds = document.querySelector('.avaible span').innerHTML;
    getNewestCalc(newAvaibleFunds);
    openPopUpDate();
    dateChoosen = '';
    changeDateClicked++
  });
}

// Load events here
loadEvents();
