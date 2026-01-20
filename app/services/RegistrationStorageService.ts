// app/services/RegistrationStorageService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'WALLET_REGISTRATION_DATA';

export interface SecurityQuestions {
  placeOfBirth: string;
  firstSchool: string;
  favoriteColor: string;
  mothersMaidenName: string;
  firstPetName: string;
  childhoodBestFriend: string;
}

export interface RegistrationData {
  walletAddress: string; // PRIMARY KEY
  username: string;
  email: string;
  phoneNumber: string;
  securityQuestions: SecurityQuestions;
  isVerified: boolean;
  registrationDate: string;
  lastLoginDate?: string;
}

/**
 * Check if a user is registered based on wallet address
 */
export const isUserRegistered = async (walletAddress: string): Promise<boolean> => {
  try {
    const data = await getUserRegistration(walletAddress);
    return data !== null && data.isVerified === true;
  } catch (error) {
    console.error('Error checking user registration:', error);
    return false;
  }
};

/**
 * Get user registration data by wallet address
 */
export const getUserRegistration = async (
  walletAddress: string,
): Promise<RegistrationData | null> => {
  try {
    const allData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!allData) return null;

    const registrations: Record<string, RegistrationData> = JSON.parse(allData);
    return registrations[walletAddress] || null;
  } catch (error) {
    console.error('Error getting user registration:', error);
    return null;
  }
};

/**
 * Save user registration data
 */
export const saveUserRegistration = async (
  registrationData: RegistrationData,
): Promise<boolean> => {
  try {
    // Get existing data
    const allData = await AsyncStorage.getItem(STORAGE_KEY);
    const registrations: Record<string, RegistrationData> = allData
      ? JSON.parse(allData)
      : {};

    // Add new registration (wallet address is the key)
    registrations[registrationData.walletAddress] = {
      ...registrationData,
      registrationDate: new Date().toISOString(),
    };

    // Save back to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));

    console.log('✅ Registration saved successfully for:', registrationData.walletAddress);
    return true;
  } catch (error) {
    console.error('❌ Error saving user registration:', error);
    return false;
  }
};

/**
 * Update last login date
 */
export const updateLastLogin = async (walletAddress: string): Promise<boolean> => {
  try {
    const userData = await getUserRegistration(walletAddress);
    if (!userData) return false;

    userData.lastLoginDate = new Date().toISOString();

    const allData = await AsyncStorage.getItem(STORAGE_KEY);
    const registrations: Record<string, RegistrationData> = allData
      ? JSON.parse(allData)
      : {};

    registrations[walletAddress] = userData;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));

    return true;
  } catch (error) {
    console.error('Error updating last login:', error);
    return false;
  }
};

/**
 * Get all registered users (for debugging)
 */
export const getAllRegistrations = async (): Promise<RegistrationData[]> => {
  try {
    const allData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!allData) return [];

    const registrations: Record<string, RegistrationData> = JSON.parse(allData);
    return Object.values(registrations);
  } catch (error) {
    console.error('Error getting all registrations:', error);
    return [];
  }
};

/**
 * Clear all registration data (for testing)
 */
export const clearAllRegistrations = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('✅ All registration data cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing registrations:', error);
    return false;
  }
};
