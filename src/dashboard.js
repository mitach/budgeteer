const { getData } = require("./localStorageActions");
const { categories, e } = require("./util");

const breakdownDiv = document.querySelector('.breakdown');

start();

function start() {

    const records = getData();
    const summary =  summarize(records, categories);
    const maxValue = Math.max(...Object.values(summary));
    const rows = Object.entries(summary).map(([name, value]) => createSummaryRow(name, value, maxValue));

    breakdownDiv.replaceChildren(...rows);
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

function createSummaryRow(name, value, maxValue) {
    const bar = e('span', {className: 'bar'});
    bar.style.width = `${value / maxValue * 500 | 0}px`;

    const result = e('div', {className: 'cat-row'},
        e('span', {className: 'row label'}, name),
        e('span', {className: 'row value'}, value),
        e('div', {className: 'bar-area'}, bar),
    );

    return result
}

/*
<div class="cat-row">
    <span class="row label">Utilities</span>
    <span class="row value">350</span>
    <div class="bar-area">
        <span class="bar" style="width: 350px"></span>
    </div>
</div>
*/