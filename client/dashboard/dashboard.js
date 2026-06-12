
const user = document.getElementById('user');
const dashboardTime = document.getElementById('log-in-time');
const allStoriesBtn = document.querySelector('#all-stories-btn');
const allStoriesPage = document.querySelector('.all-stories-page');

// Selectors for editor inputs and sections
const title = document.querySelector('#title');
const subTitle = document.querySelector('#sub-title');
const description = document.querySelector('#description');
const imgURL = document.querySelector('#img-link');
const body = document.querySelector('#content-area-pad');
const livePreview = document.querySelector('.live-preview');
const contentArea = document.querySelector('.content-area');
const saveBtn = document.querySelector('#save-btn');
const searchBar = document.querySelector('#search');
const storyListSection = document.querySelector('.story-list-section');

// Preview DOM generation elements
const articleTitle = document.createElement('h1');
const articleSubTitle = document.createElement('h2');
const articleDescription = document.createElement('h3');
const heroIMG = document.createElement('img');
const bodyDIV = document.createElement('div');
bodyDIV.id = 'div-for-bodyP';

livePreview.append(articleTitle, articleSubTitle, articleDescription, heroIMG, bodyDIV);

// App State Cache
let localRecordsCache = [];
let editingRecordId = null;

allStoriesBtn.textContent = "View All Articles";

//=============== DISPLAY CLOCK ON THE DASHBOARD =================================
function updateTime() {
    document.getElementById('log-in-time').innerHTML = new Date().toLocaleString();
}
updateTime();
setInterval(updateTime, 1000);

//=============== LAYOUT ROUTER AND VIEW TOGGLE CONTROL ===========================
function toggleViews(showAllStoriesPage) {
    if (showAllStoriesPage) {
        allStoriesPage.style.display = 'flex';
        contentArea.style.display = 'none';
        editingRecordId = null; // Reset current edit tracking identifier
    } else {
        allStoriesPage.style.display = 'none';
        contentArea.style.display = 'block';
    }
}

// Global toggle button behavior
function showAllStories() {
    const isCurrentlyHidden = allStoriesPage.style.display === 'none' || allStoriesPage.style.display === '';
    toggleViews(isCurrentlyHidden);
}
allStoriesBtn.addEventListener('click', showAllStories);

//=============== UPDATE LIVE PREVIEW IMPLEMENTATIONS ============================
title.addEventListener('input', () => { articleTitle.textContent = title.value; });
subTitle.addEventListener('input', () => { articleSubTitle.textContent = subTitle.value; });
description.addEventListener('input', () => { articleDescription.textContent = description.value; });

