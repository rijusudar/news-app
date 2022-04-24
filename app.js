const newsCategoryWrapperEle = document.querySelector('.main__left-pane');
const highlightNewsWrapperEle = document.querySelector('.news__highlights-items');
const docFrag = document.createDocumentFragment();
const modal = document.getElementById("newsModal");
const modalDetailsEle = document.querySelector('.modal__details');
const closeEle = document.getElementsByClassName("close")[0];

let featuredData;
let newsData;

const insertAfter = (referenceNode, newNode) => {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function fetchArticles() {
  fetch('./resources/data.json')
    .then(response => response.json())
    .then(data => {
      newsData = data;
      data && data.map(category => {
        const leftPaneCategoryDiv = document.createElement("div");
        const leftPaneSectionWrapperdiv = document.createElement("div");
        leftPaneCategoryDiv.classList.add("left-pane__contents");
        leftPaneCategoryDiv.setAttribute("id", category.catId);

        const markupCategory = `
          <span class="news__seperator"></span>
          <div class="news__category-title-wrapper">
            <h3 class="news__main-title">${category.catName}</h3>
          </div>
        `;

        leftPaneCategoryDiv.innerHTML = markupCategory;

        category && category.sections.map(section => {
          const leftPaneSectiondiv = document.createElement("div");
          leftPaneSectiondiv.classList.add("left-pane__item");
          leftPaneSectiondiv.setAttribute("id", section.sectionId);
          const markup = `
            <h4 class="left-pane__item-title">${section.sectionName}</h4>
            <figure class="news__figure" id="${section.hero.heroId}" onclick="getHeroDetails(this)">
              <img
                class="news__figure-img"
                src="${section.hero.imgUrl}"
                alt="news-img"
              />
              <p class="news__figure-descr">
                ${section.hero.title}
              </p>
            </figure>
          `;

          leftPaneSectiondiv.innerHTML = markup;

          section.articles && section.articles.map(article => {
            const divArticle = document.createElement("div");
            divArticle.classList.add("news__article");
            divArticle.setAttribute("id", article.articleId);
            divArticle.addEventListener('click', getArticles)
            const articleMarkup = `
              <p class="news__figure-descr">
                ${article.articleTitle}
              </p>
            `;
            divArticle.innerHTML = articleMarkup;
            leftPaneSectiondiv.appendChild(divArticle);


          });

          leftPaneSectionWrapperdiv.classList.add("left-pane__items");

          leftPaneSectionWrapperdiv.appendChild(leftPaneSectiondiv);

        });
        insertAfter(leftPaneCategoryDiv.childNodes[3], leftPaneSectionWrapperdiv)

        docFrag.appendChild(leftPaneCategoryDiv)
      });
      newsCategoryWrapperEle.appendChild(docFrag);




    }).catch(err => {
      // Do something for an error here
    });
}

const fetchHighlightNews = () => {
  fetch('./resources/featured-news.json')
    .then(response => response.json())
    .then(data => {
      data && data.map(item => {
        featuredData = data;
        const rightPaneNewsList = document.createElement("li");
        rightPaneNewsList.classList.add("news__highlights-item");
        const hightlightMarkup = `
          <a id="${item.featuredId}" class="highlight-news__link" onclick="getDetails(this)">
            <div class="hightlight__content">
              <figcaption class="hightlight__descr">
                ${item.title}
              </figcaption>
            </div>
            <figure class="highlight__figure">
              <img
                class="highlight__img"
                src="${item.imgSrc}"
              />
            </figure>
          </a>
        `;
        rightPaneNewsList.innerHTML = hightlightMarkup;
        docFrag.appendChild(rightPaneNewsList);
      });
      highlightNewsWrapperEle.appendChild(docFrag);
    }).catch(err => {
      // Do something for an error here
    });
}

const getModalMarkup = (imgSrc, details, title) => {
  let modalMarkup;
  if (imgSrc && details && title) {
    modalMarkup = `
      <img
        src="${imgSrc}"
        alt="${title}"
        class="modal__image"
      />
      <p class="modal__decr">
      ${details}
      </p>
    `;
  } else {
    modalMarkup = `
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
        alt="no-img"
        class="modal__image"
      />
      <p class="modal__decr">
        No data available!
      </p>
    `;
  }
  return modalMarkup;
}

const getDetails = event => {
  const getId = event.id;
  const selectedItem = featuredData.filter(item => item.featuredId === Number(getId));
  modalDetailsEle.innerHTML = getModalMarkup(selectedItem[0].imgSrc, selectedItem[0].details, selectedItem[0].title);
  modal.style.display = "block";
}

const getArticles = event => {
  const getTarget = event && event.target;
  const articleId = Number(getTarget.parentElement.id);
  fetch('./resources/news-details.json')
    .then(response => response.json())
    .then(data => {
      const selectedData = data && data.filter(item => item.articleId === articleId);
      if (selectedData[0]) {
        modalDetailsEle.innerHTML = getModalMarkup(selectedData[0].articleSrc, selectedData[0].articleDescr, selectedData[0].articleTitle);
      }
      modal.style.display = "block";
    }).catch(err => {
      // Do something for an error here
    });
}

const getHeroDetails = event => {
  const heroId = Number(event.id);
  fetch('./resources/news-hero.json')
    .then(response => response.json())
    .then(data => {
      const selectedHeroData = data && data.filter(item => item.heroId === heroId);
      if (selectedHeroData[0]) {
        modalDetailsEle.innerHTML = getModalMarkup(selectedHeroData[0].imgUrl, selectedHeroData[0].details, selectedHeroData[0].title);
      }
      modal.style.display = "block";
    }).catch(err => {
      // Do something for an error here
    });
}


closeEle.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function init() {
  fetchArticles();
  fetchHighlightNews();
}

init();
