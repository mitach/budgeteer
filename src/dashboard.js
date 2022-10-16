const { getExpensesData, getBudgetData } = require("./localStorageActions");
const { categories, e } = require("./util");

const records = getExpensesData();
const summary =  summarize(records, categories);

overviewChart();

breakdownChart();

function overviewChart() {
    const budgetData = getBudgetData();

    const spent = Object.values(summary).reduce((a, b) => a + Number(b), 0);

    let budget = 0;
    let income = 0;

    for (let record of budgetData) {
        budget += Number(record.budget);
        income += Number(record.income);
    }

    const remaining = budget - spent;
    const savings = income - budget;

    const data = {
        'Spent': spent,
        "Remaining": remaining,
        'Savings': savings,
    }

    const chart = createRightCol(spent, remaining, savings, income);

    const catRows = Object.entries(data).map(([name, value]) => createLeftCol(name, value));
    
    document.querySelector('.right-col').replaceChildren(chart);
    document.querySelector('.left-col').replaceChildren(...catRows);

    function createLeftCol(name, value) {
        const catRow = e('div', {className: 'cat-row'},
            e('span', {className: 'row label'}, name),
            e('span', {className: 'row value'}, value),
        )

        return catRow;
    }
    
    function createRightCol(spent, remaining, savings, income) {
        const spentDiv = e('div', {className: 'ov spent'});
        spentDiv.style.height = `${spent / income * 300 | 0}px`;

        const remainingDiv = e('div', {className: 'ov remain'});
        remainingDiv.style.height = `${remaining / income * 300 | 0}px`;

        const savingsDiv = e('div', {className: 'ov save'});
        savingsDiv.style.height = `${savings / income * 300 | 0}px`;

        const result = e('div', {className: 'right-col'},
            spentDiv,
            remainingDiv,
            savingsDiv,
        );

        return result;
    }
}

function breakdownChart() {
    const breakdownDiv = document.querySelector('.breakdown');

    
    const maxValue = Math.max(...Object.values(summary));
    const rows = Object.entries(summary).map(([name, value]) => createSummaryRow(name, value, maxValue));
    
    breakdownDiv.replaceChildren(...rows);

    function createSummaryRow(name, value, maxValue) {
        const bar = e('span', {className: 'bar'});
        bar.style.width = `${value / maxValue * 500 | 0}px`;
        
        const result = e('div', {className: 'cat-row'},
        e('span', {className: 'row label'}, name),
        e('span', {className: 'row value'}, value),
        e('div', {className: 'bar-area'}, bar),
        );
        
        return result;
    }
}

function summarize(records, categories) {
    const summary = {};
    
    for (let record of records) {
        const category = categories[record.category]
        if (summary.hasOwnProperty(category)) {
            summary[category] += Number(record.amount);
        } else {
            summary[category] = Number(record.amount);
        }
    }
    
    return summary;
}