function normalizeNewlines(str) {
    return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function handleBodyInput(event) {
    const text = normalizeNewlines(event.target.innerText);
    const lines = text.split('\n').filter((line, index, arr) => {
        if (line === '' && arr[index - 1] === '') return false;
        return true;
    });

    bodyDIV.innerHTML = '';
    lines.forEach(line => {
        if (line === '') return;
        const p = document.createElement('p');
        p.textContent = line;
        bodyDIV.appendChild(p);
    });
}
body.addEventListener('input', handleBodyInput);

imgURL.addEventListener('input', () => {
    if (imgURL.value.trim() === '') {
        heroIMG.src = '';
        return;
    }
    heroIMG.src = imgURL.value;
    heroIMG.style.borderRadius = '1rem';
    heroIMG.style.width = '100%';
    heroIMG.style.objectFit = 'cover';
});

// Helper function to trigger manual refresh to live-preview layer when data updates via edit button clicks
function refreshLivePreview() {
    articleTitle.textContent = title.value;
    articleSubTitle.textContent = subTitle.value;
    articleDescription.textContent = description.value;
    heroIMG.src = imgURL.value;
    heroIMG.style.borderRadius = '1rem';
    heroIMG.style.width = '100%';
    heroIMG.style.objectFit = 'cover';

    // Manually pass internal HTML layout structure data block to the listener parser helper
    handleBodyInput({ target: { innerText: body.innerText } });
}

//=============== STORY CARD ACTIONS (EDIT, DELETE & RENDER) ====================
const renderDashboardStories = (records) => {
    if (!storyListSection) return;
    localRecordsCache = records;

    if (!records || records.length === 0) {
        storyListSection.innerHTML = `<p style="padding: 20px;">No stories found.</p>`;
        return;
    }

    storyListSection.innerHTML = records.map(post => {
        const fields = post.fields;
        const id = post.id;

        return `
            <div class="story-card" data-id="${id}">
                <p class="story-title">${fields.Title}</p>
                <div class="all-stories-control">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
        `;
    }).join('');
};

function searchCard() {
    const searchValue = searchBar.value.toLowerCase();
    const storyCards = document.querySelectorAll('.story-card');

    storyCards.forEach(function (card) {
        const titleElement = card.querySelector('.story-title');
        if (!titleElement) return;

        const titleText = titleElement.textContent.toLowerCase();
        card.style.display = titleText.includes(searchValue) ? 'flex' : 'none';
    });
}

async function handleControlActions(event) {
    const button = event.target;
    const storyCard = button.closest('.story-card');
    if (!storyCard) return;

    const recordId = storyCard.getAttribute('data-id');

    // EDIT ACTION ROUTE
    if (button.classList.contains('edit-btn')) {
        const targetArticle = localRecordsCache.find(post => post.id === recordId);
        if (!targetArticle) return;

        editingRecordId = recordId;

        // Repopulate dynamic standard content areas
        title.value = targetArticle.fields.Title || '';
        subTitle.value = targetArticle.fields['Sub-Title'] || '';
        description.value = targetArticle.fields.Description || '';
        imgURL.value = targetArticle.fields['Hero-Img'] || '';
        body.innerHTML = targetArticle.fields.Body || '';

        // Synchronize display layout switches & refresh previews
        refreshLivePreview();
        toggleViews(false);
    }

    // DELETE ACTION ROUTE
    if (button.classList.contains('delete-btn')) {
        if (confirm("Are you sure you want to permanently delete this story?")) {
            try {
                const response = await fetch(`http://localhost:3000/api/articles/${recordId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    storyCard.remove();
                    localRecordsCache = localRecordsCache.filter(p => p.id !== recordId);
                    console.log('Card removed from DOM and Airtable');
                } else {
                    alert("Failed to delete article from server.");
                }
            } catch (err) {
                console.error("Error connecting to server:", err);
            }
        }
    }
}

//=============== SAVING A STORY (CREATE OR UPDATE) ====================
async function saveArticle() {
    const articlePayload = {
        title: title.value,
        subtitle: subTitle.value,
        description: description.value,
        heroImg: imgURL.value,
        body: body.innerHTML
    };

    try {
        let url = 'http://localhost:3000/articles';
        let method = 'POST';

        // Check if we are running in an update configuration state context
        if (editingRecordId) {
            url = `http://localhost:3000/api/articles/${editingRecordId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(articlePayload)
        });

        if (!response.ok) throw new Error(`Server returned status code ${response.status}`);
        const data = await response.json();

        alert(editingRecordId ? "Story updated successfully!" : "Story created successfully!");

        // Clear workspace variables out, refresh active arrays and go home
        clearEditorFields(); // <--- Clear fields here
        await loadDashboard();
        toggleViews(true);

    } catch (error) {
        console.error('Error encountered while saving:', error);
        alert("An error occurred while saving the story.");
    }
}

//=============== CLEAR EDITOR WORKSPACE ====================
function clearEditorFields() {
    // Clear the input elements
    title.value = '';
    subTitle.value = '';
    description.value = '';
    imgURL.value = '';
    body.innerHTML = ''; // Clear contenteditable area

    // Clear live preview elements
    articleTitle.textContent = '';
    articleSubTitle.textContent = '';
    articleDescription.textContent = '';
    heroIMG.src = '';
    bodyDIV.innerHTML = '';

    // Reset tracking state variables
    editingRecordId = null;
}

const loadDashboard = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/articles');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const records = await response.json();
        renderDashboardStories(records);
    } catch (err) {
        console.error("Failed to load dashboard list:", err);
    }
};

// GLOBAL REGISTERED EVENT LISTENERS
searchBar.addEventListener('input', searchCard);
storyListSection.addEventListener('click', handleControlActions);
saveBtn.addEventListener('click', saveArticle);

// Run initial execution logic lifecycle 
loadDashboard();








































// const user = document.getElementById('user');
// const dashboardTime = document.getElementById('log-in-time');
// const allStoriesBtn = document.querySelector('#all-stories-btn');
// const allStoriesPage = document.querySelector('.all-stories-page');


// //=============== DISPLAY CLOCK ON THE DASHBOARD =================================

// // user.textContent = 'Dexter';
// allStoriesBtn.textContent = "View All Articles";


