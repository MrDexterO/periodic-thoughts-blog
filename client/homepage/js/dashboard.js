const title = document.getElementById('title');
const subTitle = document.getElementById('sub-title');
const heroImage = document.getElementById('hero-img');
const body = document.querySelector('.writing-canvas');

const save = document.getElementById('save');
const post = document.getElementById('post');
const displaySect = document.querySelector('.display-sect');

// Create elements for live preview
let h1_el = document.createElement('h1');
let h2_el = document.createElement('h2');
let img_el = document.createElement('img');

img_el.setAttribute('width', '100%');
img_el.setAttribute('id', 'hero-image');

displaySect.appendChild(h1_el);
displaySect.appendChild(h2_el);
displaySect.appendChild(img_el);

function updateH1() {
    h1_el.textContent = title.value || '';
}

function updateH2() {
    h2_el.textContent = subTitle.value || '';
}

function updateImage() {
    img_el.setAttribute('src', heroImage.value || '');
}

function updateBody() {
    // Clear out previously typed paragraphs from the right div before adding updated ones
    const oldParagraphs = displaySect.querySelectorAll('.body-paragraph');
    oldParagraphs.forEach(p => p.remove());

    // Use innerText instead of textContent to accurately read line breaks from contentEditable
    const lines = body.innerText.split('\n');

    lines.forEach(lineText => {
        // Build individual paragraph segments
        let body_el = document.createElement('p');
        body_el.classList.add('body-paragraph');
        body_el.textContent = lineText;
        body_el.style.marginBottom = '0.25em';

        displaySect.appendChild(body_el);
    });
}

// Live updates
title.addEventListener('input', updateH1);
subTitle.addEventListener('input', updateH2);
heroImage.addEventListener('input', updateImage);
body.addEventListener('input', updateBody);

// Initial render
updateH1();
updateH2();
updateImage();
updateBody();

// Gather current values into a uniform request body object
function getPayload() {
    return {
        Title: title.value,
        Subtitle: subTitle.value,
        Image: heroImage.value,
        Body: body.innerText
    };
}

/* -------------------- Save Draft Event -------------------- */
save.addEventListener('click', () => {
    fetch('/save-json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(getPayload())
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error sending data:', error);
            alert('Failed to save file. Make sure your server is running!');
        });
});

/* -------------------- Publish Post Event -------------------- */
post.addEventListener('click', async () => {
    try {
        const res = await fetch('/post-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getPayload())
        });

        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        alert(data.message);

        // Redirect to live article index page after posting
        window.location.href = '/';
    } catch (err) {
        console.error(err);
        alert('Post failed');
    }
});
