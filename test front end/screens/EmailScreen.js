//EmailScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';

const emails = [
  { subject: 'Meeting Tomorrow', sender: 'John Doe' },
  { subject: 'Hello!', sender: 'Jane Smith' },
  // Add more email objects as needed
];

export default function EmailsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Add your refresh logic here, then set refreshing to false
    setRefreshing(false);
  };

  const renderEmailItem = ({ item }) => (
    <View style={styles.emailItem}>
      <Text style={styles.senderText}>{item.sender}</Text>
      <Text style={styles.subjectText}>{item.subject}</Text>
    </View>
  );

  const renderSeparator = () => (
    <View style={styles.separator} />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyListText}>No emails to show</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mail Inbox</Text>
      <FlatList
        data={emails}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderEmailItem}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  emailItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  senderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  subjectText: {
    fontSize: 14,
    color: '#666666',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginLeft: 16,
  },
  emptyListContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    color: '#999999',
  },
});
