import { getBudgetData, getExpensesData } from "./localStorageActions"
import { e, months, summaryTBodyRow, summaryTFootRow } from "./util";

const monthsBlock = document.querySelector('.months');
const tbody = document.querySelector('tbody');
const tfoot = document.querySelector('tfoot');

document.querySelector('.next').addEventListener('click', onNextBtn);
document.querySelector('.prev').addEventListener('click', onPrevBtn);

init();

function onNextBtn() {
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
    const budgetData = getBudgetData();

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
    const utilitiesRow = summaryTBodyRow('Utilities', fData, sData, tData);

    const groceriesRow = summaryTBodyRow('Groceries', fData, sData, tData);

    const entertainmentRow = summaryTBodyRow('Entertainment', fData, sData, tData);

    const transportRow = summaryTBodyRow('Transport', fData, sData, tData);

    const otherRow = summaryTBodyRow('Other', fData, sData, tData);
    
    return [utilitiesRow, groceriesRow, entertainmentRow, transportRow, otherRow];
}

function createTableFoot(totalSpent, budgets, savings) {
    const overrunObj = {
        f: budgets.f > totalSpent.f ? '0' : `${totalSpent.f - budgets.f}`,
        s: budgets.s > totalSpent.s ? '0' : `${totalSpent.s - budgets.s}`,
        t: budgets.t > totalSpent.t ? '0' : `${totalSpent.t - budgets.t}`,
    }

    const savingsObj = {
        fOverrun: budgets.f > totalSpent.f ? '0' : `${totalSpent.f - budgets.f}`,
        sOverrun: budgets.s > totalSpent.s ? '0' : `${totalSpent.s - budgets.s}`,
        tOverrun: budgets.t > totalSpent.t ? '0' : `${totalSpent.t - budgets.t}`,
        f: function() {
            return Number(this.fOverrun) ? savings.f - this.fOverrun : savings.f;
        },
        s() {
            return Number(this.sOverrun) ? savings.s - this.sOverrun : savings.s;
        },
        
        t() {
            return Number(this.tOverrun) ? savings.t - this.tOverrun : savings.t;
        } 
    }

    const totalSpentRow = summaryTFootRow('Total Spent', 'total', totalSpent);
    
    const budgetOverrunsRow = summaryTFootRow('Budget Overruns', 'overrun', overrunObj);

    const savingsRow = summaryTFootRow('Savings', 'savings', savingsObj);
   

    return [totalSpentRow, budgetOverrunsRow, savingsRow];
}