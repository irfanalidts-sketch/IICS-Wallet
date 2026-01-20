// app/services/OTPService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const OTP_STORAGE_KEY = 'WALLET_OTP_DATA';
const OTP_EXPIRY_MINUTES = 5; // OTP expires in 5 minutes

interface OTPData {
  email: string;
  otp: string;
  expiresAt: string;
  createdAt: string;
}

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP to email (simulated - logs to console)
 * In production, this would call your backend API to send actual email
 */
export const sendOTPToEmail = async (email: string): Promise<{ success: boolean; otp?: string }> => {
  try {
    // Generate OTP
    const otp = generateOTP();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60000);

    const otpData: OTPData = {
      email,
      otp,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    // Store OTP
    const allOTPs = await AsyncStorage.getItem(OTP_STORAGE_KEY);
    const otpStorage: Record<string, OTPData> = allOTPs ? JSON.parse(allOTPs) : {};

    otpStorage[email] = otpData;
    await AsyncStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpStorage));

    // SIMULATED EMAIL SEND - In production, call your backend API here
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 [SIMULATED EMAIL]');
    console.log(`To: ${email}`);
    console.log(`Subject: Your Wallet OTP Verification Code`);
    console.log(`OTP: ${otp}`);
    console.log(`Expires in: ${OTP_EXPIRY_MINUTES} minutes`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return { success: true, otp }; // Return OTP for testing (remove in production)
  } catch (error) {
    console.error('❌ Error sending OTP:', error);
    return { success: false };
  }
};

/**
 * Verify OTP entered by user
 */
export const verifyOTP = async (
  email: string,
  enteredOTP: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const allOTPs = await AsyncStorage.getItem(OTP_STORAGE_KEY);
    if (!allOTPs) {
      return { success: false, message: 'No OTP found. Please request a new one.' };
    }

    const otpStorage: Record<string, OTPData> = JSON.parse(allOTPs);
    const otpData = otpStorage[email];

    if (!otpData) {
      return { success: false, message: 'No OTP found for this email.' };
    }

    // Check if OTP has expired
    const now = new Date();
    const expiresAt = new Date(otpData.expiresAt);

    if (now > expiresAt) {
      // Remove expired OTP
      delete otpStorage[email];
      await AsyncStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpStorage));
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    // Verify OTP
    if (otpData.otp === enteredOTP) {
      // Remove OTP after successful verification
      delete otpStorage[email];
      await AsyncStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpStorage));

      console.log('✅ OTP verified successfully for:', email);
      return { success: true, message: 'OTP verified successfully!' };
    } else {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }
  } catch (error) {
    console.error('❌ Error verifying OTP:', error);
    return { success: false, message: 'Error verifying OTP.' };
  }
};

/**
 * Clear all OTPs (for testing)
 */
export const clearAllOTPs = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(OTP_STORAGE_KEY);
    console.log('✅ All OTPs cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing OTPs:', error);
    return false;
  }
};
