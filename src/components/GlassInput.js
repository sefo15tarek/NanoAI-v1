import React, { useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

export default function GlassInput({ text, setText, onSend, isLoading, isCentered }) {
  const positionY = useRef(new Animated.Value(0)).current;

  // Animate from center to bottom
  useEffect(() => {
    Animated.spring(positionY, {
      toValue: isCentered ? 0 : 1,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [isCentered]);

  const containerStyle = [
    styles.animatedContainer,
    {
      // If centered, margin is 0 and it relies on center alignment in parent.
      // If not centered, we want it at the bottom.
      // Easiest is to let the parent handle the absolute positioning change,
      // or we can animate translateY here if we know the height.
      // For simplicity, we just keep it as a flex item in parent, and the parent animates its wrapper.
    }
  ];

  return (
    <Animated.View style={containerStyle}>
      <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
        <TextInput
          style={styles.input}
          placeholder="اسأل سيف عن أي شيء..."
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={text}
          onChangeText={setText}
          multiline={false}
          onSubmitEditing={onSend}
          returnKeyType="send"
        />
        <TouchableOpacity 
           style={[styles.sendButton, !text.trim() && { opacity: 0.5 }]} 
           onPress={onSend}
           disabled={isLoading || !text.trim()}
        >
          <Ionicons name="arrow-up" size={20} color="#fff" />
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    minHeight: 40,
    textAlign: 'right', // Arabic alignment
    fontFamily: 'System',
  },
  sendButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  }
});
