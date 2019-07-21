import React, {Component} from 'react';
import Loader from "react-loader-spinner";

class Related extends Component {

    constructor(props){
        super(props);
        this.state = {
            renderrelated: [],
            done: "no"
        }
    }

    componentDidMount() {
        let relatedlist = [];
        for(let i=0;i<this.props.related.length;++i){
            let title = this.props.related[i].title;
            title = title.replace(/&quot;/g, '\\"');
            title = title.replace(/&#39;;/g, '\\"');
            relatedlist.push(
                <div>
                    <a className="relatedq f5" target="blank" key={i} href={this.props.related[i].link} style={{textDecoration:"none"}}>
                    {title}
                </a>


                </div>
            )
        }
        this.setState({renderrelated: relatedlist,  done: "yes"});

    }

    render() {
        return(
            <div>
                {(this.state.done === "yes")
                ?
                <div>
                    <div className="f4">Linked Questions:</div>
                <div>{this.state.renderrelated}</div>
                </div>
                :
                <Loader type="CradleLoader" color="#00BFFF" height="100" width="100"/>
                }
            </div>
        );
    }
}

export default Related;