// function updateTime() {
//     document.getElementById('log-in-time').innerHTML =
//         new Date().toLocaleString();
// }

// updateTime(); // initial load

// setInterval(updateTime, 1000); // update every minute



// //=============== SHOW ALL STORIES PAGE ========================================


// function showAllStories() {

//     const pageState = allStoriesPage.style.display;

//     if (pageState === 'none') {
//         allStoriesPage.style.display = 'flex';
//     } else {
//         allStoriesPage.style.display = 'none';
//     }


// }

// allStoriesBtn.addEventListener('click', showAllStories);


// //=============== UPDATE LIVE PREVIEW ============================================
// const title = document.querySelector('#title');
// const subTitle = document.querySelector('#sub-title');
// const description = document.querySelector('#description');
// const imgURL = document.querySelector('#img-link');
// const body = document.querySelector('#content-area-pad');
// const slug = document.querySelector('#slug');
// const livePreview = document.querySelector('.live-preview');


// const articleTitle = document.createElement('h1');
// const articleSubTitle = document.createElement('h2');
// const articleDescription = document.createElement('h3');
// const bodyDIV = document.createElement('div');

// bodyDIV.id = 'div-for-bodyP';
// // ================= FUNCTION H1, H2 & H3 ================


// title.addEventListener('input', () => {
//     articleTitle.textContent = title.value;
// })

// subTitle.addEventListener('input', () => {
//     articleSubTitle.textContent = subTitle.value;
// })

// description.addEventListener('input', () => {
//     articleDescription.textContent = description.value;
// })


// // ================= FUNCTION FOR HANDLING BODY - P ==========================

// function normalizeNewlines(str) {
//     return str
//         .replace(/\r\n/g, '\n')   // Windows
//         .replace(/\r/g, '\n');    // old Mac
// }

// function handleBodyInput(event) {
//     const text = normalizeNewlines(event.target.innerText);

//     const lines = text
//         .split('\n')
//         .filter((line, index, arr) => {
//             // remove duplicate empty lines
//             if (line === '' && arr[index - 1] === '') return false;
//             return true;
//         });

//     bodyDIV.innerHTML = '';

//     lines.forEach(line => {
//         const p = document.createElement('p');
//         if (line === '') {
//             return;
//         } else {
//             p.textContent = line;
//         }
//         bodyDIV.appendChild(p);
//     });
// }


// body.addEventListener('input', handleBodyInput);

// // =================-==========================================================================



// const heroIMG = document.createElement('img');

// imgURL.addEventListener('input', () => {
//     if (imgURL.value.trim() === '') return;
//     const heroIMGURL = imgURL.value;
//     heroIMG.src = heroIMGURL;
//     heroIMG.style.borderRadius = '1rem';
//     heroIMG.style.width = '100%';
//     heroIMG.style.objectFit = 'cover';


// })


// livePreview.append(articleTitle, articleSubTitle, articleDescription, heroIMG, bodyDIV);

// // //================= STORY CARD MANIPULATION IN ALL STORIES PAGE=====================


// // const deleteButtons = document.querySelectorAll('.delete-btn');
// // const searchBar = document.querySelector('#search');
// // const storyCards = document.querySelectorAll('.story-card');


// // // DELETE CARD
// // function buttonDelete() {
// //     const storyCard = this.closest('.story-card');
// //     storyCard.remove();
// //     console.log('Card removed');
// // }

// // deleteButtons.forEach(function (button) {
// //     button.addEventListener('click', buttonDelete);
// // });


// // // SEARCH CARDS


// // function searchCard() {

// //     const searchValue = searchBar.value.toLowerCase();

// //     storyCards.forEach(function (card) {

// //         const title = card.querySelector('.story-title')
// //             .textContent
// //             .toLowerCase();

// //         if (title.includes(searchValue)) {

// //             card.style.display = 'flex';

// //         } else {

// //             card.style.display = 'none';

// //         }

// //     });

// // }


// // searchBar.addEventListener('input', searchCard);


// // //================= SAVING A STORY ====================

// // const saveBtn = document.querySelector('#save-btn');

// // saveBtn.addEventListener('click', saveArticle);

// // async function saveArticle() {

// //     const article = {
// //         title: document.querySelector('#title').value,
// //         subtitle: document.querySelector('#sub-title').value,
// //         description: document.querySelector('#description').value,
// //         heroImg: document.querySelector('#img-link').value,

