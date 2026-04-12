import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

export default function UpdateModal({ visible, versionData, onDismiss }) {
  if (!versionData) return null;

  const { latestVersion, releaseNotes, isMandatory, updateUrl } = versionData;

  const handleUpdate = () => {
    if (updateUrl) {
      Linking.openURL(updateUrl);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
          <View style={styles.modalContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="cloud-download" size={60} color="#fff" />
            </View>

            <Text style={styles.title}>تحديث جديد متاح!</Text>
            <Text style={styles.versionTag}>الإصدار {latestVersion}</Text>

            <View style={styles.notesWrapper}>
              <Text style={styles.notesTitle}>ما الجديد:</Text>
              <ScrollView style={styles.scrollView}>
                {releaseNotes && releaseNotes.split('\n').map((note, index) => (
                  <View key={index} style={styles.noteLine}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.noteText}>{note}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.updateButtonText}>تحديث الآن</Text>
              </TouchableOpacity>

              {!isMandatory && (
                <TouchableOpacity style={styles.skipButton} onPress={onDismiss}>
                  <Text style={styles.skipButtonText}>لاحقاً</Text>
                </TouchableOpacity>
              )}
            </View>

            {isMandatory && (
              <Text style={styles.mandatoryHint}>هذا التحديث إلزامي لضمان عمل التطبيق.</Text>
            )}
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  blurContainer: {
    width: '85%',
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalContent: {
    padding: 25,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 15,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  versionTag: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    marginBottom: 20,
  },
  notesWrapper: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    maxHeight: 200,
    marginBottom: 25,
  },
  notesTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'right',
  },
  scrollView: {
    width: '100%',
  },
  noteLine: {
    flexDirection: 'row-reverse',
    marginBottom: 5,
  },
  bullet: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  noteText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'right',
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  updateButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  mandatoryHint: {
    color: 'rgba(255,0,0,0.6)',
    fontSize: 12,
    marginTop: 15,
    textAlign: 'center',
  }
});
