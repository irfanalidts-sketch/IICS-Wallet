///home/irfan/WalletOTP/app/components/Views/SecurityQuestionsScreen.tsx
//this file now is not needed
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Button, {
  ButtonVariants,
  ButtonSize,
  ButtonWidthTypes,
} from '../../component-library/components/Buttons/Button';
import Text from '../../component-library/components/Texts/Text';
import Routes from '../../constants/navigation/Routes';
import { TextColor, TextVariant } from '../../component-library/components/Texts/Text/Text.types';

const SecurityQuestionsScreen = () => {
  const navigation = useNavigation();

  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [firstSchool, setFirstSchool] = useState('');
  const [favoriteColor, setFavoriteColor] = useState('');
  const [mothersMaidenName, setMothersMaidenName] = useState('');
  const [firstPetName, setFirstPetName] = useState('');
  const [bestFriendName, setBestFriendName] = useState('');

  const handleSendOtp = () => {
    navigation.navigate(Routes.OTP_VERIFICATION);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant={TextVariant.DisplayMD} style={styles.title}>
        Security Questions
      </Text>

      <Text variant={TextVariant.BodySM} color={TextColor.Alternative} style={styles.subtitle}>
        🔐 Answer these questions to secure your account
      </Text>

      <TextInput style={styles.input} placeholder="Place of Birth" value={placeOfBirth} onChangeText={setPlaceOfBirth} />
      <TextInput style={styles.input} placeholder="First School Attended" value={firstSchool} onChangeText={setFirstSchool} />
      <TextInput style={styles.input} placeholder="Favorite Color" value={favoriteColor} onChangeText={setFavoriteColor} />
      <TextInput style={styles.input} placeholder="Mother's Maiden Name" value={mothersMaidenName} onChangeText={setMothersMaidenName} />
      <TextInput style={styles.input} placeholder="First Pet's Name" value={firstPetName} onChangeText={setFirstPetName} />
      <TextInput style={styles.input} placeholder="Childhood Best Friend's Name" value={bestFriendName} onChangeText={setBestFriendName} />

      <Button
        label="Send OTP"
        variant={ButtonVariants.Primary}
        size={ButtonSize.Lg}
        width={ButtonWidthTypes.Full}
        onPress={handleSendOtp}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff' },
  title: { marginBottom: 8, textAlign: 'center' },
  subtitle: { marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
  },
});

export default SecurityQuestionsScreen;
