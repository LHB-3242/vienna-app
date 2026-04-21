import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Shield, FileText, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
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
      
      // حماية: التأكد أن البيانات مصفوفة لعدم حدوث شاشة بيضاء
      const data = Array.isArray(response.data) ? response.data : [];
      
      if (activeTab === 'laws') setLaws(data);
      else setProtocols(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'خطأ', description: 'فشل في تحميل البيانات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '1234') { 
      setIsAuthenticated(true);
      toast({ title: 'نجح', description: 'مرحباً بك في لوحة التحكم' });
    } else {
      toast({ title: 'خطأ', description: 'كلمة المرور غير صحيحة', variant: 'destructive' });
    }
  };

  const currentData = activeTab === 'laws' ? laws : protocols;
  const setCurrentData = activeTab === 'laws' ? setLaws : setProtocols;

  const handleCancel = () => {
    setFormData({ title: '', content: '' });
    setEditingId(null);
    setIsAdding(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center p-4 text-right">
        <Toaster />
        <Card className="w-full max-w-md shadow-2xl border-2 border-pink-200">
          <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center rounded-t-lg">
            <Lock className="w-12 h-12 mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold">دخول الإدارة</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="أدخل كلمة مرور الإدارة"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center border-2 border-pink-100"
              />
              <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 text-lg font-bold shadow-lg">
                دخول
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 text-right">
      <Toaster />
      <header className="bg-gradient-to-r from-pink-900 via-purple-900 to-pink-900 text-white py-6 px-4 shadow-2xl text-center">
        <h1 className="text-3xl font-bold">لوحة التحكم - Vienna RP</h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 justify-center">
          <Button onClick={() => setActiveTab('laws')} className={`px-8 py-6 rounded-xl transition-all font-bold ${activeTab === 'laws' ? 'bg-pink-500 text-white shadow-xl scale-105' : 'bg-white text-gray-700'}`}>
            قوانين أمن الدولة <Shield className="mr-2" />
          </Button>
          <Button onClick={() => setActiveTab('protocols')} className={`px-8 py-6 rounded-xl transition-all font-bold ${activeTab === 'protocols' ? 'bg-purple-500 text-white shadow-xl scale-105' : 'bg-white text-gray-700'}`}>
            بروتوكلات أمن الدولة <FileText className="mr-2" />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div></div>
        ) : (
          <div className="space-y-4">
            {/* استخدام الشرط لضمان عدم حدوث خطأ .map */}
            {Array.isArray(currentData) && currentData.length > 0 ? (
              currentData.map((item, index) => (
                <Card key={item.id || index} className="hover:shadow-xl transition-all border-r-4 border-r-pink-500 bg-white">
                  <CardContent className="p-6 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{index + 1}. {item.title}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center p-10 bg-white rounded-xl shadow">لا توجد بيانات حالياً أو هناك مشكلة في الاتصال بالسيرفر</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
