import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { fetchEvents,deleteEvent } from '../../../utils/routes'; 

const CalendarPage = ({ navigation }) => {
  const [events, setEvents] = useState({});
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        const formattedEvents = fetchedEvents.reduce((acc, event) => {
          const startDate = event.StartDate;
          const eventItem = {
            id: event.EventID,
            title: event.Title,
            description: event.EventDescription,
            startTime: event.StartTime.substring(0, 5), 
            endTime: event.EndTime.substring(0, 5),
            destination: event.Destination,
            startDate, 
          };
          if (!acc[startDate]) {
            acc[startDate] = [];
          }
          acc[startDate].push(eventItem);
          return acc;
        }, {});
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    loadEvents();
  }, []);

  const handleDeleteEvent = async (eventId, startDate) => {
    const result = await deleteEvent(eventId);
    if (result.success) {
      Alert.alert('Success', result.message);
      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        updatedEvents[startDate] = updatedEvents[startDate].filter(
          (event) => event.id !== eventId
        );
        if (updatedEvents[startDate].length === 0) {
          delete updatedEvents[startDate];
        }
        return updatedEvents;
      });
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const renderItem = (item) => (
    <TouchableOpacity
      style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginVertical: 5 }}
      onPress={() => navigation.navigate('EventDetails', { event: item })}
    >
      <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
      <Text>{item.startTime} - {item.endTime}</Text>
      <Text>{item.description}</Text>
      <Text>Location: {item.destination}</Text>
      <Button title="Delete Event" onPress={() => handleDeleteEvent(item.id, item.startDate)} />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={events}
        renderItem={renderItem}
        renderEmptyData={() => (
          <View style={{ alignItems: 'center', padding: 10 }}>
            <Text>No events scheduled for this day.</Text>
          </View>
        )}
        style={{ height: '100%' }} 
        showClosingKnob={true}
      />

      {/* Circular button for adding an event */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEvent')} // Navigate to the 'AddEvent' screen
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Add elevation for a shadow effect (Android)
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default CalendarPage;
