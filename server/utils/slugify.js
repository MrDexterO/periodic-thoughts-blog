export const slugify = (text) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/&/g, '-and-')
        .replace(/[\s\W-]+/g, '-');