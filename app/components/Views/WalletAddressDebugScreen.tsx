// app/components/Views/WalletAddressDebugScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Routes from '../../constants/navigation/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

import Button, {
  ButtonVariants,
  ButtonSize,
  ButtonWidthTypes,
} from '../../component-library/components/Buttons/Button';
import Text from '../../component-library/components/Texts/Text';
import {
  TextColor,
  TextVariant,
} from '../../component-library/components/Texts/Text/Text.types';
import { sendOTPToEmail } from '../../services/OTPService';

const RegistrationWithSecurityScreen = () => {
  const navigation = useNavigation();
  const selectedAddress = useSelector(
    (state: any) =>
      state.engine?.backgroundState?.PreferencesController?.selectedAddress
  );
  // 🧪 MOCK DB DUMP (TEMPORARY)
  const dumpMockDB = async () => {
    try {
      const registrations = await AsyncStorage.getItem('WALLET_REGISTRATION_DATA');
      const otps = await AsyncStorage.getItem('WALLET_OTP_DATA');

      console.log('================ MOCK DB ================');
      console.log('📦 REGISTRATIONS TABLE:');
      console.log(JSON.stringify(JSON.parse(registrations || '{}'), null, 2));
      console.log('---------------------------------------------');
      console.log('🔐 OTP TABLE:');
      console.log(JSON.stringify(JSON.parse(otps || '{}'), null, 2));
      console.log('=============================================');
    } catch (e) {
      console.error('❌ Error dumping mock DB:', e);
    }
  };

useEffect(() => {
  dumpMockDB();
}, []);



  // Registration
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Security questions
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [firstSchool, setFirstSchool] = useState('');
  const [favoriteColor, setFavoriteColor] = useState('');
  const [mothersMaidenName, setMothersMaidenName] = useState('');
  const [firstPetName, setFirstPetName] = useState('');
  const [bestFriendName, setBestFriendName] = useState('');

  const [loading, setLoading] = useState(false);

  const validateFields = (): boolean => {
    if (!username.trim()) {
      Alert.alert('Validation Error', 'Please enter a username');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Please enter a phone number');
      return false;
    }
    if (!placeOfBirth.trim() || !firstSchool.trim() || !favoriteColor.trim() ||
        !mothersMaidenName.trim() || !firstPetName.trim() || !bestFriendName.trim()) {
      Alert.alert('Validation Error', 'Please answer all security questions');
      return false;
    }
    return true;
  };

  const handleSendOtp = async () => {
    if (!validateFields()) return;

    setLoading(true);

    try {
      // Send OTP to email
      const result = await sendOTPToEmail(email.trim().toLowerCase());

      if (result.success) {
        // Store registration data temporarily in navigation params
        const registrationData = {
          walletAddress: selectedAddress,
          username: username.trim(),
          email: email.trim().toLowerCase(),
          phoneNumber: phone.trim(),
          securityQuestions: {
            placeOfBirth: placeOfBirth.trim(),
            firstSchool: firstSchool.trim(),
            favoriteColor: favoriteColor.trim(),
            mothersMaidenName: mothersMaidenName.trim(),
            firstPetName: firstPetName.trim(),
            childhoodBestFriend: bestFriendName.trim(),
          },
        };

        // Navigate to OTP verification with data
        navigation.navigate(Routes.OTP_VERIFICATION, {
          registrationData,
          // In dev mode, pass OTP for easier testing (remove in production)
          __devOTP: result.otp,
        });

        Alert.alert(
          'OTP Sent!',
          `An OTP has been sent to ${email}. Check your console logs for the OTP code.`
        );
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* ===== Registration ===== */}
        <Text variant={TextVariant.DisplayMD} style={styles.title}>
          Registration
        </Text>

        {/* Wallet Address (Read-only) */}
        <Text variant={TextVariant.BodySM} style={styles.label}>
          Wallet Address (read-only)
        </Text>

        <View style={styles.walletBox}>
          <Text style={styles.walletText}>
            {selectedAddress || 'No wallet address found'}
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={!loading}
        />

        {/* ===== Security Questions ===== */}
        <Text variant={TextVariant.DisplaySM} style={styles.sectionTitle}>
          Security Questions
        </Text>

        <Text
          variant={TextVariant.BodySM}
          color={TextColor.Alternative}
          style={styles.subtitle}
        >
          🔐 Answer these to secure your account
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Place of Birth"
          value={placeOfBirth}
          onChangeText={setPlaceOfBirth}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="First School Attended"
          value={firstSchool}
          onChangeText={setFirstSchool}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Favorite Color"
          value={favoriteColor}
          onChangeText={setFavoriteColor}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Mother's Maiden Name"
          value={mothersMaidenName}
          onChangeText={setMothersMaidenName}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="First Pet's Name"
          value={firstPetName}
          onChangeText={setFirstPetName}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Childhood Best Friend's Name"
          value={bestFriendName}
          onChangeText={setBestFriendName}
          editable={!loading}
        />

        {/* ===== Send OTP ===== */}
        <View style={styles.buttonWrapper}>
          <Button
            label={loading ? "Sending OTP..." : "Send OTP"}
            variant={ButtonVariants.Primary}
            size={ButtonSize.Lg}
            width={ButtonWidthTypes.Full}
            onPress={handleSendOtp}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  walletBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  walletText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#FFFAD1',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    marginBottom: 4,
  },
  sectionTitle: {
    marginTop: 30,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonWrapper: {
    marginTop: 10,
  },
});

export default RegistrationWithSecurityScreen;

