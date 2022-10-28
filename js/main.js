import FetchFromAPI from './FetchFromAPI.js';
const api = new FetchFromAPI();

$(document).ready(function () {
    let allMeals = [];
    let allCategories = [];
    let mealObj;
    let allAreas = [];
    let allIngredients = [];
    const mealsElement = document.querySelector('#meals');

    const getMealsByName = async (name) => {
        toggleSidebar();
        mainLinksClickHandler();

        allMeals = await api.searchMealByName(name);
        dispaly(mealsElement, allMeals);
    };
    getMealsByName('');
    $('#loading').fadeOut(1000);

    // * Sidebar
    function toggleSidebar() {
        let sideBarBox = $('#sidebarLinks').innerWidth();
        $('#sidebar').css('left', `-${sideBarBox}px`);
        $('#toggleMenuIcon').click(() => {
            if ($('#sidebar').css('left') == '0px') {
                $('#sidebar').animate({ left: `-${sideBarBox}` }, 1000);
                $('.nav-item').slideUp(800);
                $('#toggleMenuIcon').addClass('fa-bars ');
                $('#toggleMenuIcon').removeClass('fa-xmark ');
            } else {
                $('#sidebar').animate({ left: '0px' }, 800);
                $('.nav-item').slideDown(1000);
                $('#toggleMenuIcon').addClass('fa-xmark ');
                $('#toggleMenuIcon').removeClass('fa-bars ');
            }
        });
    }

    // * *********************
    // * MEALS
    // * *********************
    function dispaly(element, arr, isCategory = false) {
        let box = ``;

        let info = ['idMeal', 'strMealThumb', 'strMeal'];

        let p = '';
        if (isCategory === true) {
            info = [
                'idCategory',
                'strCategoryThumb',
                'strCategory',
                'strCategoryDescription',
            ];
        }

        arr.forEach((ele) => {
            isCategory
                ? (p = `<p class="lead fw-bold px-3">${ele[info[3]].slice(
                      0,
                      75
                  )}... </p>`)
                : (p = '');
            box += `
                <div class="col-md-6 col-lg-4 col-xl-3">
                    <div class="meal position-relative" id="${ele[info[2]]}">
                        <img
                            src="${ele[info[1]]}"
                            alt="meal"
                            class="w-100 rounded"
                        />
                        <div
                            class="meal-overlay position-absolute w-100 h-100 bg-white 
                            d-flex flex-column justify-content-center text-center
                            bg-opacity-75"
                        >
                            <h2 class="fw-bolder">${ele[info[2]]}</h2>
                            ${p}
                        </div>
                    </div>
                </div>
            
            `;
        });
        element.innerHTML = box;

        getClickedItem(isCategory);
    }

    const getClickedItem = async (isCategory) => {
        $('.meal').click(async function (e) {
            const mealElement = $(e.target).parents('.meal')[0];
            if (isCategory) {
                changeSectionAnimation('#categories', '#mealsSection');
                const categoryMeals = await api.filterByCategory(
                    mealElement.id
                );

                dispaly(mealsElement, categoryMeals);
            } else {
                changeSectionAnimation('#mealsSection', '#mealDetailsSection');
                getMealDetails(mealElement.id);
            }
        });
    };

    function changeSectionAnimation(currentSection, goingTo, section = false) {
        if (section == true) {
            $(currentSection).fadeOut(800);
            $(goingTo).slideDown(2000);
            return;
        }
        $(currentSection).fadeOut(1000, function () {
            $(goingTo).slideDown(2000);
        });
    }

    async function getMealDetails(mealId) {
        mealObj = await api.searchMealByName(mealId);
        mealObj = await mealObj[0];

        displayMealDetail();
    }

    function displayMealDetail() {
        const ingredients = getIngredients(mealObj);
        const tags = getTags(mealObj);

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
    }

    function getIngredients(mealObj) {
        let ingredients = [];

        for (let i = 1; i <= 20; i++) {
            if (mealObj[`strIngredient${i}`] !== '') {
                ingredients.push(
                    `${mealObj[`strMeasure${i}`]} ${
                        mealObj[`strIngredient${i}`]
                    }`
                );
            }
        }

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

        return ingredients;
    }

    function getTags(mealObj) {
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

        return tags;
    }

    function mainLinksClickHandler() {
        $('a[href^="#"]').click(function (e) {
            const linkHref = $(e.target).attr('href');
            const currentSection = `#${$(linkHref)[0].id}`;
            const allSections = $('section[id]');
            changeSectionAnimation(allSections, currentSection, true);

            switch (currentSection) {
                case '#search':
                    getSearchMeals();
                    break;
                case '#categories':
                    getCategories();
                    break;

                case '#area':
                    getAreas();
                    break;

                case '#ingredients':
                    getIngredientsList();
                    break;
                case '#contactUs':
                    showContactUs();
                    break;
            }
        });
    }

    // * ************************
    //  * Search
    // * ************************
    let searchedMeals = document.getElementById('searchedMeals');

    function getSearchMeals() {
        document
            .getElementById('mealNameInput')
            .addEventListener('input', function (e) {
                searchByName(e.target.value);
            });
        document
            .getElementById('mealLetterInput')
            .addEventListener('input', function (e) {
                searchByLetter(e.target.value);
            });
    }

    async function searchByName(value) {
        allMeals = await api.searchMealByName(value);

        if (allMeals != null) {
            dispaly(searchedMeals, allMeals);
        }
    }

    async function searchByLetter(value) {
        allMeals = await api.listAllMealsByFirstLetter(value);

        if (allMeals != null) {
            dispaly(searchedMeals, allMeals);
        }
    }
    // * ************************
    //  * Categories
    // * ************************
    async function getCategories() {
        allCategories = await api.listAllCategories();
        const row = document.querySelector('#category');
        dispaly(row, allCategories, true);
    }

    // * ************************
    //  * Area
    // * ************************
    async function getAreas() {
        allAreas = await api.listAllAreas();
        dispalyAreas();
    }

    function dispalyAreas() {
        let areabox = ``;
        for (let i = 0; i < allAreas.length; i++) {
            areabox += `
            <div class="col-6 text-white">
                <div class="area text-center" id="${allAreas[i].strArea}">
                    <i
                        class="fa-solid fa-city fa-3x text-warning mb-2"
                    ></i>
                    <h2>${allAreas[i].strArea}</h2>
                </div>
            </div>
            `;
        }
        document.getElementById('areaBox').innerHTML = areabox;

        getClickedArea();
    }

    function getClickedArea() {
        $('.area').click(function (e) {
            const areabox = $(e.target).parents('.area')[0];

            filterMealsByArea(areabox.id);
        });
    }

    async function filterMealsByArea(areaStr) {
        allMeals = await api.filterByArea(areaStr);

        changeSectionAnimation('#area', '#mealsSection');
        dispaly(mealsElement, allMeals);
    }

    // * ************************
    //  * Ingredients
    // * ************************
    async function getIngredientsList() {
        allIngredients = await api.listAllIngredient();

        dispalyIngredients();
    }

    function dispalyIngredients() {
        let box = ``;

        for (let i = 0; i < 20; i++) {
            box += `
                <div class="col-md-6">
                    <div class="ingredient text-white text-center">
                        <i
                            class="fa-solid fa-bowl-food fa-4x text-success"
                        ></i>
                        <h2 class="fw-bolder mt-1">${
                            allIngredients[i].strIngredient
                        }</h2>
                        <p>
                            ${allIngredients[i].strDescription.slice(0, 120)}..
                        </p>
                    </div>
                </div>

            `;
        }

        document.querySelector('#ingredientsBox').innerHTML = box;

        getClickedIngredient();
    }

    function getClickedIngredient() {
        $('.ingredient').click(function (e) {
            const ingredient = $(e.target).parents('.ingredient')[0];

            filterMealsByIngredient(ingredient.id);
        });
    }

    async function filterMealsByIngredient(ingredientStr) {
        allMeals = await api.filterByIngredient(ingredientStr);

        changeSectionAnimation('#ingredients', '#mealsSection');
        dispaly(mealsElement, allMeals);
    }

    function showContactUs() {
        const nameInput = document.querySelector('#nameInput');
        const emailInput = document.querySelector('#emailInput');
        const phoneInput = document.querySelector('#phoneInput');
        const ageInput = document.querySelector('#ageInput');
        const passwordInput = document.querySelector('#passwordInput');
        const passwordConfInput = document.querySelector('#passwordConfInput');

        const nameReg = /^[a-zA-Z ]+$/;
        const emailReg =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const phoneReg = /^(002)?01[0125][0-9]{8}$/;
        const ageReg = /^[1-9][0-9]?$|^100$/;
        const passwordReg = /^[a-zA-Z ]+$/;

        validateUserInputValue(nameInput, nameReg);
        validateUserInputValue(emailInput, emailReg);
        validateUserInputValue(phoneInput, phoneReg);
        validateUserInputValue(ageInput, ageReg);
        validateUserInputValue(passwordInput, passwordReg);
    }

    function testRegex(userInput, regEx) {
        return regEx.test(userInput);
    }

    let confPass = $('#passwordConfInput');
    let pass = $('#passwordInput');

    function validateUserInputValue(userInput, regex) {
        userInput.addEventListener('input', function (e) {
            if (testRegex(e.target.value, regex)) {
                $(`#${e.target.id}`).addClass('is-valid border-success ');
                $(`#${e.target.id}`).removeClass('border-danger');
                $(`#${e.target.id}`).next().addClass('d-none');
                $(`#${e.target.id}`).next().removeClass('d-block');

                checkPasswordsMatch();
                toggleSumitBtnVisability();
            } else {
                $(`#${e.target.id}`).addClass('border-danger ');
                $(`#${e.target.id}`).removeClass('is-valid border-success');
                $(`#${e.target.id}`).next().removeClass('d-none');
                $(`#${e.target.id}`).next().addClass('d-block');

                checkPasswordsMatch();
                toggleSumitBtnVisability();
            }
            return testRegex(e.target.value, regex);
        });
    }

    function checkPasswordsMatch() {
        document
            .getElementById('passwordConfInput')
            .addEventListener('input', function () {
                if (confPass.val() == pass.val()) {
                    $('#passwordConfInput').addClass(
                        'is-valid border-success '
                    );
                    $('#passwordConfInput').removeClass(' border-danger ');
                } else {
                    $('#passwordConfInput').addClass('border-danger ');
                    $('#passwordConfInput').removeClass(
                        'is-valid border-success '
                    );
                }
            });
    }

    function toggleSumitBtnVisability() {
        if ($('.is-valid').length === 6) {
            document.getElementById('submit').removeAttribute('disabled');
        } else {
            document.getElementById('submit').setAttribute('disabled', 'true');
        }
    }
});

// function userNameValid() {
//     return /^[a-zA-Z ]+$/.test(userName.value)
// }

// function userEmailValid() {
//     return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(userEmail.value)
// }

// function userPhoneValid() {
//     return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(userPhone.value)
// }

// function userAgeValid() {
//     return /^[1-9][0-9]?$|^100$/.test(userAge.value)
// }

// function userPasswordValid() {
//     return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(userPassword.value)
// }

// function userRePasswordValid() {
//     return userPassword.value == userRePassword.value
// }
