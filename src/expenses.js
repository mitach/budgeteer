import { getExpensesData, setExpensesData } from './localStorageActions';
import { e, tr, td, categories, months, button, getId } from './util';


const expensesData = getExpensesData();

let editMode = false;
let currentId = null;

const form = document.getElementById('new-expense');
const tbody = document.querySelector('tbody');
const dateInput = form.querySelector('[name="date"]');

form.addEventListener('submit', onSubmit);
form.querySelector('[type="reset"]').addEventListener('click', (event) => {
    editMode = false;
    currentId = null;
});

tbody.addEventListener('click', onActionClick);

hidrate();

function hidrate() {
    const rows = expensesData.map(createExpenseRow);

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

    const record = {
        id,
        ...data
    }
    
    const expenseRow = createExpenseRow(record);
    
    if (editMode) {
        const oldRow = document.getElementById(id);
        tbody.replaceChild(expenseRow, oldRow);
        
        const i = expensesData.findIndex(x => x.id == expenseRow.id);
        expensesData.splice(i, 1, record);

        editMode = false;
        currentId = null;
    } else {
        expensesData.push(record);
        tbody.prepend(expenseRow);
    }

    form.reset();
    dateInput.value = data.date;

    setExpensesData(expensesData);
}

function createExpenseRow(record) {
    const { id, date, name, category, amount} = record;

    const parsedDate = new Date(date);
    const dateAsString = `${parsedDate.getDate()}.${months[parsedDate.getMonth()]}`

    const row = tr( 
        td(dateAsString),
        td(name),
        td(categories[category]),
        td(e('span', {className: 'currency'}, amount)),
        td(e('button', {className: 'editBtn'}, 'Edit'), e('button', {className: 'deleteBtn'}, 'Delete')),
    );
    row.id = id;

    return row;
}

function onActionClick(event) {
    if (event.target.tagName == 'BUTTON') {
        const row = event.target.parentElement.parentElement;
        if (event.target.classList.contains('editBtn')) {
            editRow(row);
        } else if (event.target.classList.contains('deleteBtn')) {
            deleteRecord(row);
        }
    }
}

function deleteRecord(row) {
    const flag = confirm('Are you sure you want to delete this?');

    if (flag) {
        row.remove();
        const i = expensesData.findIndex(x => x.id == row.id);
        expensesData.splice(i, 1);
        setExpensesData(expensesData);
    }
}

function editRow(row) {
    const record = expensesData.find(x => x.id == row.id);

    form.querySelector('[name="date"]').value = record.date;
    form.querySelector('[name="name"]').value = record.name;
    form.querySelector('[name="category"]').value = record.category;
    form.querySelector('[name="amount"]').value = record.amount;

    editMode = true;
    currentId = row.id;
}

window.expensesData = expensesData;