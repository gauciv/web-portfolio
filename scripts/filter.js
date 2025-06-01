document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    const projects = document.querySelectorAll('.project-card');
    const projectCountElement = document.querySelector('.project-count');

    function updateProjectCount(count, total) {
        projectCountElement.textContent = `Showing ${count} of ${total} projects`;
    }

    function filterProjects(category) {
        let visibleCount = 0;
        projects.forEach(project => {
            const shouldShow = category === 'all' || project.dataset.category === category;
            project.style.opacity = '0';
            project.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                project.style.display = shouldShow ? 'flex' : 'none';
                if (shouldShow) {
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                        visibleCount++;
                        updateProjectCount(visibleCount, projects.length);
                    }, 50);
                }
            }, 300);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProjects(button.dataset.filter);
        });
    });

    // Initial count
    updateProjectCount(projects.length, projects.length);
});

// Metrics Legend Functionality
document.addEventListener('DOMContentLoaded', function() {
    const legendButton = document.getElementById('metrics-legend');
    const metricsTooltip = document.getElementById('metrics-tooltip');
    const closeTooltip = document.querySelector('.close-tooltip');
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'tooltip-overlay';
    document.body.appendChild(overlay);

    function showTooltip() {
        metricsTooltip.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideTooltip() {
        metricsTooltip.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    legendButton.addEventListener('click', showTooltip);
    closeTooltip.addEventListener('click', hideTooltip);
    overlay.addEventListener('click', hideTooltip);

    // Close tooltip on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && metricsTooltip.classList.contains('active')) {
            hideTooltip();
        }
    });
});
