///home/irfan/WalletOTP/app/components/Views/VerificationScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setRegistrationRegisteredVerified } from '../../actions/user';

const DEMO_OTP = '123456';

const VerificationScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');

  const onVerify = () => {
    if (otp !== DEMO_OTP) {
      Alert.alert('Invalid OTP', 'Please enter the correct OTP');
      return;
    }

    // Mark user fully verified
    dispatch(setRegistrationRegisteredVerified());
  };

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>
        Email Verification
      </Text>

      <Text style={{ marginBottom: 8 }}>
        Enter the OTP sent to your email
      </Text>

      <TextInput
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      <Button title="Verify OTP" onPress={onVerify} />
    </View>
  );
};

export default VerificationScreen;
