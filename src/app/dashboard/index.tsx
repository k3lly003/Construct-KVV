/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/dashboard/index.tsx
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // If no user data, redirect to login (assuming login is in the visitor pages)
        router.push('/visitor_page/login');
        return; // Important to stop further execution
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/visitor_page/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  // Type guard for user object
  const isValidUser = (
    user: any
  ): user is {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  } => {
    return user && typeof user === 'object' && 'email' in user;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/visitor_page/login');
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading UI
  }

  if (!isValidUser(user)) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>User not logged in.</p>
        <button
          onClick={() => router.push('/visitor_page/login')}
          style={{
            backgroundColor: '#4285F4',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // Use minHeight for better layout
        backgroundColor: '#f0f0f0',
      }}
    >
      {user.picture && (
        <Image
          src={user.picture}
          width={100}
          height={100}
          alt="Profile"
          style={{ borderRadius: '50%', width: '100px', marginBottom: '20px' }}
        />
      )}
      <h2>
        {user.firstName} {user.lastName}
      </h2>
      <p>{user.email}</p>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#f44336',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          marginTop: '20px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;