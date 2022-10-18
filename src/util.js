/**
 * 
 * @param {string} type 
 * @param {Object} attributes 
 * @param  {...(string|Node)} content 
 * @returns {HTMLElement}
 * 
 */
export function e(type, attributes, ...content) {
    const result = document.createElement(type);

    for (let key in attributes) {
        if (key.startsWith('on')) {
            result.addEventListener(key.slice(2), attributes[key])
        } else {
            result[key] = attributes[key];
        }
    }

    for (let item of content) {
        result.append(item);
    }

    return result;
}

export const tr = e.bind(null, 'tr', {});
export const td = e.bind(null, 'td', {});

export const summaryRow = function(rowName, fData, sData, tData) {
    const id = rowName.toLowerCase();

    const totalSum = (fData[rowName] || 0) + (sData[rowName] || 0) + (tData[rowName] || 0);

    const result = e('tr', {id},
    e('th', {}, rowName),
    e('td', {}, e('span', {className: 'currency'}, fData[rowName] || 0)),
    e('td', {}, e('span', {className: 'currency'}, sData[rowName] || 0)),
    e('td', {}, e('span', {className: 'currency'}, tData[rowName] || 0)),
    e('th', {}, e('span', {className: 'currency'}, totalSum)),
    );

    return result;
}

export const categories = ['Other', 'Utilities', 'Groceries', 'Entertainment', 'Transport'];

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getId() {
    return ('00000000' + (Math.random() * 99999999 | 0).toString(16)).slice(-8);
}