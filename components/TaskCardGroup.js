
import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const TaskCardGroupStyles = theme => ({

    mainPaper: {
      padding: 20,
      maxWidth: 300,
      marginLeft: 20,
    },
  })

class TaskCardGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    //console.log(this.props.children)
    const { classes } = this.props;
    return (
        <Paper className={classes.mainPaper}>
          {this.props.children}
        </Paper>
    );
  }
}
export default withStyles(TaskCardGroupStyles)(TaskCardGroup);
