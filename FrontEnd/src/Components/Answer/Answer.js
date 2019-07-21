import React, {Component} from 'react';
import './Answer.css';
import Loader from "react-loader-spinner";

class Answer extends Component {

    constructor(props){
        super(props);
        this.state = {
            renderanswers: [],
            done: "no"
        }
    }

    componentDidMount() {
        let answers = [];
        if(this.props.answers.length === 0){
            answers.push(
                <div f4>We couldn't find anything for your query!Try asking at
                <a href="https://stackoverflow.com" target="blank_">Stack Overflow Website</a>
                </div>

            )
        }
        else{
            for(let i=0;i<this.props.answers.length;++i){
                let title = this.props.answers[i].question;
                title = title.replace(/&quot;/g, '\\"');
                title = title.replace(/&#39;;/g, '\\"');
                answers.push(
                    <div className="acard tl" key={i}>
                        <div className="row">
                            <div className="title f4">{title}</div>
                        </div>
    
                        <div className="row">
                            <div className="col-1">
                                <img src={this.props.answers[i].image} className="profileimage" alt="profilepicture"/>
                            </div>
                            <div className="col-8 f4">
                                {this.props.answers[i].name}
                            </div>
                        </div>
                        <div className="row description f5">
                            {this.props.answers[i].body.substr(0, 400)}
                            {(this.props.answers[i].body.length > 400) ? <div>...</div> : <div></div>}
                            <a target="blank_" href={this.props.answers[i].link}>Show</a>
                        </div>
                        <div className="row score f6">
                            <div class="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib black">Votes: {this.props.answers[i].score}</div>
                            {(this.props.answers[i].accepted === true)?
                            <div class="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib bg-green black">accepted</div>
                            :
                            <div></div>
                            }
    
                        </div>
                        <hr/>
                    </div>
                    
                )
            }

        }
        
        this.setState({renderanswers: answers,  done: "yes"});

    }

    render() {
        return(
            <div>
                {(this.state.done === "yes")
                ?
                this.state.renderanswers
                :
                <Loader type="CradleLoader" color="#00BFFF" height="100" width="100"/>
                }
            </div>
        );
    }
}

export default Answer;