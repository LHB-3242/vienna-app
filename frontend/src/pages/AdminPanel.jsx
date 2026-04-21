import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Shield, FileText, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import axios from 'axios';

// تم وضع الرابط مباشرة هنا لحل مشكلة "process is not defined"
const BACKEND_URL = "https://vienna-app-backend.onrender.com"; 
const API = `${BACKEND_URL}/api`;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('laws');
  const [laws, setLaws] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [activeTab, isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'laws' ? 'laws' : 'protocols';
      const response = await axios.get(`${API}/${endpoint}`);
      
      // التأكد أن البيانات مصفوفة لضمان عدم حدوث شاشة بيضاء
      const data = Array.isArray(response.data) ? response.data : [];
      
      if (activeTab === 'laws') setLaws(data);
      else setProtocols(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'خطأ', description: 'فشل في الاتصال بالسيرفر', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '1234') { 
      setIsAuthenticated(true);
      toast({ title: 'نجح', description: 'تم الدخول بنجاح' });
    } else {
      toast({ title: 'خطأ', description: 'كلمة المرور غلط', variant: 'destructive' });
    }
  };

  const currentData = activeTab === 'laws' ? laws : protocols;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 text-right">
        <Toaster />
        <Card className="w-full max-w-md shadow-2xl border-2 border-pink-900/50 bg-gray-800 text-white">
          <CardHeader className="bg-gradient-to-r from-pink-900 to-purple-900 text-white text-center rounded-t-lg">
            <Lock className="w-12 h-12 mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold">دخول الإدارة</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center bg-gray-700 border-pink-900 text-white"
              />
              <Button type="submit" className="w-full bg-pink-700 hover:bg-pink-800 text-white py-6 text-lg font-bold">
                تأكيد الدخول
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-right font-sans" dir="rtl">
      <Toaster />
      <header className="bg-pink-900 text-white py-6 shadow-lg text-center">
        <h1 className="text-3xl font-bold">لوحة إدارة Vienna RP</h1>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 justify-center">
          <Button onClick={() => setActiveTab('laws')} className={`px-6 py-4 rounded-lg font-bold ${activeTab === 'laws' ? 'bg-pink-700 text-white' : 'bg-white text-gray-700'}`}>
            القوانين <Shield className="mr-2" size={18}/>
          </Button>
          <Button onClick={() => setActiveTab('protocols')} className={`px-6 py-4 rounded-lg font-bold ${activeTab === 'protocols' ? 'bg-pink-700 text-white' : 'bg-white text-gray-700'}`}>
            البروتوكولات <FileText className="mr-2" size={18}/>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-700 mx-auto"></div></div>
        ) : (
          <div className="grid gap-4">
            {Array.isArray(currentData) && currentData.length > 0 ? (
              currentData.map((item, index) => (
                <Card key={item.id || index} className="bg-white border-r-4 border-pink-700 shadow-sm">
                  <CardContent className="p-5 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-pink-900">{index + 1}. {item.title}</h3>
                      <p className="text-gray-600 mt-1">{item.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center p-10 bg-white rounded-lg shadow">لا توجد بيانات حالياً في هذا القسم</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
