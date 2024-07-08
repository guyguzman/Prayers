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

console.log("main.js");

window.onload = async function () {
  resetWidthHeight();
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "prayerFontSize=32";
  let x = document.cookie;
  console.log(x);
  processTextFile("prayers/Prayers_DivineWill_MomentOfDeath.txt");
  // await loadPrayers();
  await loadChaplets();

  elementOverlayClose.addEventListener("click", function () {
    elementOverlay.style.display = "none";
    elementBackground.style.display = "grid";
    elementPrayerContainer.style.display = "grid";
  });
};

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
  fetch("json/prayers.json")
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
  fetch("json/prayers.json")
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

async function insertPrayer(prayer) {
  let divPrayerCategory = document.createElement("div");
  let divPrayerCategoryTitle = document.createElement("div");
  let divPrayerCategoryPrayers = document.createElement("div");
  let divPrayer = document.createElement("div");
  let divPrayerTitle = document.createElement("div");
  let divPrayerContent = document.createElement("div");

  if (prayer.category !== previousPrayerCategory) {
    currentPrayerCategoryIndex += 1;
    previousPrayerCategory = prayer.category;
    divPrayerCategory.className = "prayerCategory";
    divPrayerCategoryTitle.className = "prayerCategoryTitle";
    divPrayerCategoryPrayers.className = "prayerCategoryPrayers";
    divPrayerCategoryTitle.innerHTML = `${prayer.category}`;
    divPrayerCategory.appendChild(divPrayerCategoryTitle);
    divPrayerCategory.appendChild(divPrayerCategoryPrayers);
    prayerContainer.appendChild(divPrayerCategory);
    prayerCategories.push(divPrayerCategoryPrayers);
  } else {
    divPrayerCategoryPrayers = prayerCategories[currentPrayerCategoryIndex];
  }

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

      divPrayerCategoryPrayers.appendChild(divPrayer);
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

      return textString;
    });
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
