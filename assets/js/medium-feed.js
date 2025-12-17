const MEDIUM_RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@karurpabe';

const fallbacks = [
    'images/cyber_transformer.png',
    'images/cyber_federated.png',
    'images/cyber_cognitive.png'
];

async function fetchMediumPosts() {
    try {
        const response = await fetch(MEDIUM_RSS_URL);
        const data = await response.json();

        if (data.status === 'ok') {
            const posts = data.items.slice(0, 3); // Get top 3
            const container = document.getElementById('medium-posts');

            if (!container) return;

            container.innerHTML = ''; // Clear loading state or static content

            posts.forEach((post, index) => {
                const article = document.createElement('article');

                // Extract image from content if thumbnail is missing (Medium RSS quirk)
                let imageUrl = post.thumbnail;
                if (!imageUrl) {
                    const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
                    imageUrl = imgMatch ? imgMatch[1] : fallbacks[index % fallbacks.length];
                }

                // Format Categories
                const category = post.categories.length > 0 ? post.categories[0] : 'Tech Blog';
                const date = new Date(post.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

                // Text Truncation
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = post.description; // Description is often a snippet
                const text = tempDiv.textContent || tempDiv.innerText || '';
                const snippet = text.length > 120 ? text.substring(0, 120) + '...' : text;

                article.innerHTML = `
                    <header>
                        <span class="date">${date} &bull; ${category}</span>
                        <h2><a href="${post.link}" target="_blank">${post.title}</a></h2>
                    </header>
                    <a href="${post.link}" target="_blank" class="image fit"><img src="${imageUrl}" alt="${post.title}" onerror="this.src='${fallbacks[index % fallbacks.length]}'"/></a>
                    <p>${snippet}</p>
                    <ul class="actions special">
                        <li><a href="${post.link}" target="_blank" class="button">Read Full Story</a></li>
                    </ul>
                `;

                container.appendChild(article);
            });

            // Add Scrollex/Reveal effect to new elements
            if (window.jQuery && window.jQuery().scrollex) {
                $('.posts > article').scrollex({
                    onEnter: function () {
                        $(this).addClass('visible');
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error fetching Medium feed:', error);
        // Optional: Leave static content or show error message
    }
}

// Init
document.addEventListener('DOMContentLoaded', fetchMediumPosts);
