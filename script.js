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
  movementsDate:[
    '2019-11-18T21:31:17.178z',
    '2019-12-23T07:42:02.383z',
    '2020-01-28T09:15:04.904z',
    '2020-04-01T10:17:24.185z',
    '2020-05-08T14:11:59.604z',
    '2020-05-27T17:01:17.194z',
    '2020-07-11T23:36:17.929z',
    '2020-07-12T10:51:36.1790z',
  ],

};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDate:[
    '2019-11-18T21:31:17.178z',
    '2019-12-23T07:42:02.383z',
    '2020-01-28T09:15:04.904z',
    '2020-04-01T10:17:24.185z',
    '2020-05-08T14:11:59.604z',
    '2020-05-27T17:01:17.194z',
    '2020-07-11T23:36:17.929z',
    '2020-07-12T10:51:36.1790z',
  ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDate:[
    '2019-11-18T21:31:17.178z',
    '2019-12-23T07:42:02.383z',
    '2020-01-28T09:15:04.904z',
    '2020-04-01T10:17:24.185z',
    '2020-05-08T14:11:59.604z',
    '2020-05-27T17:01:17.194z',
    '2020-07-11T23:36:17.929z',
    '2020-07-12T10:51:36.1790z',
  ],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDate:[
    '2019-11-18T21:31:17.178z',
    '2019-12-23T07:42:02.383z',
    '2020-01-28T09:15:04.904z',
    '2020-04-01T10:17:24.185z',
    '2020-05-08T14:11:59.604z',
  ],
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


const createUserNames=function(accs){
    accs.forEach(function(acc){
        acc.username=acc.owner.toLowerCase().split(' ').map(function(name){
            return name[0];
        }).join('');
    })
   
}
createUserNames(accounts);


const formatMovementsDate=function(date){
    const calcDaysPassed=(date1,date2) =>Math.round(Math.abs(date2-date1)/(1000*60*60*24)); 
    const daysPassed=calcDaysPassed(new Date(),date);

    if(daysPassed===0) return 'Today';
    if(daysPassed===1) return 'yesterday';
    if(daysPassed<=7) return `${daysPassed} days ago`; 
    else{
        const day=`${date.getDate()}`.padStart(2,0);
        const month=`${date.getMonth()+1}`.padStart(2,0);
        const year=date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}

const displayMovements=function(currentAccount,sorted=false){
    const movs=sorted?currentAccount.movements.slice().sort(function(a,b){ return a-b;}):currentAccount.movements;
    containerMovements.innerHTML='';
    let i=0;
    for(const mov of movs){

        //date
        const date=new Date(currentAccount.movementsDate[i]);
        const displayDate=formatMovementsDate(date);
        console.log(displayDate);
        const type=mov>0?'deposit':'withdrawal';
        const html=`
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov}€</div>
      </div>
        `;
        ++i;
        containerMovements.insertAdjacentHTML('afterbegin',html);
    }
};

const calcDisplaySummary=function(account){
    const income=account.movements.filter(function(mov){
        return mov>0;
    }).reduce(function(acc,mov){
        return acc+mov;
    },0);
    // console.log(income);
    labelSumIn.textContent=`${income}€`;

    const out=account.movements.filter(function(mov){
        return mov<0;
    }).reduce(function(acc,mov){
        return acc+mov;
    },0);
    labelSumOut.textContent=`${Math.abs(out)}€`;

    const interest=account.movements.filter(function(mov){
        return mov>0;
    }).map(function(deposit){
       return deposit*account.interestRate/100;
    }).filter(function(intrst){
        return intrst>=1;
    }).reduce(function(acc,int){
        return acc+int;
    },0);
    console.log(interest);
    labelSumInterest.textContent=`${interest}€`;

}

const calcDisplayBalance=function(account){
    currentAccount.balance=account.movements.reduce(function(acc,mov){
        return acc+mov;
    },0);
    labelBalance.textContent=`${currentAccount.balance} EUR`;

}

const updateUI=function(account){
    displayMovements(account);
    calcDisplaySummary(account);
    calcDisplayBalance(account);
}

const startLogOutTimer=function(){
  let time=20;
  const timer=function(){
      const min=String(Math.trunc(time/60)).padStart(2,'0');
      const sec=String(time%60).padStart(2,'0');
      labelTimer.textContent=`${min}:${sec}`;
     
      if(time===0){
          clearInterval(timer);
          labelWelcome.textContent='Log in to get started';
          containerApp.style.opacity=0;
      }
      time--;
  };
  timer();
  const tick=setInterval(timer,1000);
}
startLogOutTimer();

let currentAccount;
btnLogin.addEventListener('click' ,function(e){
    e.preventDefault();
    currentAccount=accounts.find(function(acc){
        return (acc.username === inputLoginUsername.value) ;
    });

    console.log(currentAccount);
    if(Number(inputLoginPin.value) === currentAccount?.pin){
        labelWelcome.textContent=`Welcome back ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity=1;
        inputLoginUsername.value=inputLoginPin.value="";
        inputLoginPin.blur();
        updateUI(currentAccount);
       
    }

});

let sorted=false;
btnSort.addEventListener('click',function(e){
    e.preventDefault();
    displayMovements(currentAccount,!sorted);
    sorted=!sorted;
    
})


btnTransfer.addEventListener('click',function(e){
    e.preventDefault();
    const amount=Number(inputTransferAmount.value);
    const receiverAcc=accounts.find(function(acc){
        return acc.username === inputTransferTo.value;
    })
    // console.log(receiverAcc);
if(receiverAcc && currentAccount.balance>0 && currentAccount.balance>=amount && currentAccount.username !== receiverAcc?.username && receiverAcc.username ){
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);
    //transfer date
    currentAccount.movementsDate.push(new Date().toISOString());
    receiverAcc.movementsDate.push(new Date().toISOString());
    displayMovements(currentAccount);
    updateUI(currentAccount);
} 
});


btnLoan.addEventListener('click' ,function(e){
    e.preventDefault();
    const amount=Math.floor(inputLoanAmount.value);
    if(amount>0 && currentAccount.movements.some(function(mov){
        return mov>=amount/10;
    })){

      setTimeout(function(){
        currentAccount.movements.push(amount)
        //loan date
        currentAccount.movementsDate.push(new Date().toISOString());
       updateUI(currentAccount);
       inputLoanAmount.value='';
      },2500);
       
    }

})

btnClose.addEventListener('click',function(e){
    e.preventDefault();
    if(inputCloseUsername.value!=='' && inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value)===currentAccount.pin){
        const index=accounts.findIndex(function(account){
            return account.username === currentAccount.username;
        })
     accounts.splice(index,1);
    containerApp.style.opacity=0;
    inputCloseUsername.value=inputClosePin.value='';
    }
    
})

const now = new Date(0);
console.log(now);




