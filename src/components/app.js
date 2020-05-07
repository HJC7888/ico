import React,{Component} from 'react';
import Accounts from './accounts'
import Projects from './projects'
import createProject from './createProjects'
import Details from './details'

import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component{
  constructor(...args) {
    super(...args)
  }

  render(){
    return (
      <div >


<nav className="navbar navbar-inverse navbar-fix-top">
  <div className="container-fluid">
    
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="/">众筹DApp</a>
      </div>

      <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul className="nav navbar-nav">
            <li className="active"><a href="/">项目列表</a></li>
            <li><a href="/createProject">项目发起</a></li>
        </ul>
      </div>
</div>
</nav>

        
        <Router>
                <Route exact path="/" component={Projects} />
                <Route exact path="/details/:address" component={Details} />
                <Route exact path="/createProject" component={createProject} />
                
        </Router> 

    
      </div>




    )
  }
}





export default App;
