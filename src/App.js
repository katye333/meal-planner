import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addRecipe, removeFromCalendar } from './actions'

class App extends Component {
    doThing = () => {
        this.props.selectRecipe({})
    }
    render() {
        console.log(this.props)
        return (
            <div>
                Hello World
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
function mapStateToProps (calendar) {
    const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

    return {
        calendar: dayOrder.map((day) => ({
            day,
            meals: Object.keys(calendar[day]).reduce((meals, meal) => {
                if (meals[meal] === calendar[day][meal]) {
                    meals[meal] = calendar[day][meal];
                }
                else {
                    meals[meal] = null;
                }
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