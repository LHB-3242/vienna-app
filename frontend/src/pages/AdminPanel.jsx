import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Shield, FileText, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import axios from 'axios';

// الحل هنا: كتبنا الرابط مباشرة وحذفنا كلمة process اللي كانت تسبب الانهيار
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
      // هنا بيتم استدعاء الرابط المباشر
      const response = await axios.get(`${API}/${endpoint}`);
      const data = Array.isArray(response.data) ? response.data : [];
      
      if (activeTab === 'laws') setLaws(data);
      else setProtocols(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'خطأ', description: 'السيرفر لا يستجيب، تأكد أن الباكيند يعمل', variant: 'destructive' });
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
      toast({ title: 'خطأ', description: 'الباسورد غلط يا مدير', variant: 'destructive' });
    }
  };

  const currentData = activeTab === 'laws' ? laws : protocols;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-right">
        <Toaster />
        <Card className="w-full max-w-md shadow-2xl border-pink-900 bg-slate-800 text-white">
          <CardHeader className="bg-gradient-to-r from-pink-800 to-purple-800 text-center rounded-t-lg">
            <Lock className="w-12 h-12 mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold">دخول الإدارة</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="أدخل الباسورد"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center bg-slate-700 border-pink-900"
              />
              <Button type="submit" className="w-full bg-pink-700 hover:bg-pink-800 py-6 text-lg">
                تأكيد
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
      <Toaster />
      <header className="bg-pink-900 text-white py-6 shadow-md text-center">
        <h1 className="text-3xl font-bold">Vienna RP - لوحة التحكم</h1>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 justify-center">
          <Button onClick={() => setActiveTab('laws')} className={`px-8 py-4 rounded-lg font-bold ${activeTab === 'laws' ? 'bg-pink-700 text-white shadow-lg' : 'bg-white text-gray-700 border'}`}>
            قوانين أمن الدولة <Shield className="mr-2" />
          </Button>
          <Button onClick={() => setActiveTab('protocols')} className={`px-8 py-4 rounded-lg font-bold ${activeTab === 'protocols' ? 'bg-pink-700 text-white shadow-lg' : 'bg-white text-gray-700 border'}`}>
            بروتوكلات أمن الدولة <FileText className="mr-2" />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-700 mx-auto"></div>
             <p className="mt-4 text-gray-500">جاري التحميل من السيرفر...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <Card key={item.id || index} className="bg-white border-r-8 border-pink-700 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-pink-900">{index + 1}. {item.title}</h3>
                    <p className="text-gray-700 mt-2 leading-relaxed">{item.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center p-12 bg-white rounded-xl shadow border">
                <p className="text-gray-500">لا توجد بيانات حالياً في هذا القسم.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
