import ApiHelper from './apiHelpers.js';

const apiHelper = new ApiHelper();

const getMeals = async (name) => {
    const data = await apiHelper.searchMealByName(name);
    const meals = data.meals;
    return meals;
};

const display = async () => {
    const mealsElement = document.querySelector('#meals');
    const meals = await getMeals('');
    console.log(meals);

    let mealsBox = '';

    meals.forEach((meal) => {
        mealsBox += `
        <div class="col-md-6 col-lg-4 col-xl-3">
            <div class="meal position-relative">
                <img
                    src="${meal.strMealThumb}"
                    alt="meal"
                    class="w-100 bg-danger rounded"
                />
                <div
                    class="meal-overlay position-absolute w-100 h-100 bg-white bg-opacity-75"
                >
                    <h2>${meal.strMeal}</h2>
                </div>
            </div>
        </div>
        `;
    });

    mealsElement.innerHTML = mealsBox;
};
display();
