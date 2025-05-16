import xss from 'xss';

export const xssFilter = (value: string) => {
    return xss(value)
};