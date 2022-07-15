
function getActiveNav(allNavs) {
    return Array.from(allNavs).find((navA) => {
        return navA.href === location.href;
    });
}

function activateSectionWithActiveLink() {
    const allNavs = document.querySelectorAll('nav a');
    const activeLink = getActiveNav(allNavs);
    const parentSection = activeLink.closest('details');
    if (!parentSection) {
        return;
    }
    parentSection.toggleAttribute('open', true);
    allNavs.forEach(function (link) {
        const li = link.closest('li');
        if (li) {
            li.classList.remove('active');
        }
    });
    const activeLinkLi = activeLink.closest('li');
    if (activeLinkLi) {
        activeLinkLi.classList.add('active');
    }
}

function delayNavActivation(){
    setTimeout(activateSectionWithActiveLink, 500)
}
window.addEventListener('hashchange', activateSectionWithActiveLink);
window.addEventListener('load', delayNavActivation);
