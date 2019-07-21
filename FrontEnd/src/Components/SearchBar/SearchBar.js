import React, {Component} from 'react';
import './SearchBar.css';

class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
        }
        this.submitit = this.submitit.bind(this);
    }

    componentWillReceiveProps(){
        this.setState({query: this.props.query})
    }

    submitit = () => {
        let eve = {
            route: "search",
            query: this.state.query
        }
       this.props.onRouteChange(eve);
    }

    onQueryChange = (event) => {
        this.setState({query: event.target.value});
    }

    render() {
        return(
            <div className="mt5">
                <div className="wrap">
                    <div className="search">
                        <input id="searchBar" type="text" className="searchTerm" defaultValue={this.props.query}  onChange={this.onQueryChange}/>
                        <div onClick={this.submitit} id="btnSearch" className="searchButton"><i className="fa fa-search"></i></div>
                    </div>
                </div>
            </div>

        );
    }

}

export default SearchBar;