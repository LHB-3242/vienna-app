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
  
  // نظام حماية بسيط للدخول
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
      if (activeTab === 'laws') setLaws(response.data);
      else setProtocols(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'خطأ', description: 'فشل في تحميل البيانات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // وظيفة التحقق من كلمة المرور (تقدر تغير 1234 لأي باسورد تبي)
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

  const handleAdd = async () => {
    if (!formData.title || !formData.content) {
      toast({ title: 'خطأ', description: 'الرجاء ملء جميع الحقول', variant: 'destructive' });
      return;
    }
    try {
      const response = await axios.post(`${API}/rules`, {
        title: formData.title,
        content: formData.content,
        category: activeTab === 'laws' ? 'law' : 'protocol'
      });
      setCurrentData([...currentData, response.data]);
      handleCancel();
      toast({ title: 'نجح', description: 'تم الإضافة بنجاح' });
    } catch (error) {
      toast({ title: 'خطأ', description: 'فشل في الإضافة', variant: 'destructive' });
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${API}/rules/${editingId}`, {
        title: formData.title,
        content: formData.content
      });
      setCurrentData(currentData.map(item => item.id === editingId ? response.data : item));
      handleCancel();
      toast({ title: 'نجح', description: 'تم التحديث بنجاح' });
    } catch (error) {
      toast({ title: 'خطأ', description: 'فشل في التحديث', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      try {
        await axios.delete(`${API}/rules/${id}`);
        setCurrentData(currentData.filter(item => item.id !== id));
        toast({ title: 'نجح', description: 'تم الحذف بنجاح' });
      } catch (error) {
        toast({ title: 'خطأ', description: 'فشل في الحذف', variant: 'destructive' });
      }
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '' });
    setEditingId(null);
    setIsAdding(false);
  };

  // شاشة تسجيل الدخول إذا لم يكن المستخدم موثقاً
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center p-4">
        <Toaster />
        <Card className="w-full max-w-md shadow-2xl border-2 border-pink-200">
          <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center rounded-t-lg">
            <Lock className="w-12 h-12 mx-auto mb-2" />
            <CardTitle className="text-2xl">دخول الإدارة</CardTitle>
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
              <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 text-lg">
                دخول
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // الكود الأساسي للوحة التحكم بعد تسجيل الدخول
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <Toaster />
      <header className="bg-gradient-to-r from-pink-900 via-purple-900 to-pink-900 text-white py-6 px-4 shadow-2xl text-center">
        <h1 className="text-3xl font-bold">لوحة التحكم - Vienna RP</h1>
        <p className="text-pink-200 text-sm">مرحباً بك أيها المسؤول</p>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 justify-center">
          <Button onClick={() => setActiveTab('laws')} className={`px-8 py-6 rounded-xl transition-all ${activeTab === 'laws' ? 'bg-pink-500 text-white shadow-xl scale-105' : 'bg-white text-gray-700'}`}>
            <Shield className="ml-2" /> قوانين أمن الدولة
          </Button>
          <Button onClick={() => setActiveTab('protocols')} className={`px-8 py-6 rounded-xl transition-all ${activeTab === 'protocols' ? 'bg-purple-500 text-white shadow-xl scale-105' : 'bg-white text-gray-700'}`}>
            <FileText className="ml-2" /> بروتوكلات أمن الدولة
          </Button>
        </div>

        {!isAdding && !editingId && (
          <div className="mb-8 flex justify-center">
            <Button onClick={() => setIsAdding(true)} className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-xl text-lg shadow-lg">
              <Plus className="ml-2" /> إضافة جديد
            </Button>
          </div>
        )}

        {(isAdding || editingId) && (
          <Card className="mb-8 border-2 border-pink-200 shadow-xl">
            <CardHeader className="bg-pink-500 text-white"><CardTitle>{editingId ? 'تعديل' : 'إضافة جديد'}</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              <Input placeholder="العنوان" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="text-right" />
              <Textarea placeholder="المحتوى" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={6} className="text-right" />
              <div className="flex justify-center gap-4">
                <Button onClick={editingId ? handleUpdate : handleAdd} className="bg-green-500 text-white px-8"><Save className="ml-2"/> حفظ</Button>
                <Button onClick={handleCancel} variant="outline"><X className="ml-2"/> إلغاء</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div></div>
        ) : (
          <div className="space-y-4">
            {currentData.map((item, index) => (
              <Card key={item.id} className="hover:shadow-xl transition-all border-r-4 border-r-pink-500">
                <CardContent className="p-6 flex justify-between items-start">
                  <div className="text-right flex-1">
                    <h3 className="text-xl font-bold mb-2">{index + 1}. {item.title}</h3>
                    <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
                  </div>
                  <div className="flex gap-2 mr-4">
                    <Button onClick={() => { setEditingId(item.id); setFormData({title: item.title, content: item.content}); }} className="bg-blue-500 text-white"><Edit2 size={18}/></Button>
                    <Button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white"><Trash2 size={18}/></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
