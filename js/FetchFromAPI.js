export default class FetchFromAPI {
    constructor() {}

    searchMealByName = async (name) => {
        const fetchMeals = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
        );
        const data = await fetchMeals.json();
        const { meals } = data;
        return meals;
    };

    listAllMealsByFirstLetter = async (letter) => {
        const fetchMeals = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
        );
        const data = await fetchMeals.json();

        const { meals } = data;
        return meals;
    };

    listAllCategories = async () => {
        const fetchCategories = await fetch(
            'https://www.themealdb.com/api/json/v1/1/categories.php'
        );
        const data = await fetchCategories.json();

        const { categories } = data;
        return categories;
    };

    filterByCategory = async (category) => {
        const fetchMeals = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
        );

        const data = await fetchMeals.json();

        const { meals } = data;
        return meals;
    };

    listAllAreas = async () => {
        const fetchAreas = await fetch(
            'https://www.themealdb.com/api/json/v1/1/list.php?a=list'
        );
        const data = await fetchAreas.json();

        const { meals } = data;
        return meals;
    };
    filterByArea = async (area) => {
        const fetchMeals = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
        );

        const data = await fetchMeals.json();
        const { meals } = data;
        return meals;
    };

    listAllIngredient = async () => {
        const fetchAreas = await fetch(
            'https://www.themealdb.com/api/json/v1/1/list.php?i=list'
        );
        const data = await fetchAreas.json();

        const { meals } = data;
        return meals;
    };
    filterByIngredient = async (area) => {
        const fetchMeals = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${area}`
        );

        const data = await fetchMeals.json();
        const { meals } = data;
        return meals;
    };
}
