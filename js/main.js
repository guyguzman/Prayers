import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

let previousPrayerCategory = "";
let elementPrayerContainer = document.getElementById("prayerContainer");
let currentPrayerCategoryIndex = -1;
let prayerCategories = [];
let elementMenu = document.getElementById("menuContainer");
let elementOverlay = document.getElementById("overlay");
let elementOverlayContent = document.getElementById("overlayContent");
let elementOverlayTitle = document.getElementById("overlayContentTitle");
let elementOverlayText = document.getElementById("overlayContentText");
let elementOverlayClose = document.getElementById("overlayClose");
let elementBackground = document.getElementById("background");
let windowInnerWidth;
let windowInnerHeight;
let elementClientWidth;
let elementClientHeight;
let elementOffsetWidth;
let elementOffsetHeight;
let elementHamburgerIcon = document.getElementById("hamburgerIcon");
let elementHamburger = document.getElementById("hamburger");
let prayerFilepath = "json/hierarchical.json";
let fontAwesomeExpandIcon = "&#xf31d;";
let fontAwesomeShrinkIcon = "&#xf78c;";
let fontAwesomePlusIcon = "&#xf067;";
let fontAwesomeMinusIcon = "&#xf068;";
let fontAwesomeChervronUp = "&#xf077;";
let fontAwesomeChervronDown = "&#xf078;";

let sizeExpandIconClass = "fa-sharp fa-solid expandShrink";
let sizeShrinkIconClass = "fa-sharp fa-solid expandShrink";
let sizeExpandIconContent = fontAwesomeChervronDown;
let sizeShrinkIconContent = fontAwesomeChervronUp;

let elementMenuContainer = document.getElementById("menuContainer");
let elementMenuList = document.getElementById("menuList");
let menuDimensions = elementMenu.getBoundingClientRect();
let prayerLinkSeed = 0;

let menuObjects = [];

window.onload = async function () {
  resetWidthHeight();
  addEventListeners();
  loadPrayers();
  window.scrollBy(0, 100);
};

function test() {
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "prayerFontSize=32";
  let x = document.cookie;
  console.log(x);
  processTextFile("prayers/Prayers_DivineWill_MomentOfDeath.txt");
}

function testSort() {
  fetch(prayerFilepath)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      let everything = json;
      // let prayers = everything.prayers;
      let categoriesArray = Array.from(everything);
      console.log(categoriesArray);
      let categoriesSorted = categoriesArray.sort(sortIntegerValues("sort"));
      console.log(categoriesSorted);
      categoriesSorted.forEach((category) => {
        console.log(category.title);
        let subCategoriesArray = Array.from(category.subCategories);
        subCategoriesArray.forEach((subCategory) => {
          console.log(`   ${subCategory.title}`);
          let prayersArray = Array.from(subCategory.prayers);
          prayersArray.forEach((prayer) => {
            console.log(`      ${prayer.title}`);
          });
        });
        console.log(subCategoriesArray);
      });
      // let beautifyJSON = JSON.stringify(prayers[0], null, 4);
    });
}

function loadPrayers() {
  fetch(prayerFilepath)
    .then((response) => response.json())
    .then((json) => {
      let menuItemsCategory = json;
      menuItemsCategory.sort(sortIntegerValues("sort"));
      menuItemsCategory.forEach((category) => {
        menuObjects.push(category);
        let divPrayerCategorySubCategories = createCategory(category);
        let subCategoriesArray = category.subCategories.sort(
          sortIntegerValues("sort")
        );
        subCategoriesArray.forEach((subCategory) => {
          if (subCategory.display == true)
            createSubCategory(divPrayerCategorySubCategories, subCategory);
        });
      });
    })
    .then(() => {
      console.log("Menu Objects");
      console.log(menuObjects);
    });
}

