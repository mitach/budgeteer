import { e, tr, td, categories, months, button } from './util';

const form = document.getElementById('new-expense');
const tbody = document.querySelector('tbody');
const dateInput = form.querySelector('[name="date"]');

form.addEventListener('submit', onSubmit);

function onSubmit(event) {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.target));
    const validData = Object.values(data).every(x => x);

    if (validData == false) {
        return;
    }

    const expenseRow = createExpenseRow(data);
    tbody.prepend(expenseRow);

    form.reset();
    dateInput.value = data.date;
}

function createExpenseRow(rowData) {
    const {date, name, category, amount} = rowData;

    const parsedDate = new Date(date);
    const dateAsString = `${parsedDate.getDate()}.${months[parsedDate.getMonth()]}`

    const row = tr( 
        td(dateAsString),
        td(name),
        td(categories[category]),
        td(e('span', {className: 'currency'}, amount)),
        td(button('Edit'), button('Delete')),
    );

    return row;
}