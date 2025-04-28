document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById('toggle-btn');
    const body = document.body;
    const darkMode = localStorage.getItem('dark-mode');
    const search = document.querySelector('.header .flex .search-form');
    const profile = document.querySelector('.header .flex .profile');
 
    // Use consistent class name: 'dark-mode'
    const enableDarkMode = () => {
        toggleBtn?.classList.replace('fa-sun', 'fa-moon');
        body.classList.add('dark-mode');
        localStorage.setItem('dark-mode', 'enabled');
    }
 
    const disableDarkMode = () => {
        toggleBtn?.classList.replace('fa-moon', 'fa-sun');
        body.classList.remove('dark-mode');
        localStorage.setItem('dark-mode', 'disabled');
    }
 
    if (darkMode === 'enabled') {
        enableDarkMode();
    }
 
    toggleBtn?.addEventListener("click", () => {
        const currentMode = localStorage.getItem('dark-mode');
        if (currentMode === 'enabled') {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
 
    document.getElementById('user-btn')?.addEventListener("click", () => {
        profile?.classList.toggle('active');
        search?.classList.remove('active');
    });
 });
 
