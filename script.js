'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



//date
const date=new Date();
const day=`${date.getDate()}`.padStart(2,0);
const month=`${(date.getMonth()+1)}`.padStart(2,0);
const year=date.getFullYear();
const hour=`${date.getHours()}`.padStart(2,0);
const min=`${date.getMinutes()}`.padStart(2,0);
labelDate.textContent=`${day}/${month}/${year}, ${hour}:${min}`;

const displayMovements=function(movements,sort=false){
  const movs=sort?movements.slice().sort(function(a,b){return a-b}):movements;
  containerMovements.innerHTML='';
    movs.forEach(function(mov,i){
      const type=mov>0?'deposit':'withdrawal';
      const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
      `;
      containerMovements.insertAdjacentHTML('afterbegin',html);
    });
};

const calcDisplayBalance=function(movements){
  currentAccount.balance=movements.reduce((acc,mov) => acc+mov,0);
  labelBalance.textContent=`${currentAccount.balance} EUR`;
}

const calcDisplaySummary=function(account){
  const income=account.movements.filter(mov => mov>0).reduce((acc,mov) => acc+mov,0);
  labelSumIn.textContent=`${income}€`; 

  const out=account.movements.filter(mov =>mov<0).reduce((acc,mov) => acc+mov,0);
  labelSumOut.textContent=`${Math.abs(out)}€`;

  const interest=account.movements.filter(mov =>mov>0).map(deposit =>(deposit*account.interestRate)/100).filter((int,i,arr)=>{
    return int>=1;
  }).reduce((acc,int)=> acc+int,0);
  labelSumInterest.textContent=`${interest}€`;
};



const createUserNames=function(accs){
  accs.forEach(function(acc){
    acc.username=acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};
createUserNames(accounts);


const updateUI=function(account){
    displayMovements(account.movements);
    calcDisplayBalance(account.movements);
    calcDisplaySummary(account);
      

}

let currentAccount;
btnLogin.addEventListener('click',function(e){
  e.preventDefault();
  currentAccount=accounts.find(
    function(acc){
      return(acc.username===inputLoginUsername.value);
    }
  )
    if(currentAccount?.pin===Number(inputLoginPin.value)){

      labelWelcome.textContent=`Welcome back ${currentAccount.owner.split(' ')[0]}`
      containerApp.style.opacity=100;
      inputLoginPin.value='';
      inputLoginUsername.value='';
      inputLoginPin.blur();

      updateUI(currentAccount);


    }

});

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
      const amount=Number(inputTransferAmount.value);
      const receiverAcc=accounts.find(function(account){
        return account.username===inputTransferTo.value;
      });
      // console.log(currentAccount);
      inputTransferAmount.value=inputTransferTo.value='';
      if(amount>0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username){
        //doing transfer
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);
         //transfer date
        currentAccount.movementsDate.push(new Date().toISOString());
        receiverAcc.movementsDate.push(new Date().toISOString());
        //update UI
        updateUI(currentAccount);
      }
});

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Math.floor(inputLoanAmount.value);
  if(amount>0 && currentAccount.movements.some(function(mov){
    return mov >= amount/10;
  })){
    currentAccount.movements.push(amount);
     //loan date
     currentAccount.movementsDate.push(new Date().toISOString());
    updateUI(currentAccount);
    inputLoanAmount.value='';
  }
})



btnClose.addEventListener('click',function(e){
  e.preventDefault();
  if(inputCloseUsername.value===currentAccount.username && Number(inputClosePin.value)===currentAccount.pin){
    const index=accounts.findIndex(function(account){
      return account.username===currentAccount.username;
    });
    // console.log(index);
    accounts.splice(index,1);
    containerApp.style.opacity=0;
    inputCloseUsername.value=inputClosePin.value='';

  }
});

// const accountMovements=accounts.map(function(acc){
//   return acc.movements;
// });
// console.log(accountMovements);
// const allMovements=accountMovements.flat();
// console.log(allMovements)
// const overallBalance=allMovements.reduce (function(acc,ele){
//     return acc+ele;
//     console.log(overallBalance);
// },0);


let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted=!sorted;

})





// const arr=account1.movements;
// console.log(arr); 

// arr.sort(function(a,b){
//   return b-a;
// })
// console.log(arr);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
