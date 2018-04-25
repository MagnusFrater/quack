import React, { Component } from 'react';
import { Col, Row, Grid } from "react-native-easy-grid"
import {Content } from 'native-base'
import { StackNavigator } from 'react-navigation';
import { View, Image, Text, Dimensions, TouchableHighlight, Alert, TouchableOpacity, ScrollView } from 'react-native';
import styles from './styles';
import { HeaderContainer, Header, Left, Body, Right, Button, Icon, Title, Item, Input, Spinner} from 'native-base';
import { colors } from '../../style/styles';
import ReactDOM from 'react-dom';
import * as V from 'victory';
import {VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryLabel } from 'victory-native';
import { ApolloProvider, graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { NavigationActions } from 'react-navigation';

class QuizResults extends Component {
    state = {
        title: '',
        course: '',
        courseID: '',
        date: '',
        quizID: '',
        options: '',
        options2: [],
        options3: ['A', 'B', 'C', 'D'],
        numoptions: 0,
        stats: [],
        correctAnswer: '',
        isLoading: true,
    }

    componentDidMount () {
        this.setState({title:this.props.navigation.state.params.title})
        this.setState({course:this.props.navigation.state.params.course})
        this.setState({courseID:this.props.navigation.state.params.courseID})
        this.setState({date:this.props.navigation.state.params.date})
        this.setState({quizID:this.props.navigation.state.params.quizID})
        this.setState({questionID:this.props.navigation.state.params.id})
        this.setState({correctAnswer:this.props.navigation.state.params.correctAnswer})
        this.setState({userAnswer:this.props.navigation.state.params.userAnswer})
        this.setState({options:this.props.navigation.state.params.options})
        this.props.client.mutate({ mutation: gql`
        mutation quizGetStats($questionID: Int!) {
            quizGetStats(questionID: $questionID)
        }
        `,
        variables: {
            questionID : this.props.navigation.state.params.id,
        }
        }).then( data => {
            let stats = [];
            let numOptions = data.data.quizGetStats.length;
            console.log(data.data.quizGetStats);
            for(let i = 0; i < data.data.quizGetStats.length; i++) {
                stats.push({answer: (i+1), number: data.data.quizGetStats[i], fill: ''})
            }
        
            this.setState({numOptions});
            
        
        for( let i=0; i<numOptions; i++){
            this.state.options2.push({'Option': this.state.options.split(";")[i], 'letter': this.state.options3[i]});
        }
        console.log(this.state.userAnswer)
        console.log(this.state.correctAnswer)
        console.log(this.state.options2)
        for(let i=0; i<numOptions; i++){
            if(this.state.userAnswer == options2[i]){
                if(this.state.correctAnswer == options2[i]){
                    this.state.stats[i].fill = 'white';
                }
            }
        }
        this.setState({isLoading:false})
        console.log("this.state.isLoading")
        });
    }

    isLoading() {
        this.setState({isLoading:false})
    }

    render() {
        let title = this.state.title;
        let course = this.state.course;
        let courseID = this.state.courseID;
        let date = this.state.date;
        let quizID = this.state.quizID;
        let id = this.state.id;
        let correctAnswer = this.state.correctAnswer;
        let userAnswer = this.state.userAnswer;
        let options = this.state.options;

        if(this.state.isLoading == true){
            return(
                <View style={styles.background}>
                <Header style={styles.headerTop}>
                    <Left style={{flex: 1}}>
                        <TouchableOpacity onPress={() => this.props.navigation.dispatch(NavigationActions.reset({index: 0, actions: [NavigationActions.navigate({ routeName: 'Questions', params:  {title, course, courseID, date, quizID, id, correctAnswer, userAnswer, options}})]}))}>
                        <Icon name='arrow-back' style={styles.backButton}/>
                        </TouchableOpacity>
                    </Left>
                </Header>
                
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <Spinner color = 'white' />
                    </View>
                </View>
            );
        }
        else{
        return (
            <Grid style={styles.background}>
                <Header style={styles.headerTop}>
                    <Left style={{flex: 1}}>
                        <TouchableOpacity onPress={() => this.props.navigation.dispatch(NavigationActions.reset({index: 0, actions: [NavigationActions.navigate({ routeName: 'Questions', params:  {title, course, courseID, date, quizID, id, correctAnswer, userAnswer, options}})]}))}>
                        <Icon name='arrow-back' style={styles.backButton}/>
                        </TouchableOpacity>
                    </Left>
                </Header>
                <Row size={10}>
                    <Text style = {styles.bigTitle}>
                        {this.state.course.split(":")[0]}
                    </Text>
                </Row>
                <Row size={10}>
                    <Text style = {styles.subTitle}>
                        {this.state.course.split(":")[1]}
                    </Text>
                </Row>
                <Row size={50}>
                    <VictoryChart
                    domainPadding={20}
                    >
                    <VictoryLabel text={this.state.title} textAnchor="middle" x={Dimensions.get('window').width / 2} y={40}/>
                    <VictoryAxis tickValues={[1, 2, 3, 4]} tickFormat={["A", "B", "C", "D"]}/>
                    <VictoryAxis
                      dependentAxis
                      //tickFormat={(x) => (`$${x / 1000}k`)}
                    />
                    <VictoryBar
                      data={this.state.stats}
                      labels={(d) => d.y}
                      x="answer"
                      y="number"
                      //animate={{duration: 5}}
                    />
                    </VictoryChart>
     
            </Row>
            <Row size={9}>
                <Text style= {styles.recentIndicator}>
                    Options
                </Text>
            </Row>
            <Row size={30}>
                <Content>
                {this.state.options2.map(({Option, letter}) => {
                    return (
                        <View>
                            <Grid>
                                <Row style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={styles.pastQuizIndicator}> {letter} ). {Option}</Text>
                                </Row>
                            </Grid>
                        </View>);
                        }
                    )
                }
                </Content>
            </Row>
            </Grid>
        );
    }
    }
}

export default withApollo(QuizResults);