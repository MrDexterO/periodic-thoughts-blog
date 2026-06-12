// import '/post.css';

//================= POSTING A STORY ====================


// const articleBody = document.querySelector('.article-body');
// const articleImage = document.querySelector('.article-image');

// const postTitle = document.querySelector('#main-title');
// const postSubTitle = document.querySelector('#sub-title');
// const postAuthor = document.querySelector('#author');
// const postTime = document.querySelector('#post-time');

// const headerDiv = document.querySelector('.title-and-byline');

// let lastVersion = 0;
// let timeStamp = new Date().toLocaleString();
// let authorName = "Dr Gbemisola Bamiduro";



// const renderPost = (data) => {


//     const cardTitle = document.getElementById('title-index-card');
//     const cardSubTitle = document.getElementById('subtitle-index-card');
//     const cardArticle = document.querySelector('.article-list-card');


//     if (!cardTitle || !cardArticle) {
//         console.warn("Card elements not found in DOM yet. Retrying shortly...");
//         setTimeout(() => renderPost(data), 50);
//         return;
//     }

//     const imgURL = data.fields['Hero-Img'];
//     const img = document.createElement('img');
//     img.src = imgURL;
//     img.id = 'article-image';
//     articleImage.append(img);

//     postTitle.textContent = data.fields.Title;
//     postSubTitle.textContent = data.fields['Sub-Title'];
//     postAuthor.textContent = authorName;
//     postTime.textContent = new Date(data.fields.CreatedAt).toLocaleDateString(
//         'en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: 'numeric',
//         minute: 'numeric',
//         timeZoneName: 'short'
//     }
//     );

//     const body = data.fields.Body;
//     const paragraphs = body.split(/\r?\n/).filter(line => line.trim() !== "");
//     const pElement = paragraphs
//         .map(line => `<p>${line}</p>`)
//         .join('');
//     articleBody.innerHTML = pElement;



//     cardTitle.textContent = data.fields.Title;
//     cardSubTitle.textContent = data.fields['Sub-Title']; 
//     cardArticle.style.backgroundImage = `linear-gradient(#09162200,#091622fe),url(${imgURL})`;
// };


// const loadPost = async () => {
//     try {
//         const response = await fetch('http://localhost:3000/api/articles/latest');

//         if (!response.ok) {
//             throw new Error(`HTTP ${response.status}`);
//         }
//         const data = await response.json();
//         renderPost(data);

//     } catch (err) {
//         console.error("Failed to load initial post details:", err);
//     }
// };

// loadPost();


// const articleBody = document.querySelector('.article-body');
// const articleImage = document.querySelector('.article-image');

// const postTitle = document.querySelector('#main-title');
// const postSubTitle = document.querySelector('#sub-title');
// const postAuthor = document.querySelector('#author');
// const postTime = document.querySelector('#post-time');

// let authorName = "Dr Gbemisola Bamiduro";

// // RENDER FUNCTION
// const renderPost = (data) => {
//     const imgURL = data.fields['Hero-Img'];

//     if (articleImage) {
//         articleImage.innerHTML = ''; // Clear fallback contents
//         const img = document.createElement('img');
//         img.src = imgURL;
//         img.id = 'article-image';
//         articleImage.append(img);
//     }

//     if (postTitle) postTitle.textContent = data.fields.Title;
//     if (postSubTitle) postSubTitle.textContent = data.fields['Sub-Title'];
//     if (postAuthor) postAuthor.textContent = authorName;

//     if (postTime && data.fields.CreatedAt) {
//         postTime.textContent = new Date(data.fields.CreatedAt).toLocaleDateString(
//             'en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: 'numeric',
//             minute: 'numeric',
//             timeZoneName: 'short'
//         }
//         );
//     }

//     if (articleBody && data.fields.Body) {
//         const body = data.fields.Body;
//         const paragraphs = body.split(/\r?\n/).filter(line => line.trim() !== "");
//         const pElement = paragraphs.map(line => `<p>${line}</p>`).join('');
//         articleBody.innerHTML = pElement;
//     }
// };

// /* Load target post dynamically using path slugs */
// const loadPost = async () => {
//     try {
//         // Extract slug out of pathname (e.g., "/posts/my-awesome-slug" -> "my-awesome-slug")
//         const pathSegments = window.location.pathname.split('/');
//         const slug = pathSegments[pathSegments.length - 1];

