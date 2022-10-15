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
export const button = e.bind(null, 'button', {});

export const categories = ['Other', 'Utilities', 'Groceries', 'Entertainment', 'Transport'];

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];