// //         // contenteditable content
// //         body: document.querySelector('#content-area-pad').innerHTML
// //     };

// //     try {

// //         const response = await fetch('/articles', {
// //             method: 'POST',
// //             headers: {
// //                 'Content-Type': 'application/json'
// //             },
// //             body: JSON.stringify(article)
// //         });

// //         const data = await response.json();

// //         console.log('Saved:', data);

// //     } catch (error) {

// //         console.error(error);

// //     }
// // }

// //=============================================================

// //================= POSTING A STORY  ====================


// // const postBtn = document.querySelector('#post-btn');

// // postBtn.addEventListener('click', async () => {
// //     try {
// //         const response = await fetch('http://localhost:3000/api/articles/latest');

// //         if (!response.ok) {
// //             throw new Error(`HTTP ${response.status}`);
// //         }


// //         const data = await response.json();

// //         // Extract slug from response body

// //         const title = data.fields.Title;
// //         const subTitle = data.fields['Sub-Title'];
// //         const description = data.fields.Description;
// //         const imgURL = data.fields['Hero-Img'];
// //         const body = data.fields.Body;
// //         const postSlug = data.fields.Slug;
// //         const postTime = data.fields.CreatedAt;
// //         const postID = data.fields.RecordID;

// //         user.textContent = title;

// //         console.log(title, subTitle, description, imgURL, body, postSlug, postTime, postID);



// //     } catch (error) {
// //         console.error('Failed to fetch article:', error);
// //     }
// // });



// //================= STORY CARD MANIPULATION =====================

// const searchBar = document.querySelector('#search');
// const storyListSection = document.querySelector('.story-list-section');

// // 1. RENDER ALL STORIES TO THE DASHBOARD
// const renderDashboardStories = (records) => {
//     if (!storyListSection) return;

//     if (!records || records.length === 0) {
//         storyListSection.innerHTML = `<p style="padding: 20px;">No stories found.</p>`;
//         return;
//     }

//     storyListSection.innerHTML = records.map(post => {
//         const fields = post.fields;
//         const id = post.id; // Airtable Record ID

//         return `
//             <div class="story-card" data-id="${id}">
//                 <p class="story-title">${fields.Title}</p>
//                 <div class="all-stories-control">
//                     <button class="edit-btn">Edit</button>
//                     <button class="delete-btn">Delete</button>
//                 </div>
//             </div>
//         `;
//     }).join('');
// };

// // 2. LIVE SEARCH FUNCTION
// function searchCard() {
//     const searchValue = searchBar.value.toLowerCase();
//     // Query dynamically so we capture the injected cards
//     const storyCards = document.querySelectorAll('.story-card');

//     storyCards.forEach(function (card) {
//         const titleElement = card.querySelector('.story-title');
//         if (!titleElement) return;

//         const title = titleElement.textContent.toLowerCase();

//         if (title.includes(searchValue)) {
//             card.style.display = 'flex';
//         } else {
//             card.style.display = 'none';
//         }
//     });
// }

// // 3. DELETE CARD FROM FRONTEND & BACKEND
// async function handleDelete(event) {
//     // Check if the clicked item inside our container was a delete button
//     if (!event.target.classList.contains('delete-btn')) return;

//     const button = event.target;
//     const storyCard = button.closest('.story-card');
//     const recordId = storyCard.getAttribute('data-id');

//     if (!recordId) return;

//     if (confirm("Are you sure you want to permanently delete this story?")) {
//         try {
//             const response = await fetch(`http://localhost:3000/api/articles/${recordId}`, {
//                 method: 'DELETE'
//             });

//             if (response.ok) {
//                 storyCard.remove();
//                 console.log('Card removed from DOM and Airtable');
//             } else {
//                 alert("Failed to delete article from server.");
//             }
//         } catch (err) {
//             console.error("Error connecting to server:", err);
//         }
//     }
// }

// // 4. INITIAL INITIALIZATION
// const loadDashboard = async () => {
//     try {
//         const response = await fetch('http://localhost:3000/api/articles');
//         if (!response.ok) throw new Error(`HTTP ${response.status}`);

//         const records = await response.json();
//         renderDashboardStories(records);
//     } catch (err) {
//         console.error("Failed to load dashboard list:", err);
//     }
// };

// // EVENT LISTENERS
// searchBar.addEventListener('input', searchCard);
// // Event delegation inside container captures dynamically added buttons
// storyListSection.addEventListener('click', handleDelete);

// // Run on page load
// loadDashboard();