import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Shield, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('laws'); // 'laws' or 'protocols'
  const [laws, setLaws] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Mock data - will be replaced with API calls
    setLaws([
      {
        id: '1',
        title: 'المادة الأولى - التعريفات الأساسية',
        content: 'يُقصد بأمن الدولة في هذا القانون الحفاظ على استقرار الدولة...'
      }
    ]);
    
    setProtocols([
      {
        id: '1',
        title: 'بروتوكول التعامل مع التهديدات الإرهابية',
        content: 'في حالة تلقي معلومات عن تهديد إرهابي محتمل...'
      }
    ]);
  }, []);

  const currentData = activeTab === 'laws' ? laws : protocols;
  const setCurrentData = activeTab === 'laws' ? setLaws : setProtocols;

  const handleAdd = () => {
    if (!formData.title || !formData.content) {
      toast({
        title: 'خطأ',
        description: 'الرجاء ملء جميع الحقول',
        variant: 'destructive'
      });
      return;
    }

    const newItem = {
      id: String(currentData.length + 1),
      title: formData.title,
      content: formData.content
    };

    setCurrentData([...currentData, newItem]);
    setFormData({ title: '', content: '' });
    setIsAdding(false);
    toast({
      title: 'نجح',
      description: 'تم الإضافة بنجاح'
    });
  };

  const handleEdit = (id) => {
    const item = currentData.find(item => item.id === id);
    if (item) {
      setFormData({ title: item.title, content: item.content });
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    if (!formData.title || !formData.content) {
      toast({
        title: 'خطأ',
        description: 'الرجاء ملء جميع الحقول',
        variant: 'destructive'
      });
      return;
    }

    setCurrentData(currentData.map(item => 
      item.id === editingId 
        ? { ...item, title: formData.title, content: formData.content }
        : item
    ));
    setFormData({ title: '', content: '' });
    setEditingId(null);
    toast({
      title: 'نجح',
      description: 'تم التحديث بنجاح'
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      setCurrentData(currentData.filter(item => item.id !== id));
      toast({
        title: 'نجح',
        description: 'تم الحذف بنجاح'
      });
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '' });
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <Toaster />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-900 via-purple-900 to-pink-900 text-white py-6 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_c486fc1f-6d38-4395-b181-39a9a2989cf0/artifacts/tdjrzc77_image.png" 
              alt="Vienna RP Logo" 
              className="h-14 w-14 rounded-lg shadow-lg"
            />
            <div className="text-center">
              <h1 className="text-3xl font-bold">لوحة التحكم - Vienna RP</h1>
              <p className="text-pink-200 text-sm">إدارة القوانين والبروتوكلات</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <Button
            onClick={() => setActiveTab('laws')}
            className={`px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 ${
              activeTab === 'laws'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg'
            }`}
          >
            <Shield className="w-5 h-5 ml-2" />
            قوانين أمن الدولة
          </Button>
          <Button
            onClick={() => setActiveTab('protocols')}
            className={`px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 ${
              activeTab === 'protocols'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg'
            }`}
          >
            <FileText className="w-5 h-5 ml-2" />
            بروتوكلات أمن الدولة
          </Button>
        </div>

        {/* Add Button */}
        {!isAdding && !editingId && (
          <div className="mb-8 flex justify-center">
            <Button
              onClick={() => setIsAdding(true)}
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-xl text-lg font-semibold"
            >
              <Plus className="w-5 h-5 ml-2" />
              إضافة جديد
            </Button>
          </div>
        )}

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <Card className="mb-8 bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-pink-200">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl text-center">
                {editingId ? 'تعديل' : 'إضافة جديد'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-right">العنوان</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="أدخل العنوان"
                  className="text-right border-2 border-pink-200 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-right">المحتوى</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="أدخل المحتوى"
                  rows={8}
                  className="text-right border-2 border-pink-200 focus:border-pink-500"
                />
              </div>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={editingId ? handleUpdate : handleAdd}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg"
                >
                  <Save className="w-5 h-5 ml-2" />
                  {editingId ? 'تحديث' : 'حفظ'}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="px-6 py-3 border-2 border-gray-300 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 ml-2" />
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* List */}
        <div className="space-y-4">
          {currentData.map((item) => (
            <Card key={item.id} className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-pink-200/50 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 text-right">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{item.content}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(item.id)}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-3 rounded-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white p-3 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;