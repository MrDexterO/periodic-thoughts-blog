// import '/post.css';

// const featureArticle = document.getElementById('feature-article');
// const title = document.getElementById('title-index');
// const subTitle = document.getElementById('subtitle-index');
// const author = document.getElementById('author');

// const cardTitle = document.getElementById('title-index-card');
// const cardSubTitle = document.getElementById('subtitle-index-card');
// const cardArticle = document.querySelector('.article-list-card');

// let lastVersion = 0;
// let timeStamp = new Date().toLocaleString();
// let authorName = "Dr Gbemisola Bamiduro";

// RENDER FUNCTION
// const renderPost = (data) => {
//     const imgURL = data.fields['Hero-Img'];
//     const img = document.createElement('img');
//     featureArticle.style.backgroundImage = `linear-gradient(#09162200,#091622fe),url(${imgURL})`

//     title.textContent = data.fields.Title;
//     subTitle.textContent = data.fields['Sub-Title']
//     author.innerHTML = `<p><span>&#9654</span> Written by ${authorName}<p>`;

//     cardTitle.textContent = data.fields.Title;
//     cardSubTitle.textContent = data.fields['Sub-Title'];
//     cardArticle.style.backgroundImage = `linear-gradient(#09162200,#091622fe),url(${imgURL})`

// };

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
//     featureArticle.style.backgroundImage = `linear-gradient(#09162200,#091622fe),url(${imgURL})`;

//     title.textContent = data.fields.Title;
//     subTitle.textContent = data.fields['Sub-Title'];
//     author.innerHTML = `<p><span>&#9654</span> Written by ${authorName}<p>`;

//     cardTitle.textContent = data.fields.Title;
//     cardSubTitle.textContent = data.fields['Sub-Title'];
//     cardArticle.style.backgroundImage = `linear-gradient(#09162200,#091622fe),url(${imgURL})`;
// }

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

const featureArticle = document.getElementById("feature-article");
const featureLink = featureArticle.parentElement; // Grabs the surrounding <a> tag
const title = document.getElementById("title-index");
const subTitle = document.getElementById("subtitle-index");
const author = document.getElementById("author");
const storyGallery = document.getElementById("story_gallery");

const shareBtn = document.getElementById("share");

let authorName = "Dr Gbemisola Bamiduro";

// RENDER FUNCTION
const renderHomepage = (records) => {
  if (!records || records.length === 0) return;

  // 1. RENDER HERO SECTION (The absolute latest article)
  const latestPost = records[0];
  const heroImgURL = latestPost.fields["Hero-Img"];
  const heroSlug = latestPost.fields.Slug;

  featureArticle.style.backgroundImage = `linear-gradient(#09162200,#091622fe), url(${heroImgURL})`;
  title.textContent = latestPost.fields.Title;
  subTitle.textContent = latestPost.fields["Sub-Title"];
  author.innerHTML = `<p><span>&#9654</span> Written by ${authorName}</p>`;

  // Change link target to use clean slug routing
  featureLink.href = `/posts/${heroSlug}`;

  // 2. RENDER THE REST AS CARDS
  // Slice array to skip the first item
  const remainingPosts = records.slice(1);

  if (remainingPosts.length === 0) return;

  // Build the container HTML structures dynamically
  let galleryHTML = `
        <div class="container" id="more_stories">
            <div class="story-list-title">
                <h2>Read More Topics</h2>
            </div>
            <div class="article-list">
    `;

  remainingPosts.forEach((post) => {
    const fields = post.fields;
    const imgURL = fields["Hero-Img"];
    const slug = fields.Slug;

    galleryHTML += `
            <a href="/posts/${slug}" class="card-link" style="text-decoration: none; color: inherit;">
                <div class="article-list-card" style="background-image: linear-gradient(#09162200,#091622fe), url('${imgURL}')">
                    <h3 class="title-index-card">${fields.Title}</h3>
                    <p class="subtitle-index-card">${fields["Sub-Title"] || ""}</p>
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

/* initial load */
const loadHomepage = async () => {
  try {
    // Hits our new endpoint returning ALL items sorted by date
    const response = await fetch("http://localhost:3000/api/articles");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const records = await response.json();
    renderHomepage(records);
  } catch (err) {
    console.error("Failed to load homepage details:", err);
  }
};

//SHARE BUTTON
const initializeShareButton = () => {
  if (!shareBtn) return;

  shareBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: document.title,
      text: "Explore science, research, innovation, and education on Periodic Thoughts.",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Homepage link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  });
};

loadHomepage();
initializeShareButton();
