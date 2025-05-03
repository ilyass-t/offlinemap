import React from 'react'
import { useState } from 'react';
import COLORS from "../../constants/colors"
import {useRouter} from "expo-router"
import { View, Text, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { TextInput,TouchableOpacity,ActivityIndicator } from 'react-native';
import {Ionicons} from "@expo/vector-icons"

import styles from "../../assets/styles/signup.styles";
import { useAuthStore } from '../../store/authStore';
export default function signup() {
  const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const {user,isLoading,register }=useAuthStore();


    const handlesignup = async() => {
      const result= await register(username,email,password);
      if(!result.success) Alert.alert("error",result.error); 
    };
    const router=useRouter();
  console.log("user is here",user)
  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <View style={styles.header}>
        <View style={styles.container}>
          <Text style={styles.title}>BookWorm</Text>
          <Text style={styles.subtitle}>share favorite reads</Text>

        </View>
    </View>
    <View style={styles.formContainer}>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>username</Text>
      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={20}
          color={COLORS.primary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="john doe"
          placeholderTextColor={COLORS.placeholderText}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

      </View>

      </View>
      <View style={styles.inputGroup}>
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={20}
          color={COLORS.primary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="john@gmail.com"
          placeholderTextColor={COLORS.placeholderText}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

      </View>

      </View>
      <View style={styles.inputGroup}>
      <Text style={styles.label}>password</Text>
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={COLORS.primary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="*****"
          placeholderTextColor={COLORS.placeholderText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}     />

      </View>

      </View>
      <TouchableOpacity
          style={styles.button}
          onPress={handlesignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>signup</Text>
          )}
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>already have an account?</Text>
          <TouchableOpacity onPress={()=>router.back()}>
            <Text style={styles.link}>login</Text>
          </TouchableOpacity>
</View>
    </View>
    </View>
    </View>
  );
}