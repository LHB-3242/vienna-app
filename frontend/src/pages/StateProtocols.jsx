import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StateProtocols = () => {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProtocols();
  }, []);

  const fetchProtocols = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/protocols`);
      setProtocols(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching protocols:', err);
      setError('فشل في تحميل البروتوكلات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-6 shadow-2xl">
            <FileText className="w-12 h-12" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
            بروتوكلات أمن الدولة
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            الإجراءات والبروتوكلات المعتمدة لضمان أمن وسلامة الدولة
          </p>
        </div>
      </section>

      {/* Protocols Section */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">جاري التحميل...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl text-center">
              {error}
            </div>
          )}

          {!loading && !error && protocols.length === 0 && (
            <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-700 px-6 py-4 rounded-xl text-center">
              لا توجد بروتوكلات متاحة حالياً
            </div>
          )}

          {!loading && !error && protocols.length > 0 && (
            <Accordion type="single" collapsible className="space-y-4">
              {protocols.map((protocol, index) => (
                <AccordionItem 
                  key={protocol.id} 
                  value={protocol.id}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                    <div className="flex items-center gap-4 text-right w-full">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                      <span className="text-lg font-semibold text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                        {protocol.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="pt-4 border-t border-purple-200/50">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-right">
                        {protocol.content}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-900 via-purple-900 to-pink-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-pink-200">Vienna RP - جميع الحقوق محفوظة © 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default StateProtocols;