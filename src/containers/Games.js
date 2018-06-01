import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import { getRecipes, getMeals, setError } from '../actions/recipes';

class GamesContainer extends Component {
  // static propTypes = {
  //   Layout: PropTypes.func.isRequired,
  //   recipes: PropTypes.shape({
  //     loading: PropTypes.bool.isRequired,
  //     error: PropTypes.string,
  //     recipes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  //   }).isRequired,
  //   match: PropTypes.shape({
  //     params: PropTypes.shape({}),
  //   }),
  //   getRecipes: PropTypes.func.isRequired,
  //   getMeals: PropTypes.func.isRequired,
  //   setError: PropTypes.func.isRequired,
  // }

  // static defaultProps = {
  //   match: null,
  // }

  // componentDidMount = () => this.fetchRecipes();

  
  //   Fetch Data from API, saving to Redux
    
//   fetchRecipes = () => {
//     return this.props.getRecipes()
//       .then(() => this.props.getMeals())
//       .catch((err) => {
//         console.log(`Error: ${err}`);
//         return this.props.setError(err);
//       });
//   }

  render = () => {
    const { Layout } = this.props;

    return (
      <Layout/>
    );
  }
}

const mapStateToProps = state => ({
  games: state.games || {},
});

const mapDispatchToProps = {
  // getRecipes,
  // getMeals,
  // setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(GamesContainer);
