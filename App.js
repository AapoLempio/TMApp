import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import TaskCard from './components/TaskCard'
import TaskCardGroup from './components/TaskCardGroup'
import Axios from "axios"
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
    this.state = {
      count: 0,
      cardList: [],
      defaultTitle: "Title",
      defaultText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    };
  }

  componentDidMount() {
      window.addEventListener('load', this.handleLoad);
  }

  componentWillUnmount() { 
    window.removeEventListener('load', this.handleLoad)  
  }

//handle 

  handleLoad() {
      try{
        Axios.get("http://localhost:8000/cards"
        ).then((response) => {
          console.log(response);
          response.data[0].forEach(item => {
            this.state.cardList.push([item.card_name, item.card_text, item.pk_card])
            this.setState({cardList: this.state.cardList});
          });
        });
      }
      catch(error){
      }
      
  }

  //add task card to cardlist in the constructor and call insert to db method
  addTaskCard = () => {
    this.state.cardList.push([this.state.defaultTitle, this.state.defaultText, this.state.cardList.length + 1]);
    this.setState({cardList: this.state.cardList});
    this.insertCardToDB(this.state.cardList.length);
  };

  //sends a request by axios to the index.js (basically a router and at the moment not well named) with card info
  //to add card into db
  insertCardToDB = (key) =>{
    Axios.post("http://localhost:8000/cards", {
      pk_card: String(key),
      card_name: this.state.defaultTitle,
      card_text: this.state.defaultText,
      delete: false,
    });
  };


  //Not a finished function. At the moment does not do anythinf

  removeCardFromList = () =>{
    this.setState({cardList: []});
    this.handleLoad();
  };


  //the render method for the react page with the add button and the cardlist
  render() {

    return (
      <div>
         <Button variant="outlined" color="primary" onClick= {this.addTaskCard}>
          <b>New</b>
        </Button>
        <TaskCardGroup>
        {
          this.state.cardList.map( (card) => {
            
            return (

              <TaskCard title= {card[0]} body= {String(card[1])} dBKey= {card[2]} removeCardFromList= {this.removeCardFromList}/>
            )
          })
        }
        </TaskCardGroup>
      </div>
    );
  }
}
export default App;
