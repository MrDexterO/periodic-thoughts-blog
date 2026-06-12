
async function loadComponents(id, file) {
    const response = await fetch(file);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;

    const copywriteYear = document.getElementById('copyright-year');
    copywriteYear.textContent = new Date().getFullYear();
}

loadComponents("nav", "../homepage/helpers/header.html");
loadComponents("support", "../homepage/helpers/support.html");
loadComponents("story_gallery", "../homepage/helpers/more_stories.html");
loadComponents("footer", "../homepage/helpers/footer.html");

// async function loadComponents(id, file) {
//     try {
//         const response = await fetch(file);
//         const html = await response.text();
//         document.getElementById(id).innerHTML = html;
//     } catch (err) {
//         console.error(`Failed to load component ${id}:`, err);
//     }
// }

// // 1. Group all your component promises together
// Promise.all([
//     loadComponents("nav", "../homepage/helpers/header.html"),
//     loadComponents("support", "../homepage/helpers/support.html"),
//     loadComponents("story_gallery", "../homepage/helpers/more_stories.html"),
//     loadComponents("footer", "../homepage/helpers/footer.html")
// ]).then(() => {
//     // 2. This runs ONLY after all 4 components are successfully injected!
//     document.dispatchEvent(new Event('layoutReady'));
// });

