import React, { useState, useEffect } from 'react';
import { Shield, FileText, Lock, Loader2, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import axios from 'axios';

const API = "https://vienna-app-backend.onrender.com/api";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('laws');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/${activeTab}`);
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast({ title: 'خطأ', description: 'فشل الاتصال بالسيرفر', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [activeTab, isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '1234') { 
      setIsAuthenticated(true);
      toast({ title: 'نجح', description: 'أهلاً بك يا مدير' });
    } else {
      toast({ title: 'خطأ', description: 'رمز الدخول غير صحيح', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/${activeTab}/${editingId}`, formData);
      } else {
        await axios.post(`${API}/${activeTab}`, formData);
      }
      setFormData({ title: '', content: '' });
      setIsAdding(false);
      setEditingId(null);
      fetchData();
      toast({ title: 'تم الحفظ', description: 'نجحت العملية' });
    } catch (error) {
      toast({ title: 'خطأ', description: 'فشل حفظ البيانات', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('حذف؟')) {
      try {
        await axios.delete(`${API}/${activeTab}/${id}`);
        fetchData();
        toast({ title: 'تم الحذف', description: 'تم بنجاح' });
      } catch (error) {
        toast({ title: 'خطأ', description: 'فشل الحذف', variant: 'destructive' });
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 text-right" dir="rtl">
        <Toaster />
        <Card className="w-full max-w-md bg-zinc-900 border-pink-900 text-white shadow-2xl">
          <CardHeader className="text-center border-b border-pink-900/50 pb-6">
            <Lock className="w-12 h-12 mx-auto mb-2 text-pink-500" />
            <CardTitle className="text-2xl font-bold">إدارة Vienna RP</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <Input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="text-center bg-zinc-800 border-zinc-700 text-white" />
              <Button type="submit" className="w-full bg-pink-700 hover:bg-pink-800 font-bold py-6">دخول</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white text-right" dir="rtl">
      <Toaster />
      <header className="bg-pink-900/20 border-b border-pink-900/30 py-6 text-center shadow-2xl">
        <h1 className="text-2xl font-black text-pink-500 uppercase tracking-widest">Vienna RP - Admin Panel</h1>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 justify-center">
          <Button onClick={() => setActiveTab('laws')} className={`px-8 py-4 font-bold ${activeTab === 'laws' ? 'bg-pink-600' : 'bg-zinc-800'}`}>القوانين</Button>
          <Button onClick={() => setActiveTab('protocols')} className={`px-8 py-4 font-bold ${activeTab === 'protocols' ? 'bg-pink-600' : 'bg-zinc-800'}`}>البروتوكولات</Button>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-400">{activeTab === 'laws' ? 'قوانين أمن الدولة' : 'بروتوكولات أمن الدولة'}</h2>
          <Button onClick={() => setIsAdding(true)} className="bg-green-600 hover:bg-green-700 font-bold px-6">إضافة جديد +</Button>
        </div>

        {(isAdding || editingId) && (
          <Card className="bg-zinc-900 border-zinc-700 mb-8 overflow-hidden">
            <CardHeader className="bg-zinc-800/50 py-4 flex flex-row justify-between items-center">
              <CardTitle className="text-lg text-pink-400">{editingId ? 'تعديل' : 'إضافة'}</CardTitle>
              <Button size="icon" variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); }}><X /></Button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="العنوان" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="bg-zinc-800 border-zinc-700 text-white" required />
                <Textarea placeholder="المحتوى" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="bg-zinc-800 border-zinc-700 min-h-[150px] text-white" required />
                <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 font-bold py-6">حفظ</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-20"><Loader2 className="w-10 h-10 animate-spin text-pink-500 mx-auto" /></div>
        ) : (
          <div className="space-y-4">
            {data.map((item) => (
              <Card key={item.id || item._id} className="bg-zinc-900 border-zinc-800 group hover:border-pink-900/50 transition-all">
                <CardContent className="p-6 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-pink-400 mb-2">{item.title}</h3>
                    <p className="text-zinc-400 whitespace-pre-wrap">{item.content}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="icon" variant="outline" onClick={() => { setEditingId(item.id || item._id); setFormData({title: item.title, content: item.content}); }} className="border-zinc-700 text-blue-400"><Edit2 className="w-4 h-4" /></Button>
                    <Button size="icon" variant="outline" onClick={() => handleDelete(item.id || item._id)} className="border-zinc-700 text-red-400"><Trash2 className="w-4 h-4" /></Button>
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
