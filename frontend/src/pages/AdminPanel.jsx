import React, { useState, useEffect } from 'react';
import { Shield, FileText, Lock, Loader2, Plus, Trash2, Save, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import axios from 'axios';

// ملاحظة: الرابط "/api" يعمل تلقائياً إذا كان السيرفر واللوحة في نفس مشروع Vercel
const API = "/api"; 

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('laws'); // 'laws' أو 'protocols'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  // جلب البيانات من السيرفر
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/${activeTab}`);
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast({ 
        title: 'خطأ في الاتصال', 
        description: 'تأكد أن السيرفر يعمل بشكل صحيح', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  // تحديث القائمة عند تغيير التبويب أو تسجيل الدخول
  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [activeTab, isAuthenticated]);

  // دالة الحفظ (إضافة قانون أو بروتوكول جديد)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // نرسل العنوان والمحتوى للسيرفر
      await axios.post(`${API}/${activeTab}`, formData);
      
      setFormData({ title: '', content: '' });
      setIsAdding(false);
      fetchData(); // تحديث القائمة فوراً بعد الحفظ
      toast({ title: 'نجح الحفظ', description: 'تمت إضافة البيانات لقاعدة البيانات' });
    } catch (error) {
      console.error("Submit Error:", error);
      toast({ title: 'فشل الحفظ', description: 'تأكد من إعدادات Vercel و MongoDB', variant: 'destructive' });
    }
  };

  // دالة الحذف
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      try {
        await axios.delete(`${API}/${activeTab}/${id}`);
        fetchData();
        toast({ title: 'تم الحذف', description: 'تم إزالة العنصر بنجاح' });
      } catch (error) {
        toast({ title: 'خطأ', description: 'فشل حذف العنصر', variant: 'destructive' });
      }
    }
  };

  // تسجيل الدخول البسيط
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAuthenticated(true);
    } else {
      toast({ title: 'خطأ', description: 'كلمة المرور غير صحيحة', variant: 'destructive' });
    }
  };

  // شاشة تسجيل الدخول
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
              <Input 
                type="password" 
                placeholder="كلمة المرور" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="text-center bg-zinc-800 border-zinc-700 text-white" 
              />
              <Button type="submit" className="w-full bg-pink-700 hover:bg-pink-800 font-bold py-6 text-lg">دخول</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // اللوحة الأساسية بعد الدخول
  return (
    <div className="min-h-screen bg-zinc-950 text-white text-right" dir="rtl">
      <Toaster />
      <header className="bg-pink-900/20 border-b border-pink-900/30 py-6 text-center shadow-2xl">
        <h1 className="text-2xl font-black text-pink-500 uppercase tracking-widest tracking-tighter">Vienna RP - Control Panel</h1>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* أزرار التنقل */}
        <div className="flex gap-4 mb-8 justify-center">
          <Button 
            onClick={() => setActiveTab('laws')} 
            className={`px-10 py-6 text-lg font-bold transition-all ${activeTab === 'laws' ? 'bg-pink-600 scale-105 shadow-pink-500/20' : 'bg-zinc-800 opacity-70'}`}
          >
            <Shield className="ml-2 w-5 h-5" /> القوانين
          </Button>
          <Button 
            onClick={() => setActiveTab('protocols')} 
            className={`px-10 py-6 text-lg font-bold transition-all ${activeTab === 'protocols' ? 'bg-pink-600 scale-105 shadow-pink-500/20' : 'bg-zinc-800 opacity-70'}`}
          >
            <FileText className="ml-2 w-5 h-5" /> البروتوكولات
          </Button>
        </div>

        {/* رأس القائمة وزر الإضافة */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-400">
            {activeTab === 'laws' ? 'قوانين أمن الدولة' : 'بروتوكولات أمن الدولة'}
          </h2>
          <Button onClick={() => setIsAdding(true)} className="bg-green-600 hover:bg-green-700 px-6 font-bold py-5">
            إضافة جديد <Plus className="mr-2 w-5 h-5" />
          </Button>
        </div>

        {/* فورم الإضافة */}
        export default AdminPanel;
          <Card className="bg-zinc-900 border-zinc-700 mb-8 overflow-hidden animate-in fade-in slide-in-from-top-4">
            <CardHeader className="bg-zinc-800/50 py-4 flex flex-row justify-between items-center">
              <CardTitle className="text-lg text-pink-400">إضافة عنصر جديد</CardTitle>
              <Button size="icon" variant="ghost" onClick={() => setIsAdding(false)}><X className="w-5 h-5 text-zinc-500" /></Button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  placeholder="العنوان (مثال: قانون المرور)" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  className="bg-zinc-800 border-zinc-700 text-white" 
                  required 
                />
                <Textarea 
                  placeholder="محتوى القانون بالتفصيل..." 
                  value={formData.content} 
                  onChange={(e) => setFormData({...formData, content: e.target.value})} 
                  className="bg-zinc-800 border-zinc-700 min-h-[150px] text-white" 
                  required 
                />
                <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 py-6 text-lg font-bold">
                  <Save className="ml-2 w-5 h-5" /> حفظ في قاعدة البيانات
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* عرض البيانات */}
        {loading ? (
          <div className="text-center py-20"><Loader2 className="w-10 h-10 animate-spin text-pink-500 mx-auto" /></div>
        ) : (
          <div className="space-y-4">
            {data.length > 0 ? data.map((item) => (
              <Card key={item.id} className="bg-zinc-900 border-zinc-800 group hover:border-pink-900/50 transition-all">
                <CardContent className="p-6 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-pink-400 mb-2">{item.title}</h3>
                    <p className="text-zinc-400 whitespace-pre-wrap leading-relaxed">{item.content}</p>
                  </div>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => handleDelete(item.id)} 
                    className="border-zinc-700 text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center p-12 border-2 border-dashed border-zinc-800 text-zinc-600 rounded-2xl">
                لا يوجد أي بيانات مضافة حالياً في هذا القسم.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
