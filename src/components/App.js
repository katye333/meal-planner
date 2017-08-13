import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addRecipe, removeFromCalendar } from '../actions'
import { capitalize } from '../utils/helpers'
import CalendarIcon from 'react-icons/lib/fa/calendar-plus-o'
import Modal from 'react-modal'
import ArrowRightIcon from 'react-icons/lib/fa/arrow-circle-right'
import Loading from 'react-loading'
import { fetchRecipes } from '../utils/api'
import FoodList from './FoodList'
import ShoppingList from './ShoppingList'

// const API_ID = 'c7e7b1dd'
// const APP_KEY = '13487accdaf2c75d26435d1fdf4b1835'

class App extends Component {
    // local state
    state = {
        foodModalOpen: false,
        meal: null,
        day: null,
        food: null,
        loadingFood: false,
        ingredientsModalOpen: false
    }
    openFoodModal = ({ meal, day }) => {
        this.setState(() => ({
            foodModalOpen: true,
            meal,
            day
        }))
    }
    closeFoodModal = () => {
        this.setState(() => ({
            foodModalOpen: false,
            meal: null,
            day: null,
            food: null
        }))
    }
    searchFood = (e) => {
        if (!this.input.value) {
            return;
        }
        e.preventDefault();
        this.setState(() => ({ loadingFood: true }))

        fetchRecipes(this.input.value)
            .then((food) => this.setState(() => ({
                food,
                loadingFood: false
            })))
    }

    // searchFood = (e) => {
    //     if (!this.input.value) {
    //         return;
    //     }
    //     e.preventDefault();
    //     this.setState(() => ({ loadingFood: true }))

    //****** Actually see the async calls happening
    //****** Removed all the stupid bullshit api calls on a different page nonsense so you can actually understand what's going on
    //     console.log('0')
    //     fetch(`https://api.edamam.com/search?q=${this.input.value}&app_id=${API_ID}&app_key=${APP_KEY}`)
    //         .then(() => console.log('1'))
    //         .then(() => console.log('2'))
    //         .then((food) => this.setState(() => ({
    //             food,
    //             loadingFood: false
    //         })))
    //     console.log('3')
    // }

    openIngredientsModal = () => this.setState(() => ({ ingredientsModalOpen: true }))
    closeIngredientsModal = () => this.setState(() => ({ ingredientsModalOpen: false }))

    generateShoppingList = () => {
        // push all of our meals into an array
        return this.props.calendar.reduce((result, { meals }) => {
                const { breakfast, lunch, dinner } = meals

                breakfast && result.push(breakfast)
                lunch && result.push(lunch)
                dinner && result.push(dinner)

                return result
            }, [])

            // flatten array
            .reduce((ings, { ingredientLines }) => ings.concat(ingredientLines), [])
    }
    render() {
        const { foodModalOpen, loadingFood, food, ingredientsModalOpen } = this.state;
        const { calendar, remove, selectRecipe } = this.props;
        const mealOrder = ['breakfast', 'lunch', 'dinner']

        return (
            <div className='container'>
                <div className='nav'>
                    <h1 className='header'>UdaciMeals</h1>
                    <button
                        className='shopping-list'
                        onClick={this.openIngredientsModal}>
                            Shopping List
                    </button>
                </div>
                <ul className='meal-types'>
                    {mealOrder.map((mealType) => (
                        <li key={mealType} className='subheader'>
                            {capitalize(mealType)}
                        </li>
                    ))}
                </ul>

                <div className='calendar'>
                    <div className='days'>
                        {calendar.map(({ day }) => <h3 key={day} className='subheader'>{capitalize(day)}</h3>)}
                    </div>
                    <div className='icon-grid'>
                        {calendar.map(({ day, meals }) => (
                            <ul key={day}>
                                {mealOrder.map((meal) => (
                                    <li key={meal} className='meal'>
                                        {meals[meal]
                                            ? <div className='food-item'>
                                                  <img src={meals[meal].image} alt={meals[meal].label} />
                                                  <button onClick={() => remove({ meal, day })}>Clear</button>
                                              </div>
                                            : <button className='icon-btn' onClick={() => this.openFoodModal({meal, day})}>
                                                  <CalendarIcon size={30} />
                                              </button>
                                        }
                                    </li>
                                ))}
                            </ul>
                        ))}
                    </div>
                </div>

                <Modal
                    className='modal'
                    overlayClassName='overlay'
                    isOpen={foodModalOpen}
                    onRequestClose={this.closeFoodModal}
                    contentLabel='Modal'>
                    <div>
                        {loadingFood === true
                            ? <Loading delay={200} type='spin' color='#222' className='loading' />
                            : <div className='search-container'>
                                    <h3 className='subheader'>
                                        Find a meal for {capitalize(this.state.day)} {this.state.meal}.
                                    </h3>
                                    <div className='search'>
                                        <input
                                            className='food-input'
                                            type='text'
                                            placeholder='Search Foods'
                                            ref={(input) => this.input = input} />
                                        <button
                                            className='icon-btn'
                                            onClick={this.searchFood}>
                                            <ArrowRightIcon size={30}/>
                                        </button>
                                    </div>
                                    {food !== null && (
                                        <FoodList
                                            food={food}
                                            onSelect={(recipe) => {
                                                selectRecipe({ recipe, day: this.state.day, meal: this.state.meal })
                                                this.closeFoodModal()
                                            }}
                                        />
                                    )}
                              </div>
                        }
                    </div>
                </Modal>

                <Modal
                    className='modal'
                    overlayClassName='overlay'
                    isOpen={ingredientsModalOpen}
                    onRequestClose={this.closeIngredientsModal}
                    contentLabel='Modal'>

                    {ingredientsModalOpen && <ShoppingList list={this.generateShoppingList()} />}
                </Modal>
            </div>
        )
    }
}

// calendar before this function call:
// ** { sunday: { breakfast: null, lunch: null, dinner: null }, monday: { breakfast: null, lunch: null, dinner: null }, etc}
// ** no easy way to iterate through them

// calendar after this function call:
// ** { calendar: [{ day: "sunday", meals: { breakfast: null, lunch: null, dinner: null }}, { day: "sunday", meals: { breakfast: null, lunch: null, dinner: null }}, etc]}
// ** much easier to use an array for things
function mapStateToProps({ calendar, food }) {
    const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

    return {
        calendar: dayOrder.map((day) => ({
            day,
            meals: Object.keys(calendar[day]).reduce((meals, meal) => {
                meals[meal] = calendar[day][meal] ?
                    food[calendar[day][meal]] :
                    null;
                return meals
            }, {})
        })),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        selectRecipe: (data) => dispatch(addRecipe(data)),
        remove: (data) => dispatch(removeFromCalendar(data))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)