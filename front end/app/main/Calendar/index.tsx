import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetchEvents } from '../../../utils/routes';

const CalendarPage: React.FC = () => {
  const [items, setItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (`0${today.getMonth() + 1}`).slice(-2);
    const day = (`0${today.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  });
  const [hasTasks, setHasTasks] = useState(false);

  const navigation = useNavigation();

  const onDateChanged = (date: string) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchEvents(selectedDate);
        setItems(response);
        setHasTasks(response.length > 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [selectedDate]);

  const filteredItems = items.filter((item: { StartDate: string }) => item.StartDate === selectedDate);

  const sections = filteredItems
    ? [
        {
          title: selectedDate,
          data: filteredItems,
        },
      ]
    : [];

  const renderItem = ({ item }: { item: { Title: string; StartTime: string; EndTime: string } }) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.title}>{item.Title}</Text>
          <Text style={styles.time}>{`Start Time: ${item.StartTime}`}</Text>
          <Text style={styles.time}>{`End Time: ${item.EndTime}`}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={onDateChanged}
        showTodayButton
        theme={{
          backgroundColor: '#1E1E1E',
          calendarBackground: '#1E1E1E',
          textSectionTitleColor: 'white',
          selectedDayBackgroundColor: '#ff5a60',
          selectedDayTextColor: 'white',
          todayTextColor: '#ff5a60',
          dayTextColor: 'white',
          textDisabledColor: '#d9e1e8',
          dotColor: '#ff5a60',
          selectedDotColor: '#ffffff',
          arrowColor: 'white',
          monthTextColor: 'white',
        }}
      >
        <ExpandableCalendar
          firstDay={1}
          markedDates={{
            [selectedDate]: { selected: true, marked: true },
          }}
          theme={{
            backgroundColor: '#001C30',
            calendarBackground: '#001C30',
            textSectionTitleColor: '#FFFFFF',
            selectedDayBackgroundColor: '#1270B0',
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: '#1270B0',
            dayTextColor: '#B3B3B3',
            textDisabledColor: '#858895',
            dotColor: '#1270B0',
            selectedDotColor: '#ffffff',
            arrowColor: 'white',
            monthTextColor: 'white',
          }}
        />
        {hasTasks ? (
          <AgendaList sections={sections} renderItem={renderItem} sectionStyle={styles.section} />
        ) : (
          <View style={styles.noTasksContainer}>
            <Text style={styles.noTasksText}>No events for this date.</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.addButton}
          //onPress={() => navigation.navigate('AddEventPage')}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" /> 
        </TouchableOpacity>
      </CalendarProvider>

    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001C30',
      },
      
  section: {
    backgroundColor: '#001C30',
    color: 'white',
    textTransform: 'capitalize',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#21394B',
    borderRadius: 5,
    padding: 10,
    marginRight: 3,
    marginLeft: 3,
    marginTop: 17,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTextContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  time: {
    color: 'grey',
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
  },
  noTasksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasksText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#1E1E1E',
  },
  footerIcon: {
    width: 31,
    height: 31,
    tintColor: '#fff',
  },
  footerLogo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  addButton: {
  position: 'absolute',
  bottom: 20,
  right: 20,
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: '#1270B0', 
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 3,
},
});

export default CalendarPage;
