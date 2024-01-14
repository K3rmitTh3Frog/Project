import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, TextInput } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { fetchEvents, deleteEvent, createEvent } from '../api/calendarApi'; // Adjust the path as necessary

const CalendarPage = () => {
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState({
    Title: '',
    EventDescription: '',
    StartDate: null,
    StartTime: null,
    EndDate: null,
    EndTime: null,
    Destination: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const fetchedEvents = await fetchEvents();
      const formattedEvents = fetchedEvents.reduce((acc, event) => {
        const startDate = event.StartDate;
        const eventItem = {
          id: event.EventID,
          title: event.Title,
          description: event.EventDescription,
          startTime: event.StartTime.substring(0, 5), // Format time as "HH:MM"
          endTime: event.EndTime.substring(0, 5),
          destination: event.Destination,
          startDate, // Include the startDate for deletion
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

  const handleDeleteEvent = async (eventId, startDate) => {
    const result = await deleteEvent(eventId);
    if (result.success) {
      Alert.alert('Success', result.message);
      // Remove the event from the state
      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        updatedEvents[startDate] = updatedEvents[startDate].filter(
          (event) => event.id !== eventId
        );
        if (updatedEvents[startDate].length === 0) {
          delete updatedEvents[startDate]; // Remove the date entry if no events are left
        }
        return updatedEvents;
      });
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleCreateEvent = async () => {
    try {
      console.log('Creating Event:', newEvent); // Print the event data to the console
      const result = await createEvent(newEvent);

      if (result.success) {
        // Reset the newEvent data and reload events
        setNewEvent({
          Title: '',
          EventDescription: '',
          StartDate: null,
          StartTime: null,
          EndDate: null,
          EndTime: null,
          Destination: '',
        });
        loadEvents();
        Alert.alert('Success', 'Event created successfully');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error creating the event:', error);
      Alert.alert('Error', 'An error occurred during the creation of the event');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={events}
        renderItem={(item, firstItemInDay) => (
          <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginVertical: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.startTime} - {item.endTime}</Text>
            <Text>{item.description}</Text>
            <Text>Location: {item.destination}</Text>
            <Button title="Delete Event" onPress={() => handleDeleteEvent(item.id, item.startDate)} />
          </View>
        )}
      />

      {/* Input fields for creating a new event */}
      <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginVertical: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Create New Event</Text>
        <TextInput
          placeholder="Title"
          value={newEvent.Title}
          onChangeText={(text) => setNewEvent({ ...newEvent, Title: text })}
        />
        <TextInput
          placeholder="Description"
          value={newEvent.EventDescription}
          onChangeText={(text) => setNewEvent({ ...newEvent, EventDescription: text })}
        />
        <TextInput
          placeholder="Start Date (YYYY-MM-DD)"
          value={newEvent.StartDate !== null ? newEvent.StartDate.toString() : ''}
          onChangeText={(text) => setNewEvent({ ...newEvent, StartDate: text })}
        />
        <TextInput
          placeholder="End Date (YYYY-MM-DD)"
          value={newEvent.EndDate !== null ? newEvent.EndDate.toString() : ''}
          onChangeText={(text) => setNewEvent({ ...newEvent, EndDate: text })}
        />
        <TextInput
          placeholder="Start Time (HH:MM)"
          value={newEvent.StartTime !== null ? newEvent.StartTime.toString() : ''}
          onChangeText={(text) => setNewEvent({ ...newEvent, StartTime: text })}
        />
        <TextInput
          placeholder="End Time (HH:MM)"
          value={newEvent.EndTime !== null ? newEvent.EndTime.toString() : ''}
          onChangeText={(text) => setNewEvent({ ...newEvent, EndTime: text })}
        />
        <TextInput
          placeholder="Destination"
          value={newEvent.Destination}
          onChangeText={(text) => setNewEvent({ ...newEvent, Destination: text })}
        />
        <Button title="Create Event" onPress={handleCreateEvent} />
      </View>
    </View>
  );
};

export default CalendarPage;