//         // Fallback: if there's no slug in url path, hit fallback latest api
//         const targetEndpoint = slug && slug !== 'posts.html' && slug !== 'posts'
//             ? `http://localhost:3000/api/articles/slug/${slug}`
//             : 'http://localhost:3000/api/articles/latest';

//         const response = await fetch(targetEndpoint);

//         if (!response.ok) {
//             throw new Error(`HTTP ${response.status}`);
//         }
//         const data = await response.json();
//         renderPost(data);

//     } catch (err) {
//         console.error("Failed to load post details:", err);
//     }
// };

// loadPost();



const articleBody = document.querySelector('.article-body');
const articleImage = document.querySelector('.article-image');

const postTitle = document.querySelector('#main-title');
const postSubTitle = document.querySelector('#sub-title');
const postAuthor = document.querySelector('#author');
const postTime = document.querySelector('#post-time');
const storyGallery = document.getElementById('story_gallery'); // Target your gallery section

let authorName = "Dr Gbemisola Bamiduro";

// 1. RENDER THE MAIN ARTICLE
const renderPost = (data) => {
    const imgURL = data.fields['Hero-Img'];

    if (articleImage) {
        articleImage.innerHTML = '';
        const img = document.createElement('img');
        img.src = imgURL;
        img.id = 'article-image';
        articleImage.append(img);
    }

    if (postTitle) postTitle.textContent = data.fields.Title;
    if (postSubTitle) postSubTitle.textContent = data.fields['Sub-Title'];
    if (postAuthor) postAuthor.textContent = authorName;

    if (postTime && data.fields.CreatedAt) {
        postTime.textContent = new Date(data.fields.CreatedAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: 'numeric', timeZoneName: 'short'
        });
    }

    if (articleBody && data.fields.Body) {
        const body = data.fields.Body;
        const paragraphs = body.split(/\r?\n/).filter(line => line.trim() !== "");
        const pElement = paragraphs.map(line => `<p>${line}</p>`).join('');
        articleBody.innerHTML = pElement;
    }
};

// 2. RENDER THE MORE STORIES GALLERY (Excluding the current post)
const renderRelatedGallery = (records, currentSlug) => {
    if (!storyGallery || !records || records.length === 0) return;

    // Filter out the article that is currently open on this page
    const filteredPosts = records.filter(post => post.fields.Slug !== currentSlug);

    if (filteredPosts.length === 0) {
        storyGallery.innerHTML = ''; // Hide or clear if no other articles exist
        return;
    }

    let galleryHTML = `
        <div class="container" id="more_stories">
            <div class="story-list-title">
                <h2>Read More Topics</h2>
            </div>
            <div class="article-list">
    `;

    filteredPosts.forEach(post => {
        const fields = post.fields;
        const imgURL = fields['Hero-Img'];
        const slug = fields.Slug;

        galleryHTML += `
            <a href="/posts/${slug}" class="card-link">
                <div class="article-list-card" style="background-image: linear-gradient(#09162200,#091622fe), url('${imgURL}')">
                    <h3 class="title-index-card">${fields.Title}</h3>
                    <p class="subtitle-index-card">${fields['Sub-Title'] || ''}</p>
                </div>
            </a>
        `;
    });

    galleryHTML += `
            </div>
        </div>
    `;

    storyGallery.innerHTML = galleryHTML;
};

/* Load target post and dynamic sidebar/footer gallery */
const loadPostAndGallery = async () => {
    try {
        // Extract the current slug out of the URL pathname
        const pathSegments = window.location.pathname.split('/');
        const currentSlug = pathSegments[pathSegments.length - 1];

        // 1. Fetch current article data
        const targetEndpoint = currentSlug && currentSlug !== 'posts.html' && currentSlug !== 'posts'
            ? `http://localhost:3000/api/articles/slug/${currentSlug}`
            : 'http://localhost:3000/api/articles/latest';

        const response = await fetch(targetEndpoint);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const currentPostData = await response.json();

        // Render the main article text
        renderPost(currentPostData);

        // 2. Fetch all articles to construct the "Read More" gallery
        const galleryResponse = await fetch('http://localhost:3000/api/articles');
        if (galleryResponse.ok) {
            const allRecords = await galleryResponse.json();
            // Pass the accurate slug from the loaded record in case fallback was used
            renderRelatedGallery(allRecords, currentPostData.fields.Slug);
        }

    } catch (err) {
        console.error("Failed to load page elements:", err);
    }
};

loadPostAndGallery();