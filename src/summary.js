import { getBudgetData, getExpensesData } from "./localStorageActions"
import { e, months, summaryRow } from "./util";

const monthsBlock = document.querySelector('.months');
const tbody = document.querySelector('tbody');
const tfoot = document.querySelector('tfoot');

document.querySelector('.next').addEventListener('click', onNextBtn);
document.querySelector('.prev').addEventListener('click', onPrevBtn);

init();

function onNextBtn(e) {
    const lastMonth = monthsBlock.children[3].textContent;
    const i = months.indexOf(lastMonth);

    if (i == 11) {
        return;
    }
    
    monthsBlock.children[1].textContent = months[i + 1];
    monthsBlock.children[2].textContent = months[i + 2];
    monthsBlock.children[3].textContent = months[i + 3];

    init();
}

function onPrevBtn() {
    const firstMonth = monthsBlock.children[1].textContent;
    const i = months.indexOf(firstMonth);
    
    if (i == 0) {
        return;
    }

    monthsBlock.children[1].textContent = months[i - 3];
    monthsBlock.children[2].textContent = months[i - 2];
    monthsBlock.children[3].textContent = months[i - 1];

    init();
}


function init() {
    const expensesData = getExpensesData();

    const firstMonth = monthsBlock.children[1].textContent;
    const secondMonth = monthsBlock.children[2].textContent;
    const thirdMonth = monthsBlock.children[3].textContent;
    
    const resultFirstMonth = expensesData.filter(x => x._month == firstMonth);
    const resultSecondMonth = expensesData.filter(x => x._month == secondMonth);
    const resultThirdMonth = expensesData.filter(x => x._month == thirdMonth);
    
    let firstMonthData = {};
    let secondMonthData = {};
    let thirdMonthData = {};

    let totalSpent = {
        f: 0,
        s: 0,
        t: 0,
    }

    const budgetData = getBudgetData();

    const fBudgetData = budgetData.find(x => x._month == firstMonth);
    const sBudgetData = budgetData.find(x => x._month == secondMonth);
    const tBudgetData = budgetData.find(x => x._month == thirdMonth);

    let budgets = {
        f: (fBudgetData?.budget) || 0,
        s: (sBudgetData?.budget) || 0,
        t: (tBudgetData?.budget) || 0,
    }
    
    let savings = {
        f: (fBudgetData?.income - fBudgetData?.budget) || 0,
        s: (sBudgetData?.income - sBudgetData?.budget) || 0,
        t: (tBudgetData?.income - tBudgetData?.budget) || 0,
    }

    for (let record of resultFirstMonth) {
        totalSpent.f += Number(record.amount);
        if (firstMonthData.hasOwnProperty(record._catName)) {
            firstMonthData[record._catName] += Number(record.amount);
        } else {
            firstMonthData[record._catName] = Number(record.amount);
        }
    }

    for (let record of resultSecondMonth) {
        totalSpent.s += Number(record.amount);
        if (secondMonthData.hasOwnProperty(record._catName)) {
            secondMonthData[record._catName] += Number(record.amount);
        } else {
            secondMonthData[record._catName] = Number(record.amount);
        }
    }

    for (let record of resultThirdMonth) {
        totalSpent.t += Number(record.amount);
        if (thirdMonthData.hasOwnProperty(record._catName)) {
            thirdMonthData[record._catName] += Number(record.amount);
        } else {
            thirdMonthData[record._catName] = Number(record.amount);
        }
    }


    const tableBody = createTableBody(firstMonthData, secondMonthData, thirdMonthData);
    
    const tableFoot = createTableFoot(totalSpent, budgets, savings);

    tbody.replaceChildren(...tableBody);
    tfoot.replaceChildren(...tableFoot);
}

function createTableBody(fData, sData, tData) {
    const utilitiesRow = summaryRow('Utilities', fData, sData, tData);

    const groceriesRow = summaryRow('Groceries', fData, sData, tData);

    const entertainmentRow = summaryRow('Entertainment', fData, sData, tData);

    const transportRow = summaryRow('Transport', fData, sData, tData);

    const otherRow = summaryRow('Other', fData, sData, tData);
    
    return [utilitiesRow, groceriesRow, entertainmentRow, transportRow, otherRow];
}

function createTableFoot(totalSpent, budgets, savings) {
    const totalSpentSum = totalSpent.f + totalSpent.s + totalSpent.t;

    const fOverrun = budgets.f > totalSpent.f ? '0' : `${totalSpent.f - budgets.f}`;
    const sOverrun = budgets.s > totalSpent.s ? '0' : `${totalSpent.s - budgets.s}`;
    const tOverrun = budgets.t > totalSpent.t ? '0' : `${totalSpent.t - budgets.t}`;
    const totatOverrun = Number(fOverrun) + Number(sOverrun) + Number(tOverrun);

    const fSavings = Number(fOverrun) ? savings.f - fOverrun : savings.f;
    const sSavings = Number(sOverrun) ? savings.s - sOverrun : savings.s;
    const tSavings = Number(tOverrun) ? savings.t - tOverrun : savings.t;

    const totalSpentRow = e('tr', {className: 'total'},
        e('th', {}, 'Total Spent'),
        e('td', {}, e('span', {className: 'currency'}, totalSpent.f)),
        e('td', {}, e('span', {className: 'currency'}, totalSpent.s)),
        e('td', {}, e('span', {className: 'currency'}, totalSpent.t)),
        e('th', {}, e('span', {className: 'currency'}, totalSpentSum)),
    );

    const budgetOverrunsRow = e('tr', {className: 'overrun'},
        e('th', {}, 'Budget Overruns'),
        e('td', {}, e('span', {className: 'currency'}, fOverrun)),
        e('td', {}, e('span', {className: 'currency'}, sOverrun)),
        e('td', {}, e('span', {className: 'currency'}, tOverrun)),
        e('th', {}, e('span', {className: 'currency'},totatOverrun )),
    );
    
    const savingsRow = e('tr', {className: 'savings'},
        e('th', {}, 'Savings'),
        e('td', {}, e('span', {className: 'currency'}, fSavings)),
        e('td', {}, e('span', {className: 'currency'}, sSavings)),
        e('td', {}, e('span', {className: 'currency'}, tSavings)),
        e('th', {}, e('span', {className: 'currency'}, fSavings + sSavings + tSavings)),
    );
   

    return [totalSpentRow, budgetOverrunsRow, savingsRow];
}