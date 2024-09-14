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

let elementMenuList = document.getElementById("menuList");

window.onload = async function () {
  resetWidthHeight();
  // await loadPrayers();
  // await loadChaplets();
  addEventListeners();
  loadPrayers();
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
      let everything = json;
      let categoriesArray = Array.from(everything);
      let categoriesArraySorted = categoriesArray.sort(
        sortIntegerValues("sort")
      );
      categoriesArraySorted.forEach((category) => {
        let divPrayerCategorySubCategories = createCategory(category);
        let subCategoriesArray = Array.from(category.subCategories);
        let subCategoriesArraySorted = subCategoriesArray.sort(
          sortIntegerValues("sort")
        );
        subCategoriesArraySorted.forEach((subCategory) => {
          if (subCategory.display == true)
            createSubCategory(divPrayerCategorySubCategories, subCategory);
        });
        // console.log(subCategoriesArray);
      });
      // let beautifyJSON = JSON.stringify(prayers[0], null, 4);
    });
}

function createCategory(category) {
  let divPrayerCategory = document.createElement("div");
  divPrayerCategory.className = "prayerCategory";
  let divPrayerCategoryTitle = document.createElement("div");
  divPrayerCategoryTitle.className = "prayerCategoryTitle";
  divPrayerCategoryTitle.innerHTML = `${category.title}`;
  let divPrayerCategorySubCategories = document.createElement("div");
  divPrayerCategorySubCategories.className = "prayerCategorySubCategories";
  divPrayerCategory.appendChild(divPrayerCategoryTitle);
  divPrayerCategory.appendChild(divPrayerCategorySubCategories);
  prayerContainer.appendChild(divPrayerCategory);
  // console.log(divPrayerCategory);
  let divMenuCategory = document.createElement("div");
  divMenuCategory.className = "menuItemCategory";
  divMenuCategory.innerHTML = `${category.title}`;
  elementMenuList.appendChild(divMenuCategory);
  return divPrayerCategorySubCategories;
}

function createSubCategory(divPrayerCategorySubCategories, subCategory) {
  let divPrayerSubCategory = document.createElement("div");
  divPrayerSubCategory.className = "prayerSubCategory";
  let divPrayerSubCategoryTitle = document.createElement("div");
  divPrayerSubCategoryTitle.className = "prayerSubCategoryTitle";
  divPrayerSubCategoryTitle.innerHTML = `${subCategory.title}`;

  let divPrayerSubCategoryPrayers = document.createElement("div");
  divPrayerSubCategoryPrayers.className = "prayerSubCategoryPrayers";

  divPrayerSubCategory.appendChild(divPrayerSubCategoryTitle);
  divPrayerSubCategory.appendChild(divPrayerSubCategoryPrayers);
  divPrayerCategorySubCategories.appendChild(divPrayerSubCategory);

  let divMenuSubCategory = document.createElement("div");
  divMenuSubCategory.className = "menuItemSubCategory";
  divMenuSubCategory.innerHTML = `${subCategory.title}`;
  elementMenuList.appendChild(divMenuSubCategory);

  subCategory.prayers.forEach((prayer) => {
    insertPrayer(divPrayerSubCategoryPrayers, prayer);
  });

  return divPrayerSubCategoryPrayers;
}

function insertPrayer(divPrayerSubCategoryPrayers, prayer) {
  let divPrayer = document.createElement("div");
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

      // Add to Menu

      let divMenuPrayer = document.createElement("div");
      divMenuPrayer.className = "menuItemPrayer";
      divMenuPrayer.innerHTML = `${prayer.title}`;
      elementMenuList.appendChild(divMenuPrayer);

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
}
function addEventListeners() {
  elementHamburger.addEventListener("click", function () {
    hamburger.classList.toggle("is-active");
    let menuVisible = elementHamburger.classList.contains("is-active");
    let menuDimensions = elementMenu.getBoundingClientRect();
    console.log(menuDimensions);

    if (menuVisible) {
      gsap.to(elementMenu, { duration: 0.5, right: 0 });
    }

    if (!menuVisible) {
      gsap.to(elementMenu, {
        duration: 0.5,
        right: menuDimensions.width * -1,
      });
    }
  });

  elementOverlayClose.addEventListener("click", function () {
    elementOverlay.style.display = "none";
    elementBackground.style.display = "grid";
    elementPrayerContainer.style.display = "grid";
  });
}

async function processTextFile(filename) {
  console.log(filename);
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
