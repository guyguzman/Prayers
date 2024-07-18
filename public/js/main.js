let previousPrayerCategory = "";
let elementPrayerContainer = document.getElementById("prayerContainer");
let currentPrayerCategoryIndex = -1;
let prayerCategories = [];
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

window.onload = async function () {
  resetWidthHeight();
  // await loadPrayers();
  // await loadChaplets();
  // addEventListeners();
  loadSortedPrayers();
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

function loadSortedPrayers() {
  fetch(prayerFilepath)
    .then((response) => response.json())
    .then((json) => {
      let everything = json;
      let categoriesArray = Array.from(everything);
      let categoriesArraySorted = categoriesArray.sort(
        sortIntegerValues("sort")
      );
      categoriesArraySorted.forEach((category) => {
        let subCategoriesArray = Array.from(category.subCategories);
        let subCategoriesArraySorted = subCategoriesArray.sort(
          sortIntegerValues("sort")
        );
        subCategoriesArraySorted.forEach((subCategory) => {
          if (subCategory.display == true) createSubCategory(subCategory);
          // let prayersArray = Array.from(subCategory.prayers);
          // prayersArray.forEach((prayer) => {
          //   console.log(`      ${prayer.title}`);
          //   if (prayer.display == true) insertPrayer(prayer);
          // });
        });
        console.log(subCategoriesArray);
      });
      // let beautifyJSON = JSON.stringify(prayers[0], null, 4);
    });
}

async function createCategory(category) {}
async function createSubCategory(subCategory) {
  let divPrayerSubCategory = document.createElement("div");
  divPrayerSubCategory.className = "prayerSubCategory";
  let divPrayerSubCategoryTitle = document.createElement("div");
  divPrayerSubCategoryTitle.className = "prayerSubCategoryTitle";
  divPrayerSubCategoryTitle.innerHTML = `${subCategory.title}`;

  let divPrayerSubCategoryPrayers = document.createElement("div");
  divPrayerSubCategoryPrayers.className = "prayerSubCategoryPrayers";

  divPrayerSubCategory.appendChild(divPrayerSubCategoryTitle);
  divPrayerSubCategory.appendChild(divPrayerSubCategoryPrayers);
  prayerContainer.appendChild(divPrayerSubCategory);
  subCategory.prayers.forEach((prayer) => {
    console.log(`      ${prayer.title}`);
    insertPrayer(divPrayerSubCategoryPrayers, prayer);
  });
  return divPrayerSubCategoryPrayers;
}

async function insertPrayer(divPrayerSubCategoryPrayers, prayer) {
  // let divPrayerCategory = document.createElement("div");
  // let divPrayerCategoryTitle = document.createElement("div");
  // let divPrayerCategoryPrayers = document.createElement("div");
  let divPrayer = document.createElement("div");
  let divPrayerTitle = document.createElement("div");
  let divPrayerContent = document.createElement("div");

  let filePath = `prayers/${prayer.filename}`;

  fetch(filePath)
    .then((response) => response.text())
    .then((textString) => {
      let divFontawesomeExpand = document.createElement("i");
      let divFontawesomeShrink = document.createElement("i");
      let divExpandBox = document.createElement("div");
      let divShrinkBox = document.createElement("div");
      divFontawesomeExpand.className = "fa-light expand";
      divFontawesomeExpand.innerHTML = "&#xf31d;";
      divFontawesomeShrink.className = "fa-light expand";
      divFontawesomeShrink.innerHTML = "&#xf78c;";
      divExpandBox.className = "expandBox";
      divExpandBox.appendChild(divFontawesomeExpand);
      divShrinkBox.className = "shrinkBox";
      divShrinkBox.appendChild(divFontawesomeShrink);

      divExpandBox.style.display = "block";
      divShrinkBox.style.display = "none";

      divPrayer.className = "prayer";
      divPrayerTitle.className = "prayerTitle";
      divPrayerContent.className = "prayerContent";

      divPrayerTitle.innerHTML = `${prayer.title}`;
      divPrayerContent.innerHTML = textString;

      divPrayer.appendChild(divPrayerTitle);
      divPrayer.appendChild(divPrayerContent);

      divPrayerSubCategoryPrayers.appendChild(divPrayer);
      let prayerClientHeight = divPrayerContent.clientHeight;
      let prayerScrollHeight = divPrayerContent.scrollHeight;

      let scroll = false;
      if (prayerScrollHeight > prayerClientHeight) {
        scroll = true;
      }

      if (elementClientWidth > 500) {
        divPrayerContent.appendChild(divExpandBox);
        divPrayerContent.appendChild(divShrinkBox);

        divExpandBox.addEventListener("click", function () {
          elementOverlay.style.display = "grid";
          elementOverlayText.innerHTML = textString;
          overlayContentTitle.innerHTML = prayer.title;
        });
      }

      if (elementClientWidth <= 500) {
        if (scroll) {
          divPrayerContent.appendChild(divExpandBox);
          divPrayerContent.appendChild(divShrinkBox);
        }

        divExpandBox.addEventListener("click", function () {
          console.log("clicked expand on mobile");
          divPrayer.style.setProperty("max-Height", "initial");
          divPrayerContent.style.setProperty("max-Height", "initial");
          divExpandBox.style.display = "none";
          divShrinkBox.style.display = "block";
        });
        divShrinkBox.addEventListener("click", function () {
          console.log("clicked shrink on mobile");
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
    console.log("clicked hamburger");
    hamburger.classList.toggle("is-active");
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

function loadPrayers() {
  fetch(prayerFilepath)
    .then((response) => response.json())
    .then((json) => {
      let everything = json;
      let prayers = everything.prayers;
      console.log(prayers);
      let prayersSorted2 = prayers.sort(sortStringValues("category", "asc"));
      console.log(prayersSorted2);
      let prayersSorted = prayers.sort((a, b) => {
        const valueA = a.title.toUpperCase();
        const valueB = b.title.toUpperCase();
        if (valueA < valueA) {
          return -1;
        }
        if (valueA > valueB) {
          return 1;
        }
        return 0;
      });
      console.log(prayersSorted);
      prayersSorted.forEach((prayer) => {
        // console.log(prayer);
        if (prayer.display == true) insertPrayer(prayer);
      });
      let beautifyJSON = JSON.stringify(prayers[0], null, 4);
    });
}

function loadChaplets() {
  fetch(prayerFilepath)
    .then((response) => response.json())
    .then((json) => {
      let everything = json;
      let prayers = everything.chaplets;
      console.log(prayers);
      let prayersSorted2 = prayers.sort(sortStringValues("category", "asc"));
      console.log(prayersSorted2);
      let prayersSorted = prayers.sort((a, b) => {
        const valueA = a.title.toUpperCase();
        const valueB = b.title.toUpperCase();
        if (valueA < valueA) {
          return -1;
        }
        if (valueA > valueB) {
          return 1;
        }
        return 0;
      });
      console.log(prayersSorted);
      prayersSorted.forEach((prayer) => {
        // console.log(prayer);
        if (prayer.display == true) insertPrayer(prayer);
      });
      let beautifyJSON = JSON.stringify(prayers[0], null, 4);
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
