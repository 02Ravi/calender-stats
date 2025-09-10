import React from 'react';
import { Button, Card, Typography } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { getAuthUrl } from '../lib/api.js';

export default function Login() {
  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md">
        <div className="text-center space-y-4">
          <Typography.Title level={3}>Calendar Statistics</Typography.Title>
          <Typography.Paragraph>
            Sign in with Google to analyze your last 30 days of events.
          </Typography.Paragraph>
          <Button type="primary" icon={<GoogleOutlined />} size="large" onClick={handleLogin}>
            Sign in with Google
          </Button>
        </div>
      </Card>
    </div>
  );
}

