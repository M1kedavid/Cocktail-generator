const searchBtn = document.querySelector("#search-btn");
const cocktailList = document.querySelector("#cocktail-list");
const drinkDetails = document.querySelector(".modal-content");

searchBtn.addEventListener("click", getCocktails);
cocktailList.addEventListener("click", getDrinkRecipe);

async function getCocktails() {
  let input = document.querySelector("#search-input").value.trim();
  const response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${input}`
  );
  let data;
  try {
    data = await response.json();
  } catch (err) {
    console.log("error", err);
  }
  if (data) {
    let html = `<h2 class="text-light">We found ${data.drinks.length} cocktails!</h2>`;
    if (data.drinks) {
      data.drinks.forEach((drink) => {
        html += `
            <div class="col-md-4 col-6 mt-2" data-id = "${drink.idDrink}">
              <div class="card text-center text-bg-dark ">
                <img src=${drink.strDrinkThumb} alt="card-img-top" class="rounded-top">
                <div class="card-body">
                  <h5 class="card-title">${drink.strDrink}</h5>
                  <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-outline-secondary recipe-btn">More details</button>
                </div>
              </div>
            </div>
          `;
      });
    }
    cocktailList.innerHTML = html;
  } else {
    cocktailList.innerHTML = `<h2 class="text-light">Sorry, we couldn't find any results!</h2>`;
  }
}

async function getDrinkRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let drink = e.target.parentElement.parentElement.parentElement;
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.dataset.id}`
    );
    const data = await response.json();
    drinkModal(data.drinks);
  }
}

function drinkModal(drink) {
  drink = drink[0];

  let ingridients = "";
  for (let i = 1; i <= 15; i++) {
    if (drink[`strIngredient${i}`]) {
      ingridients += `<li>${drink[`strIngredient${i}`]} ${
        drink[`strMeasure${i}`] ? drink[`strMeasure${i}`] : " "
      }</li>`;
    }
  }

  let html = `
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="exampleModalLabel">${drink.strDrink}</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <h3><b>Ingredients:</b></h3>
      <ul>
        ${ingridients}
      </ul>
      <h3><b>Recommended glass type:</b><br>${drink.strGlass}</h3>
      <h3><b>Instructions:</b></h3>
      <p>${drink.strInstructions}</p>
    </div>`;
  drinkDetails.innerHTML = html;
}
