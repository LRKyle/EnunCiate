import React, {useState, Component} from 'react'
import {Search} from './screens/Search'
import {Analyze} from './screens/Analyze'

var curPage = "Home"

function getPage(setPage){
  curPage = setPage
  console.log("?")
  console.log(curPage)
}

export default class App extends Component {
  render(){  
    
    switch (curPage) {
      case "Home":
        return <Search getPage={getPage} setPage={curPage}/>
      case "Analyze":
        console.log("Yo?")
        return <Analyze/>
    }
  }
}

