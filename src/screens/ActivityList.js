import React, { Component } from 'react'
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Platform,
    Alert
} from 'react-native'

import commonStyles from '../commonStyles'
import todayImage from '../../imgs/today.jpg'

import Icon from 'react-native-vector-icons/FontAwesome'

import moment from 'moment'
import 'moment/locale/pt-br'

import Activity from '../components/Activity'
import AddActivities from './AddActivities'

export default class ActivityList extends Component {
    state = {
        showDoneActivities: true,
        showAddActivities: false,
        visibleActivities: [],
        activities: []
    }

    componentDidMount = () => {
        this.filterActivities()
    }

    loadActivities = () => {
        const maxDate = moment().endOf('day').toDate()
        this.setState({})
    }

    toggleFilter = () => {
        this.setState({ showDoneActivities: !this.state.showDoneActivities }, this.filterActivities)
    }

    filterActivities = () => {
        let visibleActivities = null
        if(this.state.showDoneActivities) {
            visibleActivities = [...this.state.activities]
        } else {
            const pending = activity => activity.doneAt === null
            visibleActivities = this.state.activities.filter(pending)
        }

        this.setState({ visibleActivities })
    }

    toggleActivity = activityId => {
        const activities = [...this.state.activities]
        activities.forEach(activity => {
            if(activity.id === activityId) {
                activity.doneAt = activity.doneAt ? null : new Date()
            }
        })

        this.setState({ activities }, this.filterActivities)
    }

    addActivity = newActivity => {
        if(!newActivity.desc || !newActivity.desc.trim()) {
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return 
        }

        const activities = [...this.state.activities]
        activities.push({
            id: Math.random(),
            desc: newActivity.desc,
            estimateAt: newActivity.date,
            doneAt: null
        })

        this.setState({ activities, showAddActivities: false }, this.filterActivities)
    }

    deleteActivity = id => {
        const activities = this.state.activities.filter(activity => activity.id !== id)
        this.setState({ activities }, this.filterActivities)
    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <AddActivities isVisible={this.state.showAddActivities}
                    onCancel={() => this.setState({ showAddActivities: false })}
                    onSave={this.addActivity} />
                <ImageBackground source={todayImage}
                    style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneActivities ? 'eye' : 'eye-slash'}
                                size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.activityList}>
                    <FlatList data={this.state.visibleActivities}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({item}) => <Activity {...item} onToggleActivity={this.toggleActivity} onDelete={this.deleteActivity} />} />
                </View>
                <TouchableOpacity style={styles.addButton} 
                    activeOpacity={0.7}
                    onPress={() => this.setState({ showAddActivities: true })}>
                    <Icon name="plus" size={20}
                        color={commonStyles.colors.secondary} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 3
    },
    activityList: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'flex-end',
        marginTop: 40
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: commonStyles.colors.today,
        justifyContent: 'center',
        alignItems: 'center'
    }
});