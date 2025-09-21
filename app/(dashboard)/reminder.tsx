import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { Reminder } from '../../types/reminder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReminders, saveReminder, updateRem, deleteRem } from '@/services/reminderService';
import { useAuth } from '@/context/AuthContext';
import { getCurrentUser } from '@/services/authService';

const ReminderApp = () => {
    const { user, loading } = useAuth()
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [formData, setFormData] = useState<Reminder>({
    id: '',
    title: '',
    note: '',
    date: '',
    time: '',
    email: ''
  });

  React.useEffect(() => {
    getAllReminders();
  }, []);

  const theme = {
    light: {
      background: '#ffffff',    
      surface: '#f8f9fa',
      text: '#212121',
      secondaryText: '#757575',
      accent: '#4361ee',
      border: '#e0e0e0',
    },
    dark: {
      background: '#121212',
      surface: '#1e1e1e',
      text: '#f5f5f5',
      secondaryText: '#b0b0b0',
      accent: '#5f75ee',
      border: '#2d2d2d',
    },
  };

  const colors = isDarkTheme ? theme.dark : theme.light;

  const handleInputChange = (name:string, value:string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      note: '',
      date: '',
      time: '',
      email: ''
    });
    setIsEditing(false);
  };

  const openEditModal = (reminder: Reminder) => {
    setFormData(reminder);
    setIsEditing(true);
    setModalVisible(true);
  };

  const addReminder = async () => {
    try {
      if (!formData.title.trim()) {
        Alert.alert('Error', 'Please enter a title for your reminder');
        return;
      }

      const email = await getCurrentUser();
    
      if (email) {
        formData.email = email;
      } else {
        Alert.alert('Error', 'No user is currently logged in');
        return;
      } 
      
      const newReminder: Reminder = {
        id: Date.now().toString(),
        title: formData.title,
        note: formData.note,
        date: formData.date,
        time: formData.time,
        email: formData.email
      };

      await saveReminder(newReminder);
      Alert.alert('Success', 'Reminder added successfully');
      getAllReminders();
      resetForm();
      setModalVisible(false);
    } catch(error) {
      console.error("Error adding reminder:", error);
      Alert.alert('Error', 'Failed to add reminder. Please try again.');
    }
  };

  const updateExistingReminder = async () => {
    try {
      if (!formData.title.trim()) {
        Alert.alert('Error', 'Please enter a title for your reminder');
        return;
      }

      const email = await getCurrentUser();
    
      if (email) {
        formData.email = email;
      } else {
        Alert.alert('Error', 'No user is currently logged in');
        return;
      }

      await updateRem(formData.id, formData);
      Alert.alert('Success', 'Reminder updated successfully');
      getAllReminders();
      resetForm();
      setModalVisible(false);
    } catch(error) {
      console.error("Error updating reminder:", error);
      Alert.alert('Error', 'Failed to update reminder. Please try again.');
    }
  };

  const handleSave = () => {
    if (isEditing) {
      updateExistingReminder();
    } else {
      addReminder();
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      await deleteRem(id);
      Alert.alert('Success', 'Reminder deleted successfully');
      getAllReminders();
    } catch (error) {
      console.error("Error deleting reminder:", error);
      Alert.alert('Error', 'Failed to delete reminder. Please try again.');
    }
  };
  
  const getAllReminders = async () => {
    try {
      const email = user ? user.email : await getCurrentUser();
      console.log("Fetching reminders for email:", email);
      if (email) {
        const reminders = await getReminders();
        const userReminders = reminders.filter(reminder => reminder.email === email);
        console.log("User-specific reminders:", userReminders[0]);
        setReminders(userReminders);
      } else {
        Alert.alert('Error', 'No user is currently logged in');
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
      Alert.alert('Error', 'Failed to fetch reminders. Please try again.');
    }
  };

  const renderReminderItem = (item:Reminder) => (
    <View key={item.id} style={[styles.reminderItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.reminderContent}>
        <Text style={[styles.reminderTitle, { color: colors.text }]}>{item.title}</Text>
        {item.note ? <Text style={[styles.reminderNote, { color: colors.secondaryText }]}>{item.note}</Text> : null}
        <View style={styles.reminderDateTime}>
          {item.date ? <Text style={[styles.reminderDate, { color: colors.secondaryText }]}>{item.date}</Text> : null}
          {item.time ? <Text style={[styles.reminderTime, { color: colors.secondaryText }]}>{item.time}</Text> : null}
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
          <Text style={[styles.editButtonText, { color: colors.accent }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteReminder(item.id)} style={styles.deleteButton}>
          <Text style={[styles.deleteButtonText, { color: '#e53935' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Reminders</Text>
        <TouchableOpacity onPress={() => setIsDarkTheme(!isDarkTheme)} style={styles.themeToggle}>
          <Text style={[styles.themeToggleText, { color: colors.accent }]}>
            {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reminders List */}
      <ScrollView style={styles.remindersList}>
        {reminders.length > 0 ? (
          reminders.map(renderReminderItem)
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.secondaryText }]}>
              No reminders yet. Add one to get started!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Reminder Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.accent }]}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add Reminder</Text>
      </TouchableOpacity>

      {/* Add/Edit Reminder Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          resetForm();
          setModalVisible(false);
        }}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {isEditing ? 'Edit Reminder' : 'Add New Reminder'}
            </Text>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background, 
                color: colors.text, 
                borderColor: colors.border 
              }]}
              placeholder="Title"
              placeholderTextColor={colors.secondaryText}
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
            />
            
            <TextInput
              style={[styles.input, styles.textArea, { 
                backgroundColor: colors.background, 
                color: colors.text, 
                borderColor: colors.border 
              }]}
              placeholder="Note (optional)"
              placeholderTextColor={colors.secondaryText}
              value={formData.note}
              onChangeText={(text) => handleInputChange('note', text)}
              multiline
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background, 
                color: colors.text, 
                borderColor: colors.border 
              }]}
              placeholder="Date (optional) - e.g. 2023-06-15"
              placeholderTextColor={colors.secondaryText}
              value={formData.date}
              onChangeText={(text) => handleInputChange('date', text)}
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background, 
                color: colors.text, 
                borderColor: colors.border 
              }]}
              placeholder="Time (optional) - e.g. 14:30"
              placeholderTextColor={colors.secondaryText}
              value={formData.time}
              onChangeText={(text) => handleInputChange('time', text)}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => {
                  resetForm();
                  setModalVisible(false);
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.accent }]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  {isEditing ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 20,
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  themeToggle: {
    padding: 8,
  },
  themeToggleText: {
    fontWeight: '600',
  },
  remindersList: {
    flex: 1,
    padding: 16,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  reminderNote: {
    fontSize: 14,
    marginBottom: 8,
  },
  reminderDateTime: {
    flexDirection: 'row',
  },
  reminderDate: {
    fontSize: 12,
    marginRight: 12,
  },
  reminderTime: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  editButtonText: {
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ReminderApp;