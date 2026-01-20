///home/irfan/WalletOTP/app/components/Views/RegistrationScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { setRegistrationRegisteredUnverified } from '../../actions/user';
import StorageWrapper from '../../store/storage-wrapper';

const RegistrationScreen: React.FC = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const onSubmit = async () => {
    // Demo-only local storage
    await StorageWrapper.setItem(
      '@registration:profile',
      JSON.stringify({ email, username }),
    );

    // Move to verification flow
    dispatch(setRegistrationRegisteredUnverified());
  };

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>
        Wallet Registration
      </Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      <Button title="Register" onPress={onSubmit} />
    </View>
  );
};

export default RegistrationScreen;
