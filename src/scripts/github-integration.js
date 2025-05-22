async function fetchGitHubData(username, repo) {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}`);
        if (!response.ok) throw new Error('Failed to fetch repository data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        return null;
    }
}

async function updateProjectMetrics(projectElement, username, repo) {
    const data = await fetchGitHubData(username, repo);
    if (!data) return;

    const metrics = projectElement.querySelector('.project-metrics');
    if (metrics) {
        metrics.innerHTML = `
            <div class="metric">
                <span class="metric-icon">⭐</span>
                <span class="metric-value">${data.stargazers_count}</span>
            </div>
            <div class="metric">
                <span class="metric-icon">🔀</span>
                <span class="metric-value">${data.forks_count}</span>
            </div>
            <div class="metric">
                <span class="metric-icon">👁️</span>
                <span class="metric-value">${data.watchers_count}</span>
            </div>
        `;
    }

    // Update project status
    const statusElement = projectElement.querySelector('.project-status');
    if (statusElement) {
        statusElement.textContent = data.archived ? 'Archived' : 'Active';
        statusElement.classList.toggle('archived', data.archived);
    }

    // Update last updated date
    const dateElement = projectElement.querySelector('.project-date');
    if (dateElement) {
        const lastUpdate = new Date(data.updated_at);
        dateElement.textContent = lastUpdate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const projects = document.querySelectorAll('.project-card[data-github]');
    projects.forEach(project => {
        const [username, repo] = project.dataset.github.split('/');
        updateProjectMetrics(project, username, repo);
    });
});
