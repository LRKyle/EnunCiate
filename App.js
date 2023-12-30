import React, {useState, Component} from 'react'
import {Search} from './screens/Search'
import {Analyze} from './screens/Analyze'


var curPage = "Home"

export default class App extends Component {  
constructor(props){
   super(props);
   this.state = {
      curPage: "Home"
   };
 }

 setPage = (nextPage) => {
   this.setState({ curPage: nextPage});
 }

  render(){  
    const { curPage } = this.state;
    switch (curPage) {
      case "Home":
        return <Search getPage={this.setPage} setPage={curPage}/>
      case "Analyze":
        console.log("Yo?")
        return <Analyze getPage={this.setPage} setPage={curPage}/>
    }
  }
}

