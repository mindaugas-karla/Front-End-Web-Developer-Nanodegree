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
    [x] Hide fixed navigation bar while not scrolling (it should still be present on page load).
    [x] Hint: setTimeout can be used to check when the user is no longer scrolling.
    [x] Add a scroll to top button on the page that’s only visible when the user scrolls below the fold of the page.
    [x] Update/change the design/content. +-
    [x] Make sections collapsible.
 */

 /**
  Requires Changes:
    [x] You are required to use the ES6 variable keywords let & const instead of var to be following the JavaScript Style Guide.
    [x] Suggestions:
        - change 2500 value to higher,
        - improve your skills in using Markdown syntax.
    [+/-] Your code doesn’t apply styles to the active state correctly.
    ....../-    I really couldn't find whats wrong, all console.log echo's shows expected result,
                but I still correct logic just a little bit, please don't let me pass this submission if still something wrong.
                I checked https://www.w3schools.com/howto/howto_js_active_element.asp , but my idea was to make some kind carousel,
                now added css transition to highlight it. (style.css .active 233)
    [+/-] It should be clear which section is being viewed while scrolling through the page.
    .......-    Mb this is relatedd with previous check, because everything highligts, or I don't understand something, or mb I fixe with previous update.
    [x] All features are usable across modern desktop, tablet, and phone browsers.
    As required per the project specifications, this item will be checked after all features applied.
    .......-    Added some tweeks for mobile view. 
  */


/**
 * Define Global Variables
 * 
*/
//const startingTime = performance.now();
history.scrollRestoration = "manual";

const rootElement = document.documentElement;
const navigationHeader = document.querySelector('.page__header');
const navigationBar = document.getElementById('navbar__list');
const navigationMenuLink = document.querySelectorAll('menu__link');
const sectionsAll = document.querySelectorAll('section');

//let currentActive = false; //laggedd, so changed to live preview.
let timerForHeaderDisplay;

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

function showScroller() {
    const scrollUpId = document.getElementById("scrollerToTop");
    const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight
    if ((rootElement.scrollTop / scrollTotal) > 0.3) {
        //show button
        scrollUpId.classList.remove("scroll-hide");
    }
    else {
        //hide button
        scrollUpId.classList.add("scroll-hide");
    }
}

function addActiveStateLink(current) {
    const currentTab = document.getElementById(current);
    currentTab.classList.add("active");
}

function removeActiveStateLink(current) {
    const currentTab = document.getElementById(current);
    currentTab.classList.remove("active");
}

function toggleSection(test, type) {
    const secId = test.dataset.idas;
    const sectionCollapse = document.getElementById(secId);
    const statuschange = sectionCollapse.querySelectorAll('span')[1];
    if (type == "link") {
        if (sectionCollapse.classList.contains("collapse-section")) {
            sectionCollapse.classList.toggle("collapse-section");
            statuschange.innerText = " - Opened";
        }
    }
    else {
        sectionCollapse.classList.toggle("collapse-section");

        if (sectionCollapse.classList.contains("collapse-section")) {
            statuschange.innerText = " - Closed";
        }
        else {
            statuschange.innerText = " - Opened";
        }
    }
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// Build the Navigation
function createNavigationBar() {
    const navigationStack = document.createDocumentFragment();

    for (const section of sectionsAll) {
        const sectionId = section.id;
        const sectionName = section.dataset.nav;

        const listTab = document.createElement('li');
        const tabLink = document.createElement('a');

        tabLink.innerText = sectionName.toUpperCase();
        tabLink.classList = 'menu__link noselect pointerCursor';
        tabLink.href = `#${sectionId}`;
        tabLink.id = `${sectionId}_link`;
        tabLink.dataset.idas = `${sectionId}`;

        tabLink.onclick = function () { toggleSection(this, 'link') };

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
        var currentActive = document.querySelector('your-active-class'); // Added live selector for lag issue


        if (checkViewport(section)) {
           // currentActive = sectionId;
            if (!section.classList.contains("collapse-section")) {
                addActiveClass(section, 'your-active-class');
                //console.log("add!");
           
            }
           
            addActiveStateLink(updateMenuTab);
            //console.log("add2!");

        }
        else {
            if (currentActive !== section.id) {
                removeActiveClass(section, 'your-active-class');
                removeActiveStateLink(updateMenuTab);
                //console.log("remove!");
            }
        }
    }
}

// Changing html begaviour
function changeScrollBehavior() {
    // scroll into view
    // testing udacity lesson information
    const selectHTML = document.querySelector('html');
    selectHTML.style.cssText = "scroll-behavior: smooth;";
}

// Scroll to top button on the page
function scrollToTopPage() {
    const pageHref = window.location.href;
    if (pageHref.indexOf('#')) {
        const noHashURL = pageHref.replace(/#.*$/, '');
        window.history.replaceState('', document.title, noHashURL);
    }
    window.scrollTo(0, 0);
}

// Build Scroller
function createScroller() {
    const scrollerDiv = document.createElement('div');
    scrollerDiv.id = "scrollerToTop";
    scrollerDiv.classList = "scroll-element scroll-hide noselect pointerCursor";
    scrollerDiv.onclick = function () { scrollToTopPage() };
    const scrollerSpan = document.createElement('span');
    scrollerSpan.innerText = "UP";
    scrollerDiv.appendChild(scrollerSpan);

    const applyToHeader = document.querySelector('header');

    document.body.appendChild(scrollerDiv);
}

// Build Hide Menu Option
function showMenu() {
    navigationHeader.classList.remove("hide-menu-bar");
    clearTimeout(timerForHeaderDisplay);
    timerForHeaderDisplay = setTimeout(function () {
        navigationHeader.classList.add("hide-menu-bar");
    }, 3500); // Increased value as suggested :)
}

// Build Collabsible
function createSectionCollabsibleBar() {
    for (const section of sectionsAll) {
        const sectionId = section.id;
        const sectionName = section.dataset.nav;

        const titleCustom = section.querySelector('h2');
        titleCustom.dataset.idas = sectionId;
        titleCustom.classList.add("pointerCursor");
        titleCustom.onclick = function () { toggleSection(this, 'section') };

        titleCustom.innerHTML = "";

        const spanName = document.createElement('span');
        spanName.innerText = sectionName;

        const spanCollapse = document.createElement('span');
        spanCollapse.innerText = ' - Opened';

        titleCustom.appendChild(spanName);
        titleCustom.appendChild(spanCollapse);
    }
}

/**
 * End Main Functions
 * Begin Events
 *
*/
// Change Behaviour for Smooth Anchor Scrolling
changeScrollBehavior();

// Create Menu 
createNavigationBar();

// Create Scroller (moved here)
createScroller();

// Activate Scroller
showScroller();


// Activate Collabsible Future
createSectionCollabsibleBar();

// Activate Scrolling Monitor
window.addEventListener('scroll', checkActiveView);

// Activate Menu Hide Than not scrolling
window.addEventListener('scroll', showMenu);

/**
 * Performance Test
 *
*/
//const endingTime = performance.now();
//console.log('This code took ' + (endingTime - startingTime) + ' milliseconds.');

