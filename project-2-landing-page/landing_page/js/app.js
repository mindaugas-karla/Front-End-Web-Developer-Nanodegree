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
    [] Update/change the design/content.
    [x] Make sections collapsible.
 */





/**
 * Define Global Variables
 * 
*/
history.scrollRestoration = "manual";
const rootElement = document.documentElement;
const navigationHeader = document.querySelector('.page__header');

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


function showScroller() {
    // Do something on scroll
    const scrollUpId = document.getElementById("scrollerToTop");
    var scrollTotal = rootElement.scrollHeight - rootElement.clientHeight
    if ((rootElement.scrollTop / scrollTotal) > 0.3) {
        // Show button
        scrollUpId.classList.remove("scroll-hide");
    }
    else {
        // Hide button
        scrollUpId.classList.add("scroll-hide");
    }
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
        tabLink.dataset.idas= `${sectionId}`;

        tabLink.onclick = function() { toggleSection(this, 'link') };


        

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
    showScroller();
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

function createScroller() {
    const scrollerDiv = document.createElement('div');
    scrollerDiv.id = "scrollerToTop";
    scrollerDiv.classList = "scroll-element scroll-hide noselect pointerCursor";
    scrollerDiv.onclick = function () {scrollToTopPage()};
    const scrollerSpan = document.createElement('span');
    scrollerSpan.innerText = "UP";
    scrollerDiv.appendChild(scrollerSpan);

    const applyToHeader = document.querySelector('header');

    document.body.appendChild(scrollerDiv);

}

createScroller();



function disableScrollbar() {
    setTimeout(function () {
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

let timerForHeaderDisplay;

function showMenu () {
    navigationHeader.classList.remove("hide-menu-bar");
    clearTimeout(timerForHeaderDisplay);
    timerForHeaderDisplay = setTimeout(function () {
        navigationHeader.classList.add("hide-menu-bar");
    }, 2500);
}

function toggleSection (test, type) {
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
function createSectionCollabsibleBar() {
    //const customisedSection = document.createDocumentFragment();

    for (const section of sectionsAll) {
        const sectionId = section.id;
        const sectionName = section.dataset.nav;

        const titleCustom = section.querySelector('h2');
        titleCustom.dataset.idas = sectionId;
        titleCustom.classList.add("pointerCursor");
        titleCustom.onclick = function() { toggleSection(this, 'section') };

        //titleCustom.addEventListener("click", (event) => {
            //section.classList.toggle("collapse-section");
           //const name = section.dataset.nav;
            //console.log(event.dataset.idas);

                   //titleCustom.
//alert(123);
         // });




        titleCustom.innerHTML = "";

        const spanName = document.createElement('span');
        spanName.innerText = sectionName;
        
        const spanCollapse = document.createElement('span');
        spanCollapse.innerText = ' - Opened';
        
        titleCustom.appendChild(spanName);
        titleCustom.appendChild(spanCollapse);

        //customisedSection.appendChild(titleCustom);
        //`<span>${sectionName}</span> <span class="collapse_section">Collapse</span>`;
    }

}
createSectionCollabsibleBar ();

// Set sections as active
window.addEventListener('scroll', checkActiveView);


window.addEventListener('scroll', showMenu);

