// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = 'gauciv';
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
let lastUpdateTime = new Date();

// Cache for GitHub API responses
const cache = {
    data: new Map(),
    timestamp: new Map(),
    maxAge: 5 * 60 * 1000 // 5 minutes cache
};

async function fetchWithCache(url, options = {}) {
    const now = Date.now();
    if (cache.data.has(url) && (now - cache.timestamp.get(url)) < cache.maxAge) {
        return cache.data.get(url);
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        cache.data.set(url, data);
        cache.timestamp.set(url, now);
        return data;
    } catch (error) {
        console.error('Error fetching from GitHub:', error);
        return null;
    }
}

async function getRepositoryStats(repoName) {
    const urls = {
        repo: `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}`,
        commits: `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/commits`,
        contributors: `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/contributors`
    };

    const [repoData, commitsData, contributorsData] = await Promise.all([
        fetchWithCache(urls.repo),
        fetchWithCache(urls.commits),
        fetchWithCache(urls.contributors)
    ]);

    if (!repoData) return null;

    return {
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        commits: commitsData?.length || 0,
        contributors: contributorsData?.length || 0,
        lastUpdate: new Date(repoData.updated_at).toLocaleDateString(),
        language: repoData.language,
        description: repoData.description
    };
}

function updateProjectCard(card, stats) {
    if (!stats) return;

    // Update metrics
    const metrics = {
        stars: stats.stars,
        forks: stats.forks,
        commits: stats.commits,
        contributors: stats.contributors
    };

    Object.entries(metrics).forEach(([type, value]) => {
        const metricElement = card.querySelector(`.metric[data-type="${type}"] .metric-value`);
        if (metricElement) {
            metricElement.textContent = value;
        }
    });

    // Update last update time
    const lastUpdateElement = card.querySelector('.metric[data-type="last-update"] .metric-value');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = stats.lastUpdate;
    }

    // Add language tag if not present
    if (stats.language) {
        const tagsContainer = card.querySelector('.project-tags');
        const languageTag = Array.from(tagsContainer.children).find(tag => 
            tag.textContent.toLowerCase() === stats.language.toLowerCase()
        );
        
        if (!languageTag) {
            const newTag = document.createElement('span');
            newTag.className = 'tag';
            newTag.textContent = stats.language;
            tagsContainer.appendChild(newTag);
        }
    }
}

async function refreshAllProjects() {
    const refreshButton = document.getElementById('refresh-projects');
    const lastUpdateTimeSpan = document.getElementById('last-update-time');
    const projectCards = document.querySelectorAll('.project-card');

    refreshButton.disabled = true;
    refreshButton.classList.add('refreshing');
    projectCards.forEach(card => card.classList.add('refreshing'));

    lastUpdateTimeSpan.textContent = 'Refreshing...';

    const updatePromises = [];
    projectCards.forEach(card => {
        const repoName = card.dataset.repo;
        if (repoName) {
            updatePromises.push(getRepositoryStats(repoName).then(repoData => {
                if (repoData) {
                    updateProjectCard(card, repoData);
                }
            }).catch(error => {
                console.error(`Error fetching stats for ${repoName}:`, error);
                // Optionally update card to show error or old data
            }));
        }
    });

    await Promise.all(updatePromises);

    const now = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    lastUpdateTimeSpan.textContent = now.toLocaleDateString('en-US', options);

    refreshButton.disabled = false;
    refreshButton.classList.remove('refreshing');
    projectCards.forEach(card => card.classList.remove('refreshing'));

    // Optionally trigger a fade-in effect for refreshed cards
    projectCards.forEach(card => {
        card.style.opacity = 0;
        setTimeout(() => { card.style.opacity = 1; }, 50);
    });
}

// Initialize refresh functionality
document.addEventListener('DOMContentLoaded', () => {
    const refreshButton = document.getElementById('refresh-projects');
    if (refreshButton) {
        refreshButton.addEventListener('click', refreshAllProjects);
    }

    // Initial refresh
    refreshAllProjects();

    // Set up auto-refresh
    setInterval(refreshAllProjects, AUTO_REFRESH_INTERVAL);

    // Add visibility change handler for auto-refresh when tab becomes visible
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            const timeSinceLastUpdate = Date.now() - lastUpdateTime;
            if (timeSinceLastUpdate > AUTO_REFRESH_INTERVAL) {
                refreshAllProjects();
            }
        }
    });
});
