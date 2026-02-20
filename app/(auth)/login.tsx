import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors';
import { Poppins } from '../../constants/Typography';
import api from '../../services/api';

// 1. Import Toast for mobile notifications
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Basic validation using Toast
    if (!email || !password) {
      return Toast.show({
        type: 'error',
        text1: 'Required Fields',
        text2: 'Please enter both email and password'
      });
    }

    setLoading(true);
    
    try {
      // 2. Normalize email to prevent case-sensitive login errors
      const loginPayload = { 
        email: email.toLowerCase().trim(), 
        password 
      };

      const res = await api.post('/auth/login', loginPayload);
      
      // 3. Success Toast
      Toast.show({
        type: 'success',
        text1: 'Welcome Back!',
        text2: 'Successfully signed in to BloodLink'
      });

      await signIn(res.data.token);
      
    } catch (err: any) {
      // 4. Error Toast
      console.log("Login error:", err.response?.data);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: err.response?.data?.message || "Invalid credentials. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue saving lives</Text>

        {/* Email Input Field */}
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={18} color={Colors.textMuted} style={styles.inputIcon} />
          <TextInput 
            style={styles.flex1} 
            placeholder="your@email.com" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            autoCorrect={false}
            keyboardType="email-address"
          />
        </View>

        {/* Password Input Field */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={18} color={Colors.textMuted} style={styles.inputIcon} />
          <TextInput 
            style={styles.flex1} 
            placeholder="........" 
            secureTextEntry={!showPassword} 
            value={password} 
            onChangeText={setPassword} 
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather 
              name={showPassword ? "eye" : "eye-off"} 
              size={18} 
              color={Colors.textMuted} 
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.8 }]} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <MaterialIcons name="login" size={20} color={Colors.white} />
              <Text style={styles.buttonText}>Sign In</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>New to BloodLink? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Create an account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white, 
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: { 
    fontSize: 32, 
    fontFamily: Poppins.bold, 
    color: Colors.secondary, 
    textAlign: 'center', 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    fontFamily: Poppins.regular, 
    color: Colors.textSecondary, 
    textAlign: 'center', 
    marginBottom: 40 
  },
  label: { 
    fontFamily: Poppins.medium, 
    fontSize: 14, 
    color: Colors.secondary, 
    marginBottom: 8, 
    marginTop: 16 
  },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: Colors.border, 
    borderRadius: 12, 
    paddingHorizontal: 15,
    height: 55,
    backgroundColor: '#F9FAFB'
  },
  inputIcon: { 
    marginRight: 12 
  },
  flex1: { 
    flex: 1, 
    fontFamily: Poppins.regular, 
    fontSize: 16, 
    color: Colors.text 
  },
  button: { 
    backgroundColor: Colors.primary, 
    borderRadius: 12, 
    height: 55,
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 35,
    elevation: 4, 
    shadowColor: Colors.primary, 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: { 
    color: Colors.white, 
    fontFamily: Poppins.bold, 
    fontSize: 18,
    marginLeft: 8
  },
  footer: { 
    flexDirection: 'row',
    marginTop: 30, 
    justifyContent: 'center',
    alignItems: 'center' 
  },
  footerText: { 
    fontFamily: Poppins.medium, 
    color: Colors.textSecondary, 
    fontSize: 14 
  },
  linkText: {
    fontFamily: Poppins.bold,
    color: Colors.primary,
    fontSize: 14
  }
});