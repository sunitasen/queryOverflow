import React, {Component} from 'react';
import './App.css';
import SearchBar from "./Components/SearchBar/SearchBar";
import DisplayPage from "./Components/DisplayPage/DisplayPage";

class App extends Component {

  constructor() {
    super();
    this.state = {
      route: 'home',
      query: '',
      onPage: "no"
    }
  }

  onRouteChange = (event) => {
      this.setState({route: event.route});  
      this.setState({query: event.query});

      if(event.onPage === "yes"){
        this.setState({onPage: "yes"})
      }

    
  } 


  render(){  
    return (
      <div className="">
        
        {(this.state.route === 'home')
            ? <div className="App">
                <div className="sologo">
                  <img href="/" src={require("./Images/sologonew.jpg")} height="150px" width="400px" alt="logo" />
                </div>
              <SearchBar query={this.state.query} onRouteChange={this.onRouteChange}/>
              </div>
            : <DisplayPage query={this.state.query} onRouteChange={this.onRouteChange}/>
            }    

    <footer class="pv4 ph3 ph5-m ph6-l mid-gray bg-black">
      <small class="f6 db tc">© 2019 <b class="ttu">Sunita</b>., All Rights Reserved</small>
      <small class="f6 db tc">SO facts were mostly taken from quora</small>
      <small class="f6 db tc">Stackoverflow icon is borrowed from google results</small>
      <div class="tc mt3">
      </div>
    </footer>   
  
      </div>
    );
  }
}

export default App;
