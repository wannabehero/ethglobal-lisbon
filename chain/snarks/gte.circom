pragma circom 2.0.0;

template IncomeGte(){
   signal input income;
   signal input target;
   signal output result;
   result <-- income >= target ? 1 : 0;
   result === 1;
}

component main {public [target]} = IncomeGte();