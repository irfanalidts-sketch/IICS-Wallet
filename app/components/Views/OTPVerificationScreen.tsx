// app/components/Views/OTPVerificationScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import Routes from '../../constants/navigation/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button, {
  ButtonVariants,
  ButtonSize,
  ButtonWidthTypes,
} from '../../component-library/components/Buttons/Button';
import Text from '../../component-library/components/Texts/Text';
import { TextVariant } from '../../component-library/components/Texts/Text/Text.types';
import { verifyOTP } from '../../services/OTPService';
import { saveUserRegistration, RegistrationData } from '../../services/RegistrationStorageService';

const OtpVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as {
    registrationData: Omit<RegistrationData, 'isVerified' | 'registrationDate'>;
    __devOTP?: string; // Dev mode only
  };

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // 🧪 MOCK DB DUMP (AFTER SAVE)
  const dumpMockDB = async () => {
    try {
      const registrations = await AsyncStorage.getItem('WALLET_REGISTRATION_DATA');

      console.log('================ MOCK DB DUMP (AFTER SAVE) ================');
      console.log(JSON.stringify(JSON.parse(registrations || '{}'), null, 2));
      console.log('===========================================================');
    } catch (e) {
      console.error('❌ Error dumping mock DB:', e);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const email = params.registrationData.email;

      // Verify OTP
      const result = await verifyOTP(email, otp);

      if (!result.success) {
        Alert.alert('Verification Failed', result.message);
        return;
      }

      // OTP verified - now save registration data
      const fullRegistrationData: RegistrationData = {
        ...params.registrationData,
        isVerified: true,
        registrationDate: new Date().toISOString(),
      };

      const saved = await saveUserRegistration(fullRegistrationData);

      if (!saved) {
        Alert.alert('Error', 'Failed to save registration. Please try again.');
        return;
      }

      // 🧪 DUMP MOCK DB AFTER SAVE
      await dumpMockDB();

      Alert.alert(
        'Success! 🎉',
        'Your registration is complete!',
        [
          {
            text: 'Continue',
            onPress: () => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: Routes.ONBOARDING.HOME_NAV }],
                }),
              );
            },
          },
        ],
      );
    }catch (error) {
          console.error('Error verifying OTP:', error);
          Alert.alert('Error', 'An error occurred during verification.');
        } finally {
          setLoading(false);
        }
      };



  // Dev mode helper - show OTP in console
  React.useEffect(() => {
    if (params.__devOTP) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔐 [DEV MODE] Your OTP is:', params.__devOTP);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
  }, [params.__devOTP]);

  return (
    <View style={styles.container}>
      <Text variant={TextVariant.DisplayMD} style={styles.title}>
        Enter OTP
      </Text>

      <Text style={styles.subtitle}>
        Enter OTP sent to {params.registrationData.email}
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
        placeholder="Enter OTP"
        textAlign="center"
        editable={!loading}
        autoFocus
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#037DD6" />
          <Text style={styles.loadingText}>Verifying...</Text>
        </View>
      ) : (
        <Button
          label="Verify OTP"
          variant={ButtonVariants.Primary}
          size={ButtonSize.Lg}
          width={ButtonWidthTypes.Full}
          onPress={handleVerifyOtp}
        />
      )}

      {/* Dev mode indicator */}
      {params.__devOTP && (
        <View style={styles.devModeBox}>
          <Text style={styles.devModeText}>
            🔧 DEV MODE: Check console for OTP
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAD1',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
    color: '#555',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    paddingVertical: 14,
    fontSize: 18,
    marginBottom: 20,
    fontWeight: '600',
    letterSpacing: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#555',
  },
  devModeBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  devModeText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#856404',
  },
});

export default OtpVerificationScreen;

