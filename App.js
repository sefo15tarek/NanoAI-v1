import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ImageBackground } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import GlassInput from './src/components/GlassInput';
import ChatList from './src/components/ChatList';
import UpdateModal from './src/components/UpdateModal';
import { sendMessage } from './src/services/OpenRouter';
import { checkVersion } from './src/services/VersionCheck';
import { useEffect } from 'react';

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

function MainApp() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const initVersionCheck = async () => {
      const result = await checkVersion();
      if (result.isUpdateAvailable) {
        setUpdateInfo(result);
        setShowUpdateModal(true);
      }
    };
    initVersionCheck();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Start the chat interface UI state
    if (!hasStarted) {
      setHasStarted(true);
    }

    const userMessage = { role: 'user', content: inputText.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const responseMessage = await sendMessage(newMessages);
      setMessages([...newMessages, responseMessage]);
    } catch (error) {
      // In a real app, we might want to show this error as a system message or alert
      setMessages([...newMessages, { role: 'assistant', content: 'عذراً، حدث خطأ. حاول مرة أخرى.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Main App Content */}
          <View style={styles.contentContainer}>
            
            {/* Header/Title - only show prominently if not started */}
            {!hasStarted && (
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Nano Ai</Text>
                <Text style={styles.subtitleText}>كيف يمكنني مساعدتك اليوم؟</Text>
              </View>
            )}

            {/* Chat List - only render if started */}
            {hasStarted && (
              <View style={styles.chatContainer}>
                <ChatList messages={messages} isLoading={isLoading} />
              </View>
            )}

            {/* Input Wrapper - Centers if not started, stays at bottom if started */}
            <View style={[styles.inputWrapper, !hasStarted && styles.inputWrapperCentered]}>
              <GlassInput 
                text={inputText} 
                setText={setInputText} 
                onSend={handleSend} 
                isLoading={isLoading} 
                isCentered={!hasStarted}
              />
            </View>

          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <UpdateModal 
        visible={showUpdateModal} 
        versionData={updateInfo} 
        onDismiss={() => setShowUpdateModal(false)} 
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505', // Deep black
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  titleText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 18,
    marginTop: 10,
  },
  chatContainer: {
    flex: 1,
    width: '100%',
  },
  inputWrapper: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 0 : 20, // Add padding on Android for bottom edge
  },
  inputWrapperCentered: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 0,
  }
});
