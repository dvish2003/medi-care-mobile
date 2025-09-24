import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Modal, 
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { Reminder } from '../../types/reminder';
import { getReminders, saveReminder, updateRem, deleteRem } from '@/services/reminderService';
import { useAuth } from '@/context/AuthContext';
import { getCurrentUser } from '@/services/authService';

const { width, height } = Dimensions.get('window');

const ReminderApp = () => {
  const { user, loading } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(height))[0];
  const buttonScale = useState(new Animated.Value(1))[0];
  
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
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const gradientColors = ['#BDCDCF', '#034c36', '#003333'];

  const colors = {
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#003333',
    secondaryText: '#034c36',
    accent: '#BDCDCF',
    border: '#BDCDCF',
    gradient: gradientColors,
  };

  const handleInputChange = (name: string, value: string) => {
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
    animateModalIn();
  };

  const animateModalIn = () => {
    setModalVisible(true);
    slideAnim.setValue(height);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 0.9,
        useNativeDriver: true,
      })
    ]).start();
  };

  const animateModalOut = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      })
    ]).start(() => {
      setModalVisible(false);
      resetForm();
    });
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
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
      animateModalOut();
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
      animateModalOut();
    } catch(error) {
      console.error("Error updating reminder:", error);
      Alert.alert('Error', 'Failed to update reminder. Please try again.');
    }
  };

  const handleSave = () => {
    animateButtonPress();
    if (isEditing) {
      updateExistingReminder();
    } else {
      addReminder();
    }
  };

  const deleteReminder = async (id: string) => {
    animateButtonPress();
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

  const renderReminderItem = (item: Reminder, index: number) => (
    <Animated.View 
      key={item.id} 
      style={[
        styles.reminderItem, 
        { 
          backgroundColor: colors.surface, 
          borderColor: colors.border,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50 * (index + 1), 0]
            })
          }],
          opacity: fadeAnim
        }
      ]}
    >
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
    </Animated.View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Gradient Background */}
      <Animated.View 
        style={[
          styles.gradientBackground,
          {
            backgroundColor: colors.gradient[0],
          }
        ]} 
      />
      
      {/* Header with Add Button */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Reminders</Text>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.accent }]}
            onPress={() => {
              resetForm();
              animateModalIn();
            }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Reminders List */}
      <ScrollView style={styles.remindersList}>
        {reminders.length > 0 ? (
          reminders.map((item, index) => renderReminderItem(item, index))
        ) : (
          <Animated.View 
            style={[
              styles.emptyState,
              { opacity: fadeAnim }
            ]}
          >
            <Text style={[styles.emptyStateText, { color: colors.text }]}>
              No reminders yet. Tap + to add one!
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Add/Edit Reminder Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={animateModalOut}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY: slideAnim }],
                backgroundColor: colors.surface,
                borderColor: colors.border
              }
            ]}
          >
            <View style={styles.modalContent}>
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
                  onPress={animateModalOut}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity 
                    style={[styles.modalButton, { backgroundColor: colors.accent }]}
                    onPress={handleSave}
                  >
                    <Text style={styles.saveButtonText}>
                      {isEditing ? 'Update' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
  },
  remindersList: {
    flex: 1,
    padding: 16,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  reminderNote: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  reminderDateTime: {
    flexDirection: 'row',
    gap: 12,
  },
  reminderDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  reminderTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(189, 205, 207, 0.2)',
  },
  editButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
  },
  deleteButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: '#003333',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: height * 0.8,
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#003333',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default ReminderApp;