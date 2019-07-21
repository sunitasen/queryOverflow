import React, {Component} from 'react';
import SearchBar from "../SearchBar/SearchBar";
import './DisplayPage.css';
import Question from "../Question/Question";
import Answer from "../Answer/Answer";
import Related from "../Related/Related";
import Loader from "react-loader-spinner";

class DisplayPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            answers: [],
            questions: [],
            related: [],
            new_answers: [],
            new_questions: [],
            new_related: [],
            tags: [],
            mestags: [],
            extradone: '',
            rendertags: [],
            part: "q",
            tagsinsert: '',
            query: '',
            loaded: "",
            facts:[
                "SO was created in 2008 by Jeff Atwood and Joel Spolsky",
                "Stackoverflow is written in ASP.NET using ASP.NET MVC (Model-View-Controller) framework and MS SQL server database",
                "Name of the stackoverflow website was chosen by voting in April 2008",
                "As of 2014, SO has over 2,700,000 registered users and more than 7,100,000 questions",
                "Based on the tag assigned to questions, the top eight most discussed topics are Java, JavaScript, PHP, Android, jQuey, Python and HTML",
                "A 2013 study shows that 77% of users only ask one question, 65% only answer one question and 8% answer more than 5% questions",
                "The very first stackoveflow question was - Where, oh where, did the Joel Data go?",
                "The very first stackoverflow vote was on - 2008-07-31 21:28:01",
                "The highest rated stackoverflow question is-Why is processing a sorted array faster than processing an unsorted array?"
            ]
        }
        this.loaddata =this.loaddata.bind(this);
    }

    componentDidMount() {
        this.setState({query: this.props.query})
        let q = this.props.query;
        if(q[0] === q[q.length-1] && q[0]==='"'){
            q = q.slice(1,q.length-1)
            this.setState({isExact: "yes"})
            fetch("https://overflowback-api-heroku.herokuapp.com/search",{
                method: "post",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({
                    query: this.props.query
                })
            })
            .then((response) => response.json())
            .then((message) => (
                                this.setState({
                                    answers: message.answers,
                                    questions: message.questions,
                                    related: message.related,
                                    mestags: message.tags,
                                    loaded: "done"
                                }, this.loaddata())))
            .catch((error) => {throw(error)});

        }
        
       else{
            fetch("https://overflowback-api-heroku.herokuapp.com/search",{
                method: "post",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({
                    query: this.props.query
                })
            })
            .then((response) => response.json())
            .then((message) => (
                                this.setState({
                                    answers: message.answers,
                                    questions: message.questions,
                                    related: message.related,
                                    mestags: message.tags,
                                    loaded: "done"
                                })))
            .catch((error) => {throw(error)});

       }

       fetch("http://127.0.0.1:12346/tags",{
            method: "post",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                query: this.props.query
            })
        })
        .then((response) => response.json())
        .then((message) => (
                            this.setState({
                                tags: message.hello,
                                tagsinsert: "done"
                            }, ()=>{
                               if(this.state.tags.length === 0){
                                   this.setState({rendertags: "Sorry!cannot find relevant tags!"})
                               }
                               else{
                                   let ta = []
                                   for(let i = 0; i<this.state.tags.length ;++i){
                                        let linkto = "https://stackoverflow.com/tags/" + this.state.tags[i]
                                       ta.push(<a href={linkto} className="f4" target="blank_">{this.state.tags[i]},</a>)
                                   }
                                   this.setState({rendertags: ta})
                               }
                            })))
        .catch((error) => {throw(error)});

    }

    loaddata = () => {
        let q = this.props.query;
        q = q.slice(1,q.length-1)
        this.setState({isExact: "yes"})
        fetch("http://127.0.0.1:12345/search",{
            method: "post",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                query: q
            })
        })
        .then((response) => response.json())
        .then((message) => (
                            this.setState({
                                new_answers: message.answers,
                                new_questions: message.questions,
                                new_related: message.related,
                                loaded: "done"
                            },()=>{
                                let nans = this.state.new_answers, nques = this.state.new_questions;
                                let ans = this.state.answers , ques = this.state.questions;
                                const new_answers = nans.filter(function(x) { 
                                    return ans.indexOf(x) < 0;
                                });
                                this.setState({new_questions: new_answers});
                                const new_questions = nques.filter(function(x) { 
                                    return ques.indexOf(x) < 0;
                                });
                                this.setState({new_questions: new_questions, extradone: "yes"});
                            })
                            
                        ))
        .catch((error) => {throw(error)});
    }

    onPartChange = () => {
        if(this.state.part === "q"){
            this.setState({part: "a"});
            document.getElementById("ans").className = "f4 grow no-underline pointer br-pill ph3 pv2 mb2 dib white bg-black";
            document.getElementById("ques").className = "f4 grow no-underline pointer br-pill ph3 pv2 mb2 dib black bg-white";
        }else{
            this.setState({part: "q"});
            document.getElementById("ques").className = "f4 grow no-underline pointer br-pill ph3 pv2 mb2 dib white bg-black";
            document.getElementById("ans").className = "f4 grow no-underline pointer br-pill ph3 pv2 mb2 dib black bg-white";
        }

    }

    onRouteChange = (event) => {
        this.setState({query: event.query},()=>{
            this.forceUpdate();
        });


    }


    render() {
    
        return(
            <div className="">
                please Reload the app for further query.
                <SearchBar query={this.state.query} onRouteChange={this.onRouteChange}/>
                {(this.state.loaded === "done")
                ?
                <div className="tc">
                    <div className="row f4">
                        The tags are:
                        {this.state.tagsinsert === "done"
                        ?
                        <div>
                            {this.state.rendertags}
                        </div>
                        :
                        <Loader type="CradleLoader" color="#00BFFF" height="100" width="100"/>
                        }
                    </div>
                    <div className="row tc f3 ml6 mt4">
                        <div id="ques" className="f4 grow no-underline pointer br-pill ph3 pv2 mb2 dib white bg-black" onClick={this.onPartChange}>Questions</div>
                        <div className="ml2"></div>
                        <div id="ans" className="f4 grow no-underline pointer br-pill ph3 pv2 mb2 dib black bg-white" onClick={this.onPartChange} href="#0">Answers</div>
                    </div>
                    <div className="row">
                        <div className="column col-lg-9 col-sm-9">
                            {(this.state.part === "q")
                            ? <Question questions={this.state.questions}/>
                            : <Answer answers={this.state.answers}/>
                            }
                            {this.state.isExact === "yes"
                            ?
                            <div>
                                {this.state.extradone === "yes"
                                ?
                                <div>
                                    {(this.state.part === "q")
                                    ? 
                                    <div>
                                        <div className="f3 mt2 mb2">You might also like to discover:</div>
                                        <Question questions={this.state.new_questions}/>
                                    </div>
                                    : 
                                    <div>
                                        <div className="f3 mt2 mb2">You might also like to discover:</div>
                                        <Answer answers={this.state.new_answers}/>
                                    </div>
                                    }
                                </div>
                                :
                                <Loader type="CradleLoader" color="#00BFFF" height="100" width="100"/>
                                }
                                
                            </div>
                            :
                            <div></div>
                            }
                        </div>

                        <div className="column col-lg-3 col-sm-3">
                            <Related related={this.state.related}/>
                        </div>
                                
                    </div>
                </div>
                :
                <div className="center tc mt7 ml6">
                    <Loader type="CradleLoader" color="#00BFFF" height="100" width="100%" />
                    <div className="f3 ml5 mr3">
                        I am crunching the data for you!<br/><br/>
                        Meanwhile check this fact about Stackoverflow:<br/><br/>
                    {this.state.facts[Math.floor(Math.random() * this.state.facts.length)]}
                    </div>

                </div>
                }
                
    
            </div>
        );
    }

}

export default DisplayPage;