function displayMenuFromJson() {
  let now = new Date();
  let showCategoryEmpty = false;
  let showSubCategoryEmpty = false;
  fetch(prayerFilepath)
    .then((response) => response.json())
    .then((menuJson) => {
      let menuArray = Array.from(menuJson);
      let menuCategoriesSorted = menuArray.sort(sortIntegerValues("sort"));
      menuCategoriesSorted.forEach((category) => {
        let displayCategory = true;
        if (category.display === false) displayCategory = false;
        if (category.subCategories.length === 0) displayCategory = false;
        if (category.subCategories.length == 1) {
          if (category.subCategories[0].prayers.length === 0)
            displayCategory = false;
        }

        if (displayCategory || showCategoryEmpty) {
          appendMenuCategory(category);
        }

        let menuSubCategories = Array.from(category.subCategories);
        menuSubCategories = category.subCategories;
        let menuSubCategoriesSorted = menuSubCategories.sort(
          sortIntegerValues("sort")
        );

        menuSubCategoriesSorted.forEach((subCategory) => {
          let displaySubCategory = true;
          if (subCategory.display === false) displaySubCategory = false;
          if (subCategory.prayers.length === 0) displaySubCategory = false;
          if (displaySubCategory) {
            appendMenuSubCategory(subCategory);
          }
          let menuPrayers = subCategory.prayers;
          let menuPrayersSorted = menuPrayers.sort(sortIntegerValues("sort"));
          menuPrayersSorted.forEach((prayer) => {
            let displayPrayer = true;
            if (prayer.display === false) displayPrayer = false;
            if (displayPrayer) {
              appendMenuPrayer(prayer);
            }
          });
        });
      });
    })
    .then(() => {});
}

function displayMenu() {
  let now = new Date();
  let showCategoryEmpty = false;
  let showSubCategoryEmpty = false;
  {
    let menuArray = menuObjects;
    let menuCategoriesSorted = menuArray.sort(sortIntegerValues("sort"));
    menuCategoriesSorted.forEach((category) => {
      let displayCategory = true;
      if (category.display === false) displayCategory = false;
      if (category.subCategories.length === 0) displayCategory = false;
      if (category.subCategories.length == 1) {
        if (category.subCategories[0].prayers.length === 0)
          displayCategory = false;
      }

      if (displayCategory || showCategoryEmpty) {
        appendMenuCategory(category);
      }

      let menuSubCategories = Array.from(category.subCategories);
      menuSubCategories = category.subCategories;
      let menuSubCategoriesSorted = menuSubCategories.sort(
        sortIntegerValues("sort")
      );

      menuSubCategoriesSorted.forEach((subCategory) => {
        let displaySubCategory = true;
        if (subCategory.display === false) displaySubCategory = false;
        if (subCategory.prayers.length === 0) displaySubCategory = false;
        if (displaySubCategory) {
          appendMenuSubCategory(subCategory);
        }
        let menuPrayers = subCategory.prayers;
        let menuPrayersSorted = menuPrayers.sort(sortIntegerValues("sort"));
        menuPrayersSorted.forEach((prayer) => {
          let displayPrayer = true;
          if (prayer.display === false) displayPrayer = false;
          if (displayPrayer) {
            appendMenuPrayer(prayer);
          }
        });
      });
    });
  }
}

function appendMenuCategory(category, target) {
  let divMenuCategory = document.createElement("div");
  divMenuCategory.className = "menuItemCategory";
  divMenuCategory.onclick = function () {
    closeMenuThenScroll(target);
  };
  divMenuCategory.innerHTML = `${category.title}`;
  elementMenuList.appendChild(divMenuCategory);
}

function appendMenuSubCategory(subCategory, target) {
  let divMenuSubCategory = document.createElement("div");
  divMenuSubCategory.className = "menuItemSubCategory";
  divMenuSubCategory.innerHTML = `${subCategory.title}`;
  divMenuSubCategory.onclick = function () {
    closeMenuThenScroll(target);
  };
  elementMenuList.appendChild(divMenuSubCategory);
}

function appendMenuPrayer(prayer, target) {
  let divMenuPrayer = document.createElement("div");
  divMenuPrayer.className = "menuItemPrayer";
  divMenuPrayer.innerHTML = `${prayer.title}`;
  divMenuPrayer.onclick = function () {
    closeMenuThenScroll(target);
  };
  elementMenuList.appendChild(divMenuPrayer);
}

