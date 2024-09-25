// medium-github-integration.js

// Replace with your Medium username and GitHub username
const MEDIUM_USERNAME = 'karurpabe';
const GITHUB_USERNAME = 'RavinduPabasara';

// Fetch Medium posts
async function fetchMediumPosts() {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${MEDIUM_USERNAME}`);
    const data = await response.json();
    return data.items.filter(item => item.categories.length > 0).slice(0, 3); // Get the latest 3 posts, excluding any that are responses to other articles
}

// Fetch GitHub projects
async function fetchGitHubProjects() {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=3`);
    return await response.json();
}

// Create Medium post HTML
function createMediumPostHTML(post) {
    const postDate = new Date(post.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `
        <article>
            <header>
                <span class="date">${postDate}</span>
                <h2><a href="${post.link}" target="_blank">${post.title}</a></h2>
            </header>
            <a href="${post.link}" class="image fit medium-img" target="_blank">
                <img src="${post.thumbnail}" alt="${post.title}" />
            </a>
            <p>${post.description.replace(/<img[^>]*>/g, "").slice(0, 150)}...</p>
            <ul class="actions special">
                <li><a href="${post.link}" class="button" target="_blank">Read More</a></li>
            </ul>
        </article>
    `;
}

// Create GitHub project HTML
function createGitHubProjectHTML(project) {
    const updatedDate = new Date(project.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `
        <article>
            <header>
                <span class="date">Last updated: ${updatedDate}</span>
                <h2><a href="${project.html_url}" target="_blank">${project.name}</a></h2>
            </header>
            <p>${project.description || 'No description available.'}</p>
            <ul class="actions special">
                <li><a href="${project.html_url}" class="button" target="_blank">View on GitHub</a></li>
            </ul>
        </article>
    `;
}

// Populate Medium posts
async function populateMediumPosts() {
    const posts = await fetchMediumPosts();
    const mediumSection = document.getElementById('medium-posts');
    if (posts.length > 0) {
        posts.forEach(post => {
            mediumSection.insertAdjacentHTML('beforeend', createMediumPostHTML(post));
        });
    } else {
        mediumSection.insertAdjacentHTML('beforeend', '<p>No articles found.</p>');
    }
}

// Populate GitHub projects
async function populateGitHubProjects() {
    const projects = await fetchGitHubProjects();
    const githubSection = document.getElementById('github-projects');
    if (projects.length > 0) {
        projects.forEach(project => {
            githubSection.insertAdjacentHTML('beforeend', createGitHubProjectHTML(project));
        });
    } else {
        githubSection.insertAdjacentHTML('beforeend', '<p>No projects found.</p>');
    }
}

// Run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    populateMediumPosts();
    populateGitHubProjects();
});