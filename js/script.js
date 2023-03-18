const form = document.forms["form-search"];
const btn = form["form-btn"];
let search = form["search"];
let tempLi = document.createElement("li");
const ulResults = document.querySelector(".results__list");
let found = 0;
search.onfocus = () => {
  search.style.border = "none";
};

btn.onclick = (event) => {
  if (search.value.length < 256 && (search.value == "" || search.value.length > 2)) {
    getRepos();
  } else {
    search.style.border = "5px solid red";
  }
};

search.onkeypress = (event) => {
  if (event.keyCode == 13) {
    event.preventDefault();
    if (search.value.length < 256 && (search.value == "" || search.value.length > 2)) {
      getRepos();
      
    } else {
      search.style.border = "5px solid red";
    }
  }
};
async function getRepos() {
  const url = "https://api.github.com/search/repositories?q=stars:>1000";
  const response = await fetch(url);
  const result = await response.json();
  let look = search.value.toLowerCase();
  ulResults.innerHTML = "";
  found = 0;
  console.log(result);
  result.items.forEach((element) => {
    tempLi = document.createElement("li");
    tempLi.classList.add("results__item");
    let topicList = "";
    for (let i = 0; i < element.topics.length; i++) {
      let topic = document.createElement("code");
      topic.innerHTML = `${element.topics[i]}`;
      topicList += topic.outerHTML;
    }
    if (topicList == "") {
      console.log(topicList);
      topicList = "<p>none</p>";
    }
    let repoName = element.full_name.toLowerCase();
    if (repoName.includes(look)) {
      found++;

      tempLi.innerHTML = `
        <div class="results__left">
            <div class="results__owner-img">
                <img src=" ${element.owner.avatar_url}" alt="avatar">
            </div>
            <div class="results__watcher">${element.stargazers_count}</div>
        </div>
        <div class="results__right">
            <a href="${element.clone_url}" class="results__owner-name"  target="_blank" >${element.owner.login}</a>
            <p class="results__repo-name">${element.name}</p>
        <div class="results__topics"><span>Topics: </span>${topicList}</div>
    </div>`;

      ulResults.appendChild(tempLi);
    }
  });
  if (found == 0) {
    ulResults.innerHTML = "<div class='error'>Ничего не найдено</div>";
  }
}
