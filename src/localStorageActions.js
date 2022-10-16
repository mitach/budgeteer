// Expenses
export function setData(data) {
    localStorage.setItem('records', JSON.stringify(data));
}

export function getData() {
    const data = JSON.parse(localStorage.getItem('records'));

    const result = sortDataByDate(data);
    // const result = sortDataByAmount(data);

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