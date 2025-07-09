import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react-native';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Validator, AuthValidationSchemas } from '../../utils/validation';
import type { RegisterRequest } from '../../types/api';

interface FormData extends RegisterRequest {
  confirmPassword: string;
}

export default function RegisterScreen() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register, isAuthenticated, isLoading } = useAuthContext();
  const toast = useToast();
  const networkStatus = useNetworkStatus();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    // Create extended schema that includes confirmPassword validation
    const extendedSchema = {
      ...AuthValidationSchemas.register,
      confirmPassword: {
        required: true,
        custom: (value: string) => {
          if (value !== formData.password) {
            return 'Passwords do not match';
          }
          return null;
        },
      },
    };

    const validation = Validator.validate(formData, extendedSchema);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (!networkStatus.isConnected) {
      toast.error('No internet connection. Please check your network and try again.');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...registerData } = formData;
      
      const result = await register(registerData);
      
      if (result.success) {
        toast.success('Account created successfully!');
        router.replace('/(tabs)');
      } else {
        setErrors({ general: result.error || 'Registration failed' });
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isSubmitting || isLoading;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={48} color="#4f46e5" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the AI Road Trip adventure</Text>
        </View>

        <View style={styles.form}>
          {errors.general && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          )}

          {!networkStatus.isConnected && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                No internet connection. Please check your network.
              </Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
              <Mail size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#6b7280"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                editable={!isFormDisabled}
                returnKeyType="next"
              />
            </View>
            {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, errors.username && styles.inputError]}>
              <User size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#6b7280"
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                editable={!isFormDisabled}
                returnKeyType="next"
              />
            </View>
            {errors.username && <Text style={styles.fieldError}>{errors.username}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <User size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full name (optional)"
                placeholderTextColor="#6b7280"
                value={formData.full_name}
                onChangeText={(value) => handleInputChange('full_name', value)}
                autoCapitalize="words"
                autoComplete="name"
                editable={!isFormDisabled}
                returnKeyType="next"
              />
            </View>
            {errors.full_name && <Text style={styles.fieldError}>{errors.full_name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <Lock size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#6b7280"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                editable={!isFormDisabled}
                returnKeyType="next"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isFormDisabled}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6b7280" />
                ) : (
                  <Eye size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
              <Lock size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor="#6b7280"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                editable={!isFormDisabled}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isFormDisabled}
                accessibilityLabel={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#6b7280" />
                ) : (
                  <Eye size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.fieldError}>{errors.confirmPassword}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.registerButton, isFormDisabled && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isFormDisabled}
            accessibilityLabel="Create account"
          >
            {isSubmitting ? (
              <LoadingSpinner size={20} color="white" />
            ) : (
              <>
                <UserPlus size={20} color="white" />
                <Text style={styles.registerButtonText}>Create Account</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity disabled={isFormDisabled} accessibilityLabel="Go to sign in">
                <Text style={[styles.linkText, isFormDisabled && styles.linkTextDisabled]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f0f23',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  warningContainer: {
    backgroundColor: '#fef3cd',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  warningText: {
    color: '#d97706',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
  },
  eyeIcon: {
    padding: 4,
  },
  fieldError: {
    color: '#ef4444',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    marginLeft: 4,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    gap: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4f46e5',
  },
  linkTextDisabled: {
    opacity: 0.6,
  },
});