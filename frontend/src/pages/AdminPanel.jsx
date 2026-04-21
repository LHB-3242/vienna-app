import React, { useState, useEffect } from 'react';
import { Shield, FileText, Lock, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import axios from 'axios';

// الرابط المباشر بدون استخدام كلمة process المسببة للمشاكل
const API = "https://vienna-app-backend.onrender.com/api";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('laws');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // جلب البيانات من السيرفر
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/${activeTab}`);
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Fetch error:', error);
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
    if (password === '1234') { // الباسورد حقك
      setIsAuthenticated(true);
      toast({ title: 'نجح', description: 'تم الدخول' });
    } else {
      toast({ title: 'خطأ', description: 'رمز الدخول غلط', variant: 'destructive' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4" dir="rtl">
        <Toaster />
        <Card className="w-full max-w-md bg-zinc-900 border-pink-900 text-white shadow-2xl">
          <CardHeader className="text-center border-b border-pink-900/50 pb-6">
            <Lock className="w-12 h-12 mx-auto mb-2 text-pink-500" />
            <CardTitle className="text-2xl font-bold">لوحة إدارة Vienna</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center bg-zinc-800 border-zinc-700 text-white py-6"
              />
              <Button type="submit" className="w-full bg-pink-700 hover:bg-pink-800 py-6 text-lg font-bold">
                دخول النظام
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      <Toaster />
      <header className="bg-pink-900/20 border-b border-pink-900/30 py-8 text-center shadow-2xl">
        <h1 className="text-3xl font-black tracking-widest text-pink-500">VIENNA RP - ADMIN</h1>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex gap-4 mb-10 justify-center">
          <Button onClick={() => setActiveTab('laws')} className={`px-10 py-6 rounded-xl font-bold transition-all ${activeTab === 'laws' ? 'bg-pink-600 shadow-[0_0_20px_rgba(219,39,119,0.4)]' : 'bg-zinc-800'}`}>
            القوانين <Shield className="mr-2" />
          </Button>
          <Button onClick={() => setActiveTab('protocols')} className={`px-10 py-6 rounded-xl font-bold transition-all ${activeTab === 'protocols' ? 'bg-pink-600 shadow-[0_0_20px_rgba(219,39,119,0.4)]' : 'bg-zinc-800'}`}>
            البروتوكولات <FileText className="mr-2" />
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
            <p className="text-zinc-400">جاري سحب البيانات من أمن الدولة...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {data.length > 0 ? data.map((item, index) => (
              <Card key={index} className="bg-zinc-900 border-r-4 border-pink-600 border-l-0 border-t-0 border-b-0">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-pink-400 mb-2">{index + 1}. {item.title}</h3>
                  <p className="text-zinc-300 leading-relaxed">{item.content}</p>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center p-16 border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-500">
                لا توجد بيانات مسجلة حالياً
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
