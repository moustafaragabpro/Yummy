import ApiHelper from './apiHelper.js';

const apiHelper = new ApiHelper();

const getMeals = async (name) => {
    const data = await apiHelper.searchMealByName(name);
    const meals = data.meals;
    return meals;
};

let allMeals = [];

const display = async (search) => {
    const mealsElement = document.querySelector('#meals');
    allMeals = await getMeals(search);

    let mealsBox = '';

    allMeals.forEach((meal) => {
        mealsBox += `
        <div class="col-md-6 col-lg-4 col-xl-3">
            <div class="meal position-relative" id='${meal.idMeal}'>
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

    const meal = document.getElementsByClassName('meal');
    const mealsArr = [...meal];

    console.log(mealsArr);

    for (let i = 0; i < mealsArr.length; i++) {
        mealsArr[i].addEventListener('click', function (e) {
            const mealId = $(e.target).parent()[0].id;
            $('#mealsSection').fadeOut(100, () => {
                $('#mealDetailsSection').slideDown(100);
            });

            displayMealDetail(mealId);
        });
    }
};

display('');

const displayMealDetail = (mealId) => {
    let mealObj = allMeals.find((meal) => meal.idMeal == mealId);

    let ingredients = [];
    let tags =
        mealObj.strTags != null ? mealObj.strTags.split(',') : ['No Tags'];

    tags = tags
        .map((tag) => {
            return `
        <span
            class="alert alert-warning py-1 me-2 d-inline-block"
        >
            ${tag}</span
        >
        
        `;
        })
        .join('');

    for (let i = 0; i < 20; i++) {
        if (mealObj[`strIngredient${i}`] !== '') {
            ingredients.push(
                `${mealObj[`strMeasure${i}`]} ${mealObj[`strIngredient${i}`]}`
            );
        }
    }
    ingredients.shift();
    console.log(ingredients);

    ingredients = ingredients
        .map((item) => {
            return `
        <span
            class="alert alert-success py-1 me-2 d-inline-block"
        >
            ${item}</span
        >
        `;
        })
        .join('');

    let mealDetailsBox = `
        <div class="meal-header">
            <img
                src="${mealObj.strMealThumb}"
                alt="Meal"
                class="meal-main-img"
            />
            <h2 class="fw-bolder my-3">${mealObj.strMeal}</h2>
        </div>

        <div class="desc">
            <h2>Instructions</h2>
            <p>
                ${mealObj.strInstructions}
            </p>

            <p>
                <span class="fw-bold">Area : </span>
                <span id="area">${mealObj.strArea}</span>
            </p>
            <p class="p-0">
                <span class="fw-bold">Category : </span>
                <span id="area">${mealObj.strCategory}</span>
            </p>

            <h2 class="mt-4 mb-3">Recipes :</h2>
            <div id="recipes">
            ${ingredients}
            </div>

            <h2 class="mt-4 mb-3">Tags :</h2>
            <div id="tags">
                ${tags}
            </div>

            <div class="meal-links mt-2 mb-5">
                <a href="${mealObj.strSource}" class="btn btn-success">Source</a>
                <a href="${mealObj.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>
        </div>
    
    `;

    document.getElementById('mealDetails').innerHTML = mealDetailsBox;
};

const inWidth = $('#sidebarMenu').innerWidth();
let offs = $('#sidebarMenu').offset().left;

offs = -inWidth;
$('#sidebarMenu').animate({ left: offs });
$('#side').animate({ left: offs });

const switchSideBar = () => {
    // $('#sidebar').addCss('left', -inWidth);
    $('#menu').click(function () {
        switchIcon();

        offs = offs == 0 ? -inWidth : 0;
        sidebarAnimation(offs);
    });
};

const switchIcon = () => {
    $('#menuIcon').toggleClass('fa-bars');
    $('#menuIcon').toggleClass('fa-xmark');
};

const sidebarAnimation = (offset) => {
    if (offset == 0) {
        $('#sidebarMenu').animate({ left: offset });
        $('#side').animate({ left: offset });
        $('#sidebarMenu').css('dispaly', 'block');
        $('.nav-item').slideToggle(1000);
    } else {
        $('#sidebarMenu').animate({
            left: offset,
        });
        $('#sidebarMenu').css('dispaly', 'none');
        $('#side').animate({ left: offset });
        $('.nav-item').slideToggle(1000);
    }
};

switchSideBar();
