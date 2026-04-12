import React, { useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';

export default function ChatList({ messages, isLoading }) {
  const flatListRef = useRef();

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';

    return (
      <View style={[styles.messageWrapper, isUser ? styles.userWrapper : styles.aiWrapper]}>
        <BlurView 
          intensity={20} 
          tint="dark" 
          style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}
        >
          <Text style={styles.messageText}>{item.content}</Text>
        </BlurView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.loadingText}>Nano Ai يكتب...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageWrapper: {
    marginBottom: 15,
    width: '100%',
    flexDirection: 'row',
  },
  userWrapper: {
    justifyContent: 'flex-start', // Arabic reads right to left, but flex-start actually might mean left. Let's force right using flex-end or I18nManager. 
    // In LTR, flex-end is right. Since we are creating Arabic app but without RTL forced, we use flex-end to push to right.
    justifyContent: 'flex-end',
  },
  aiWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'right', // Force RTL text alignment
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
  loadingText: {
    color: '#aaa',
    marginLeft: 10, // Wait, since it's arabic, maybe right margin
    marginRight: 10,
    fontSize: 14,
  }
});
