import React from 'react';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Axios from "axios"
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const TaskCardStyles = theme => ({

  root: {
    maxWidth: 345,
    marginBottom: 10,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
})
class TaskCard extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          key: String(this.props.dBKey),
          expanded: false,
          shownTitle: this.props.title,
          body: this.props.body,
          shownBody: (this.props.body).substring(0, 117) + '...',
          cardTextColor: "textSecondary",
          showMenu: false,
          anchorEl: null,
          open:false,

      };
  }

  handleExpandClick = () => {
    this.setState({expanded: !this.state.expanded});
    if (this.state.expanded) {
      this.setState({shownBody: (this.state.shownBody).substring(0, 117) + '...'});
      this.setState({cardTextColor: "textSecondary"});
    }
    else {
      this.setState({shownBody: this.state.body});
      this.setState({cardTextColor: "textPrimary"});
    }
  };

  saveText = () => {
    this.updateCardTextToDB();
  };
  saveTitle = () => {
    this.setState({
    shownTitle: document.getElementById("cardTitle"+this.state.key).value
    });
    this.updateCardTitleToDB();
  };

  deleteCard = () => {
    this.removeCardFromDB();
    this.handleClose();
  };

  updateCardTitleToDB = () =>{
    var dBKey = this.state.key;
    Axios.post("http://localhost:8000/cards", {
      pk_card: dBKey,
      card_name: document.getElementById("cardTitle"+this.state.key).value,
      card_text: this.state.body,
      delete: false,
    });
  };

  updateCardTextToDB = () =>{
    var dBKey = this.state.key;
    Axios.post("http://localhost:8000/cards", {
      pk_card: dBKey,
      card_name: this.state.shownTitle,
      card_text: this.state.body,
      delete: false,
    });
  }; 

  removeCardFromDB = () =>{
    var dBKey = this.state.key;
    Axios.post("http://localhost:8000/cards", {
      pk_card: dBKey,
      delete: true,
    });
    this.props.removeCardFromList();
  };

  handleClose = () => {
    this.setState({anchorEl: null});
  };
  handleClick = (event) => {
    this.setState({anchorEl: event.currentTarget});
  };

  editText = () => {
    var text = document.getElementById("cardText"+this.state.key);
    var editTextField = document.getElementById("editTextField"+this.state.key);
    if (text.style.display === "none") {
      text.style.display = "block";
      editTextField.style.display = "none";
    } else {
      text.style.display = "none";
      editTextField.style.display = "block";
      document.getElementById("editTextField"+this.state.key).focus();
    }
  }
  editTitle = () => {
    var title = document.getElementById("title"+this.state.key);
    var editTitleField = document.getElementById("editTitleField"+this.state.key);
    if (title.style.display === "none") {
      title.style.display = "block";
      editTitleField.style.display = "none";
    } else {
      title.style.display = "none";
      editTitleField.style.display = "block";
      document.getElementById("cardTitle"+this.state.key).focus();
    }
  }
  handleTextAreaChange = () => {
    var text = document.getElementById("editTextField"+this.state.key).value;
    this.setState({shownBody:text.substring(0, 117) + '...',
      body: text});
  }
  render() {
    const handleClick = (event) => {
      this.handleClick(event);
    };
  
    const handleClose = () => {
      this.handleClose();
    };

    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={this.removeCardFromDB} style={{
        position: 'relative', 
        left: '95%', 
        top: '50%',
        transform: 'translate(-75%, 0%)'
        }}>
          <CloseIcon />
        </IconButton>
        <div>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={this.deleteCard}>Delete</MenuItem>
          </Menu>
          
        </div>
        <CardHeader
          id= {"title"+this.state.key}
          title= {this.state.shownTitle}
          onClick= {this.editTitle}
        />
        <CardHeader
          id={"editTitleField"+this.state.key}
          style= {{display:"none"}}
          title= {<TextField
            id={"cardTitle"+this.state.key}
            defaultValue={this.state.shownTitle}
            type="text"
            onBlur={() => {
              this.editTitle();
              this.saveTitle();
            }}
            fullWidth
          />}
        />
        <CardContent>
          <Typography id={"cardText"+this.state.key} color={this.state.cardTextColor} component="p" onClick= {this.editText}>
            {this.state.shownBody}
          </Typography>
          <TextareaAutosize 
          style= {{display:"none"}} 
          id= {"editTextField"+this.state.key} 
          aria-label="empty textarea" 
          placeholder={this.state.body}
          onChange={this.handleTextAreaChange}
          onBlur={() => {
            this.editText();
            this.saveText();
          }}/>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(TaskCardStyles)(TaskCard);