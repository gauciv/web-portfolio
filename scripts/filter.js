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
