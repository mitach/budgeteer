// Expenses
export function setExpensesData(data) {
    localStorage.setItem('records', JSON.stringify(data));
}

export function getExpensesData() {
    return JSON.parse(localStorage.getItem('records'));
}

export function getExpensesDataSortedByDate() {
    const data = JSON.parse(localStorage.getItem('records'));

    const result = sortDataByDate(data);

    return result;
}

export function getExpensesDataSortedByAmount() {
    const data = JSON.parse(localStorage.getItem('records'));

    const result = sortDataByAmount(data);

    return result;
}

// Budget
export function setBudgetData(data) {
    localStorage.setItem('budget', JSON.stringify(data));
}

export function getBudgetData() {
    return JSON.parse(localStorage.getItem('budget'));
}


// Helper Functions
function sortDataByDate(data) {
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
}


function sortDataByAmount(data) {
    return data.sort((a, b) => b.amount - a.amount);
}