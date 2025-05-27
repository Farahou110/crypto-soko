
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

const PriceAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      item: 'Rice (1kg)',
      targetPrice: 70,
      currentPrice: 75,
      type: 'below',
      county: 'Nairobi',
      active: true
    },
    {
      id: 2,
      item: 'Tomatoes (1kg)',
      targetPrice: 90,
      currentPrice: 82,
      type: 'above',
      county: 'Kisumu',
      active: true
    },
    {
      id: 3,
      item: 'Beans (1kg)',
      targetPrice: 130,
      currentPrice: 135,
      type: 'below',
      county: 'Mombasa',
      active: false
    },
    {
      id: 4,
      item: 'Maize (1kg)',
      targetPrice: 60,
      currentPrice: 55,
      type: 'above',
      county: 'Nakuru',
      active: true
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    item: '',
    targetPrice: '',
    type: 'below',
    county: 'Nairobi'
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const recentAlerts = [
    {
      item: 'Tomatoes',
      message: 'Price dropped to KSh 82 (target: KSh 90)',
      time: '2 hours ago',
      type: 'success'
    },
    {
      item: 'Cooking Oil',
      message: 'Price increased to KSh 320 (target: KSh 300)',
      time: '5 hours ago',
      type: 'warning'
    },
    {
      item: 'Sugar',
      message: 'Price dropped to KSh 145 (target: KSh 150)',
      time: '1 day ago',
      type: 'success'
    }
  ];

  const handleAddAlert = () => {
    if (newAlert.item && newAlert.targetPrice) {
      const alert = {
        id: alerts.length + 1,
        item: newAlert.item,
        targetPrice: parseFloat(newAlert.targetPrice),
        currentPrice: parseFloat(newAlert.targetPrice) + 10, // Mock current price
        type: newAlert.type,
        county: newAlert.county,
        active: true
      };
      setAlerts([...alerts, alert]);
      setNewAlert({ item: '', targetPrice: '', type: 'below', county: 'Nairobi' });
      setShowAddForm(false);
    }
  };

  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Price Alerts</h2>
          <p className="text-gray-600">Get notified when prices reach your target</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Price Alert</CardTitle>
            <CardDescription>
              Set up notifications for when prices meet your criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <Input
                  placeholder="e.g., Rice (1kg)"
                  value={newAlert.item}
                  onChange={(e) => setNewAlert({...newAlert, item: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Price (KSh)</label>
                <Input
                  type="number"
                  placeholder="e.g., 70"
                  value={newAlert.targetPrice}
                  onChange={(e) => setNewAlert({...newAlert, targetPrice: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Alert Type</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                >
                  <option value="below">Notify when price goes below</option>
                  <option value="above">Notify when price goes above</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">County</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newAlert.county}
                  onChange={(e) => setNewAlert({...newAlert, county: e.target.value})}
                >
                  <option value="Nairobi">Nairobi</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Kisumu">Kisumu</option>
                  <option value="Nakuru">Nakuru</option>
                  <option value="Eldoret">Eldoret</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddAlert}>Create Alert</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>
              Your current price monitoring alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold">{alert.item}</span>
                    <Badge variant={alert.active ? "default" : "secondary"}>
                      {alert.active ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Target: KSh {alert.targetPrice} ({alert.type})</p>
                    <p>Current: KSh {alert.currentPrice} in {alert.county}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAlert(alert.id)}
                  >
                    {alert.active ? 'Pause' : 'Resume'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAlert(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              Latest price alert notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((notification, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className={`p-2 rounded-full ${
                  notification.type === 'success' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {notification.type === 'success' ? (
                    <TrendingDown className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{notification.item}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400">{notification.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PriceAlerts;