function createCategory(category) {
  let divPrayerCategory = document.createElement("div");
  divPrayerCategory.id = `menuItem_${prayerLinkSeed++}`;
  divPrayerCategory.className = "prayerCategory";
  let divPrayerCategoryTitle = document.createElement("div");
  divPrayerCategoryTitle.className = "prayerCategoryTitle";
  divPrayerCategoryTitle.innerHTML = `${category.title}`;
  let divPrayerCategorySubCategories = document.createElement("div");
  divPrayerCategorySubCategories.className = "prayerCategorySubCategories";
  divPrayerCategory.appendChild(divPrayerCategoryTitle);
  divPrayerCategory.appendChild(divPrayerCategorySubCategories);
  prayerContainer.appendChild(divPrayerCategory);

  category.target = divPrayerCategory;
  category.expanded = true;
  appendMenuCategory(category, divPrayerCategory);

  return divPrayerCategorySubCategories;
}

function createSubCategory(divPrayerCategorySubCategories, subCategory) {
  let divPrayerSubCategory = document.createElement("div");
  divPrayerSubCategory.id = `menuItem_${prayerLinkSeed++}`;
  divPrayerSubCategory.className = "prayerSubCategory";
  let divPrayerSubCategoryTitle = document.createElement("div");
  divPrayerSubCategoryTitle.className = "prayerSubCategoryTitle";
  divPrayerSubCategoryTitle.innerHTML = `${subCategory.title}`;

  let divPrayerSubCategoryPrayers = document.createElement("div");
  divPrayerSubCategoryPrayers.className = "prayerSubCategoryPrayers";

  divPrayerSubCategory.appendChild(divPrayerSubCategoryTitle);
  divPrayerSubCategory.appendChild(divPrayerSubCategoryPrayers);

  divPrayerCategorySubCategories.appendChild(divPrayerSubCategory);

  appendMenuSubCategory(subCategory, divPrayerSubCategory);
  subCategory.target = divPrayerSubCategory;
  subCategory.expanded = true;

  let subCategoryPrayersSorted = subCategory.prayers.sort(
    sortIntegerValues("sort")
  );

  subCategoryPrayersSorted.forEach((prayer) => {
    let divPrayer = insertPrayer(divPrayerSubCategoryPrayers, prayer);
    prayer.target = divPrayer;
    appendMenuPrayer(prayer, divPrayer);
  });

  return divPrayerSubCategoryPrayers;
}

