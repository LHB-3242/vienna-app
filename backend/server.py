import React, { useState, useEffect } from 'react';
import { Shield, FileText, Lock, Loader2, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import axios from 'axios';

// الرابط المختصر لأن السيرفر واللوحة في نفس المكان
const API = "/api"; 

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('laws');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/${activeTab}`);
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast({ title: 'خطأ', description: 'لم يتم العثور على البيانات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [activeTab, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/${activeTab}`, formData);
      setFormData({ title: '', content: '' });
      setIsAdding(false);
      fetchData();
      toast({ title: 'تم الحفظ', description: 'تمت الإضافة بنجاح' });
    } catch (error) {
      toast({ title: 'فشل', description: 'تأكد من إعدادات Vercel', variant: 'destructive' });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '1234') setIsAuthenticated(true);
    else toast({ title: 'خطأ', description: 'رمز الدخول خاطئ', variant: 'destructive' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4" dir="rtl">
        <Toaster />
        <Card className="w-full max-w-md bg-zinc-900 text-white">
          <CardHeader className="text-center border-b border-pink-900 pb-6">
            <Lock className="w-12 h-12 mx-auto mb-2 text-pink-500" />
            <CardTitle className="text-2xl font-bold">إدارة Vienna RP</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <Input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-center" />
              <Button type="submit" className="w-full bg-pink-700 hover:bg-pink-800 font-bold py-6">دخول</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white text-right font-arabic" dir="rtl">
      <Toaster />
      <header className="bg-pink-900/20 border-b border-pink-900/30 py-6 text-center">
        <h1 className="text-2xl font-black text-pink-500 uppercase">Vienna RP - Admin Panel</h1>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 justify-center">
          <Button onClick={() => setActiveTab('laws')} className={`px-8 py-4 font-bold ${activeTab === 'laws' ? 'bg-pink-600' : 'bg-zinc-800'}`}>القوانين</Button>
          <Button onClick={() => setActiveTab('protocols')} className={`px-8 py-4 font-bold ${activeTab === 'protocols' ? 'bg-pink-600' : 'bg-zinc-800'}`}>البروتوكولات</Button>
        </div>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-400">{activeTab === 'laws' ? 'قوانين أمن الدولة' : 'بروتوكولات أمن الدولة'}</h2>
          <Button onClick={() => setIsAdding(true)} className="bg-green-600 hover:bg-green-700 px-6 font-bold">إضافة جديد +</Button>
        </div>
        {isAdding && (
          <Card className="bg-zinc-900 border-zinc-700 mb-8 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="العنوان" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="bg-zinc-800 border-zinc-700 text-white" required />
              <Textarea placeholder="المحتوى" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="bg-zinc-800 border-zinc-700 min-h-[150px] text-white" required />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-pink-600 hover:bg-pink-700 font-bold py-6">حفظ</Button>
                <Button type="button" onClick={() => setIsAdding(false)} className="bg-zinc-800 px-6">إلغاء</Button>
              </div>
            </form>
          </Card>
        )}
        {loading ? <div className="text-center py-20"><Loader2 className="w-10 h-10 animate-spin text-pink-500 mx-auto" /></div> : (
          <div className="space-y-4">
            {data.map((item) => (
              <Card key={item.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-pink-400 mb-2">{item.title}</h3>
                  <p className="text-zinc-400">{item.content}</p>
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
