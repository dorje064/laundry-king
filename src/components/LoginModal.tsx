import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendOtp, verifyOtp } from '../api/auth';
import './LoginModal.scss';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const sendOtpMutation = useMutation({
    mutationFn: (phone: string) => sendOtp(phone),
    onSuccess: () => {
      setStep('OTP');
    },
    onError: (error) => {
      console.error('Failed to send OTP:', error);
      alert('Failed to send OTP. Please try again.');
    }
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: { phone: string; otp: string }) => verifyOtp(data.phone, data.otp),
    onSuccess: (data) => {
      console.log('Login successful:', data);
      onLoginSuccess();
      onClose();
    },
    onError: (error) => {
      console.error('Login failed:', error);
      alert('Invalid OTP. Please try again.');
    }
  });

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    sendOtpMutation.mutate(phone);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtpMutation.mutate({ phone, otp });
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>{step === 'PHONE' ? 'Welcome Back' : 'Enter Verification Code'}</h2>
        <p>
          {step === 'PHONE'
            ? 'Enter your phone number to continue'
            : `We sent a code to +91 ${phone}`}
        </p>

        {step === 'PHONE' ? (
          <form onSubmit={handlePhoneSubmit}>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(val);
                }}
                placeholder="9876543210"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? 'Sending OTP...' : 'Get OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? 'Verifying...' : 'Login'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setStep('PHONE')}
              style={{ marginTop: '0.5rem', width: '100%' }}
            >
              Change Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
