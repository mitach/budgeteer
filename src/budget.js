import { getBudgetData, setBudgetData } from "./localStorageActions";
import { e, getId, months, td, tr } from "./util";

const budgetData = getBudgetData();

let editMode = false;
let currentId = null;

const form = document.getElementById('new-budget');
const tbody = document.querySelector('tbody');

form.addEventListener('submit', onSubmit);
form.querySelector('[type="reset"]').addEventListener('click', () => {
    editMode = false;
    currentId = null;
});

tbody.addEventListener('click', onActionCLick);

hidrate();

function hidrate() {
    const rows = budgetData.map(createBudgetRow);

    tbody.replaceChildren(...rows);
}

function onSubmit(event) {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.target));

    const validData = Object.values(data).every(x => x);
    if (validData == false) {
        return;
    }

    const id = editMode ? currentId : getId();
    const parsedMonth = parseInt(data.month.slice(0, 2), 10) - 1;
    const _month = months[parsedMonth];

    const record = {
        id,
        _month,
        ...data
    }

    const budgetRow = createBudgetRow(record);

    if (editMode) {
        const oldRow = document.getElementById(id);
        tbody.replaceChild(budgetRow, oldRow);

        const i = budgetData.findIndex(x => x.id == budgetRow.id);
        budgetData.splice(i, 1, record);

        editMode = false;
        currentId = null;
    } else {
        tbody.append(budgetRow);
        budgetData.push(record);
    }    

    form.reset();

    setBudgetData(budgetData);
}

function createBudgetRow(record) {
    const {id, month, income, budget} = record;

    const parsedMonth = parseInt(month.slice(0, 2), 10) - 1;
    const parsedYear = month.slice(-4);

    const dateAsString = `${months[parsedMonth]}.${parsedYear}`;

    const row = tr(
        td(dateAsString),
        td(e('span', {className: 'currency'}, income)),
        td(e('span', {className: 'currency'}, budget)),
        td(e('button', {className: 'editBtn'}, 'Edit'), e('button', {className: 'deleteBtn'}, 'Delete')),
    )
    row.id = id;

    return row;
}

function onActionCLick(event) {
    if (event.target.tagName == 'BUTTON') {
        const row = event.target.parentElement.parentElement;
        if (event.target.classList.contains('editBtn')) {
            editRow(row);
        } else if (event.target.classList.contains('deleteBtn')) {
            deleteRow(row);
        }
    }
}

function deleteRow(row) {
    const flag = confirm('Are you sure you want to delete this?');

    if (flag) {
        row.remove();
        const i = budgetData.findIndex(x => x.id == row.id);
        budgetData.splice(i, 1);
        setBudgetData(budgetData);
    }
}

function editRow(row) {
    const record = budgetData.find(x => x.id == row.id);

    form.querySelector('[name="month"]').value = record.month;
    form.querySelector('[name="income"]').value = record.income;
    form.querySelector('[name="budget"]').value = record.budget;

    editMode = true;
    currentId = row.id;
}