function insertPrayer(divPrayerSubCategoryPrayers, prayer) {
  let divPrayer = document.createElement("div");
  divPrayer.id = `menuItem_${prayerLinkSeed++}`;
  let divPrayerContent = document.createElement("div");
  let divPrayerName = document.createElement("div");
  let divPrayerNameTitle = document.createElement("div");
  let divPrayerNameSubTitle = document.createElement("div");

  let filePath = `prayers/${prayer.filename}`;

  fetch(filePath)
    .then((response) => response.text())
    .then((html) => {
      divPrayer.className = "prayer";

      divPrayerName.className = "prayerName";
      divPrayerNameTitle.className = "prayerNameTitle";
      divPrayerNameSubTitle.className = "prayerNameSubTitle";
      divPrayerContent.className = "prayerContent";

      divPrayerNameTitle.innerHTML = `${prayer.title}`;
      divPrayerNameSubTitle.innerHTML = `${prayer.subTitle}`;
      divPrayerName.appendChild(divPrayerNameTitle);
      divPrayerName.appendChild(divPrayerNameSubTitle);

      divPrayerContent.innerHTML = html;

      divPrayer.appendChild(divPrayerName);
      divPrayer.appendChild(divPrayerContent);

      divPrayerSubCategoryPrayers.appendChild(divPrayer);
      let prayerClientHeight = divPrayerContent.clientHeight;
      let prayerScrollHeight = divPrayerContent.scrollHeight;

      let scroll = false;
      if (prayerScrollHeight > prayerClientHeight) {
        scroll = true;
      }

      // Add Expand/Shrink Functionality

      let divFontawesomeExpand = document.createElement("i");
      let divFontawesomeShrink = document.createElement("i");
      let divExpandBox = document.createElement("div");
      let divShrinkBox = document.createElement("div");
      divFontawesomeExpand.className = sizeExpandIconClass;
      divFontawesomeExpand.innerHTML = sizeExpandIconContent;

      divFontawesomeShrink.className = sizeExpandIconClass;
      divFontawesomeShrink.innerHTML = sizeShrinkIconContent;

      divExpandBox.className = "expandBox";
      divExpandBox.appendChild(divFontawesomeExpand);
      divShrinkBox.className = "shrinkBox";
      divShrinkBox.appendChild(divFontawesomeShrink);

      divExpandBox.style.display = "block";
      divShrinkBox.style.display = "none";

      // if (elementClientWidth > 500) {
      //   divPrayerContent.appendChild(divExpandBox);
      //   divPrayerContent.appendChild(divShrinkBox);

      //   divExpandBox.addEventListener("click", function () {
      //     elementOverlay.style.display = "grid";
      //     elementOverlayText.innerHTML = textString;
      //     overlayContentTitle.innerHTML = prayer.title;
      //   });
      // }

      // Both Desktop and Mobile display using shrink/expand

      if (elementClientWidth >= 0) {
        if (scroll) {
          divPrayerContent.appendChild(divExpandBox);
          divPrayerContent.appendChild(divShrinkBox);
        }

        divExpandBox.addEventListener("click", function () {
          divPrayer.style.setProperty("max-Height", "initial");
          divPrayerContent.style.setProperty("max-Height", "initial");
          divExpandBox.style.display = "none";
          divShrinkBox.style.display = "block";
        });
        divShrinkBox.addEventListener("click", function () {
          divPrayer.style.setProperty("max-Height", "400px");
          divPrayerContent.style.setProperty("max-Height", "300px");
          divExpandBox.style.display = "block";
          divShrinkBox.style.display = "none";
        });
      }
    });

  return divPrayer;
}
function addEventListeners() {
  elementHamburger.addEventListener("click", function () {
    hamburger.classList.toggle("is-active");
    let menuVisible = elementHamburger.classList.contains("is-active");

    if (menuVisible) {
      openMenu();
    }

    if (!menuVisible) {
      closeMenu();
    }
  });
}

function openMenu() {
  // elementMenuContainer.style.zIndex = 100;
  gsap.to(elementMenu, { duration: 0.5, right: 0 });
}

async function closeMenu() {
  gsap
    .to(elementMenu, {
      duration: 0.5,
      right: menuDimensions.width * -1,
    })
    .then(() => {});
}

async function closeMenuThenScroll(target) {
  hamburger.classList.toggle("is-active");
  await closeMenu();
  target.scrollIntoView();
  window.scrollBy(0, -90);
}

function scrollTo(element) {
  element.scrollIntoView();
}

async function processTextFile(filename) {
  getTextFile(filename).then((textString) => {
    console.log(textString);
  });
}

async function getTextFile(filename) {
  fetch(filename)
    .then((response) => response.text())
    .then((textString) => {
      return textString;
    });
}

function sortIntegerValues(key, order = "asc") {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}

function sortStringValues(key, order = "asc") {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    let varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    let varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}

function resetWidthHeight() {
  windowInnerWidth = window.innerWidth;
  windowInnerHeight = window.innerHeight;
  elementClientWidth = document.documentElement.clientWidth;
  elementClientHeight = document.documentElement.clientHeight;
  elementOffsetWidth = document.documentElement.offsetWidth;
  elementOffsetHeight = document.documentElement.offsetHeight;

  let vh = windowInnerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  let vw = elementClientWidth * 0.01;
  document.documentElement.style.setProperty("--vw", `${vw}px`);
}
