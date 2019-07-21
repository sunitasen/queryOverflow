import React, {Component} from 'react';
import './Question.css';
import Loader from "react-loader-spinner";
class Question extends Component {

    constructor(props){
        super(props);
        this.state = {
            renderquestions: [],
            done: "no"
        }
    }

    componentDidMount() {
        let questions = [];
        if(this.props.questions.length === 0){
            questions.push(
                <div f4>We couldn't find anything for your query!Try asking at
                <a href="https://stackoverflow.com" target="blank_">Stack Overflow Website</a>
                </div>
            )
        }
        else{
            for(let i=0;i<this.props.questions.length;++i){
                let title = this.props.questions[i].title;
                title = title.replace(/&quot;/g, '\\"');
                title = title.replace(/&#39;;/g, '\\"');
                questions.push(
                    <div className="tl qcard" key={i}>
                        <div className="row">
                            <div className="col-1">
                                <img src={this.props.questions[i].image} className="profileimage" alt="profilepicture"/>
                            </div>
                            <div className="col-8 f4">
                                {this.props.questions[i].username}
                            </div>
                        </div>
                        <div className="row">
                            <a className="title f4" target="blank_" href={this.props.questions[i].link}>{title}</a>
                        </div>
                        <div className="row description f5">
                            {this.props.questions[i].body.substr(0, 400)}
                            {(this.props.questions[i].body.length > 400) ? <div>...</div> : <div></div>}
                        </div>
                        <div className="row score f6 mt3">
                            <div className="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib black">Votes: {this.props.questions[i].score}</div>
                        </div>
                    <hr/> 
                    </div>
                    
                )
            }

        }
        
        this.setState({renderquestions: questions,  done: "yes"});

    }

    render() {
        return(
            <div>
                {(this.state.done === "yes")
                ?
                this.state.renderquestions
                :
                <Loader type="CradleLoader" color="#00BFFF" height="100" width="100"/>
                }
            </div>
        );
    }
}

export default Question;