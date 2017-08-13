const API_ID = 'c7e7b1dd'
const APP_KEY = '13487accdaf2c75d26435d1fdf4b1835'

export function fetchRecipes (food = '') {
  	food = food.trim()

  	return fetch(`https://api.edamam.com/search?q=${food}&app_id=${API_ID}&app_key=${APP_KEY}`)
    	.then((res) => res.json())
    	.then(({ hits }) => hits.map(({ recipe }) => recipe))
}