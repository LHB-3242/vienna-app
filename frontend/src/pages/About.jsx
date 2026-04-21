import React from 'react';
import { Shield, Users, Award, Target } from 'lucide-react';
import Navbar from '../components/Navbar';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'الأمن والحماية',
      description: 'نضع أمن وسلامة المواطنين في مقدمة أولوياتنا ونعمل على توفير بيئة آمنة للجميع'
    },
    {
      icon: Users,
      title: 'العدالة والمساواة',
      description: 'نلتزم بتطبيق القانون بعدالة ومساواة على الجميع دون استثناء'
    },
    {
      icon: Award,
      title: 'الاحترافية',
      description: 'نعمل بأعلى معايير الاحترافية والجودة في جميع عملياتنا وإجراءاتنا'
    },
    {
      icon: Target,
      title: 'الشفافية',
      description: 'نحرص على الشفافية في جميع أعمالنا ونسعى لبناء ثقة المجتمع'
    }
  ];

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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600">
            من نحن
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            Vienna RP هي منظمة متخصصة في توفير قوانين وبروتوكلات أمن الدولة الشاملة لحماية المجتمع وضمان الاستقرار والأمان للجميع
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-pink-200/50 text-right">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">رؤيتنا</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              أن نكون الجهة الرائدة في وضع وتطبيق قوانين وبروتوكلات أمن الدولة التي تحمي المجتمع وتحافظ على استقراره وتطوره
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">رسالتنا</h2>
            <p className="text-gray-700 leading-relaxed">
              نعمل على تطوير وتطبيق قوانين وبروتوكلات أمنية شاملة تراعي حقوق الإنسان وتضمن العدالة والمساواة للجميع، مع الالتزام بأعلى معايير الاحترافية والشفافية
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
            قيمنا
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">المبادئ التي نلتزم بها في عملنا اليومي</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-pink-200/50 hover:border-pink-400/50 transform hover:scale-105"
              >
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 text-white mb-6 shadow-lg">
                  <value.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-gray-800 text-right">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-right">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-12 shadow-2xl text-center text-white">
            <h2 className="text-3xl font-bold mb-4">تواصل معنا</h2>
            <p className="text-xl mb-8 text-pink-100">لأي استفسارات أو اقتراحات، نحن هنا لخدمتك</p>
            <div className="space-y-3">
              <p className="text-lg">البريد الإلكتروني: info@viennarp.com</p>
              <p className="text-lg">الهاتف: +123 456 7890</p>
              <p className="text-lg">العنوان: Vienna RP Headquarters</p>
            </div>
          </div>
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

export default About;
