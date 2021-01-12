/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/




/**
TASKS:
    [x] Navigation is built dynamically as an unordered list.
    [x] It should be clear which section is being viewed while scrolling through the page.
    [x] When clicking an item from the navigation menu, the link should scroll to the appropriate section.

Suggestions:
    [x] Add an active state to your navigation items when a section is in the viewport.
    [] Hide fixed navigation bar while not scrolling (it should still be present on page load).
    [] Hint: setTimeout can be used to check when the user is no longer scrolling.
    [] Add a scroll to top button on the page that’s only visible when the user scrolls below the fold of the page.
    [] Update/change the design/content.
    [] Make sections collapsible.
 */





/**
 * Define Global Variables
 * 
*/
history.scrollRestoration = "manual";

const navigationBar = document.getElementById('navbar__list');
const navigationMenuLink = document.querySelectorAll('menu__link');
const sectionsAll = document.querySelectorAll('section');
let currentActive = false;


/**
 * End Global Variables
 * Start Helper Functions
 * 
*/
function checkViewport(element) {
    const clientRect = element.getBoundingClientRect();
    return (
        clientRect.top >= 0 &&
        clientRect.left >= 0 &&
        clientRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        clientRect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function addActiveClass(section, className) {
    section.classList.add(className);
    section.style.cssText = "background-color: #1d191940; border-radius: 10px;";
}

function removeActiveClass(section, className) {
    section.classList.remove(className);
    section.style.cssText = "";
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// build the nav

function createNavigationBar() {
    const navigationStack = document.createDocumentFragment();

    for (const section of sectionsAll) {
        const sectionId = section.id;
        const sectionName = section.dataset.nav;

        const listTab = document.createElement('li');
        const tabLink = document.createElement('a');

        tabLink.innerText = sectionName;
        tabLink.classList = 'menu__link';
        tabLink.href = `#${sectionId}`;
        tabLink.id = `${sectionId}_link`;
        const idas = `${sectionId}_link`;

        listTab.appendChild(tabLink);
        navigationStack.appendChild(listTab);
    }
    navigationBar.appendChild(navigationStack);
}

// Add class 'active' to section when near top of viewport

function checkActiveView() {
    for (const section of sectionsAll) {
        const sectionId = section.id;
        const updateMenuTab = `${sectionId}_link`;

        if (checkViewport(section)) {
            currentActive = sectionId;
            addActiveClass(section, 'your-active-class');

            addActiveStateLink(updateMenuTab);
        }
        else {
            if (currentActive !== section.id) {
                removeActiveClass(section, 'your-active-class');
                removeActiveStateLink(updateMenuTab);
            }

        }
    }
}


// Scroll to anchor ID using scrollTO event

function changeScrollBehavior() {
    // scroll into view
    const selectHTML = document.querySelector('html');
    selectHTML.style.cssText = "scroll-behavior: smooth;";
}

function scrollToTopPage() {
    const pageHref = window.location.href;
    if (pageHref.indexOf('#')) {
        var noHashURL = pageHref.replace(/#.*$/, '');
        window.history.replaceState('', document.title, noHashURL);
    }
    window.scrollTo(0, 0);
}





function addActiveStateLink(current) {
    const currentTab = document.getElementById(current);
    currentTab.classList.add("active");
}

function removeActiveStateLink(current) {
    //for (const tab of navigationMenuLink) {
    //if (tab.id != current) {
    const currentTab = document.getElementById(current);

    currentTab.classList.remove("active");
    // }
    //}
}


//function menuLinkActiveTab


function disableScrollbar() { 
    setTimeout(function() { 
        //document.body.style.overflow = 'hidden';

        body.classList.add("hide-scroll-bar");
    }, 2000); 
} 

function enableScrollbar() { 
    body.classList.remove("hide-scroll-bar");
} 



/**
 * End Main Functions
 * Begin Events
 *
*/
changeScrollBehavior();

// Build menu 
createNavigationBar();

// Scroll to section on link click



// Set sections as active
window.addEventListener('scroll', checkActiveView);

