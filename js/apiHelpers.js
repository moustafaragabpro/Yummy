export default class ApiHelper {
    constructor() {}

    searchMealByName = async (name) => {
        let fetchMeals = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
        );
        const data = await fetchMeals.json();
        return data;
    };

    ListAllMealsByFirstLetter = async (letter) => {
        let fetchMeals = await fetch(
            `www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
        );
        const meal = await fetchMeals.json();
        console.log(meal);
        return meal;
    };
}
