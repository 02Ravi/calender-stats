import React, { useEffect, useState } from 'react';
import { Layout, Menu, Typography, Row, Col, Card, Statistic, DatePicker, Space, Button, message } from 'antd';
import { Pie, Column } from '@ant-design/plots';
import { fetchMe, fetchStats, logout } from '../lib/api.js';

const { Header, Content } = Layout;

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  useEffect(() => {
    (async () => {
      try {
        const me = await fetchMe();
        setProfile(me);
      } catch (_err) {
        window.location.href = '/login';
      }
    })();
  }, []);

  useEffect(() => {
    if (!profile) return;
    loadStats(days);
  }, [profile, days]);

  async function loadStats(d) {
    try {
      setLoading(true);
      const s = await fetchStats(d);
      setStats(s);
    } catch (err) {
      message.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="text-white font-semibold text-lg">Calendar Statistics</div>
        <Menu theme="dark" mode="horizontal" selectable={false} style={{ marginLeft: 'auto' }}>
          <Menu.Item key="user">
            {profile ? (
              <Space>
                {profile.picture && (
                  <img src={profile.picture} alt="avatar" className="w-6 h-6 rounded-full" />
                )}
                <span className="text-white">{profile.name || profile.email}</span>
                <Button size="small" onClick={handleLogout}>
                  Logout
                </Button>
              </Space>
            ) : (
              <span className="text-white">Loading...</span>
            )}
          </Menu.Item>
        </Menu>
      </Header>
      <Content className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card loading={loading}>
            <Space align="center" className="w-full justify-between">
              <Typography.Title level={4} className="!mb-0">
                Overview (last {days} days)
              </Typography.Title>
              <Space>
                <Button onClick={() => setDays(7)}>7d</Button>
                <Button onClick={() => setDays(30)} type={days === 30 ? 'primary' : 'default'}>
                  30d
                </Button>
                <Button onClick={() => setDays(90)}>90d</Button>
              </Space>
            </Space>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Card loading={loading}>
                <Statistic title="Total events" value={stats?.totalEvents || 0} />
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card loading={loading}>
                <Statistic title="Avg meeting length (min)" value={stats?.avgMeetingLength || 0} />
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card loading={loading}>
                <Statistic title="With guests" value={stats?.guestCount || 0} />
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card loading={loading}>
                <Statistic title="Solo events" value={stats?.soloCount || 0} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Busiest days" loading={loading}>
                <Column
                  data={stats?.charts?.eventsPerDay || []}
                  xField="date"
                  yField="count"
                  xAxis={{ label: { autoHide: true, autoRotate: true } }}
                  height={300}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Solo vs group" loading={loading}>
                <Pie
                  data={stats?.charts?.guestVsSolo || []}
                  angleField="value"
                  colorField="type"
                  height={300}
                />
              </Card>
            </Col>
          </Row>

          <Card loading={loading}>
            <Typography.Paragraph>
              Busiest day: <strong>{stats?.busiestDay || '—'}</strong> ({stats?.busiestCount || 0} events)
            </Typography.Paragraph>
            <Typography.Paragraph>
              % with guests: <strong>{stats?.percentWithGuests || 0}%</strong>
            </Typography.Paragraph>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

