import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'قوانين أمن الدولة',
      description: 'تعرف على القوانين الأساسية لحماية أمن الدولة والمواطنين',
      link: '/state-security-laws',
      gradient: 'from-pink-500 to-purple-500'
    },
    {
      icon: FileText,
      title: 'بروتوكلات أمن الدولة',
      description: 'الإجراءات والبروتوكلات المعتمدة لضمان الأمن والسلامة',
      link: '/state-security-protocols',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              <img 
                src="https://customer-assets.emergentagent.com/job_c486fc1f-6d38-4395-b181-39a9a2989cf0/artifacts/tdjrzc77_image.png" 
                alt="Vienna RP Logo" 
                className="relative h-32 w-32 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 animate-gradient">
            القوانين
          </h1>
          
          <div className="flex justify-center items-center gap-3 mb-8">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full"></div>
            <p className="text-xl sm:text-2xl text-purple-700 font-medium">الرئيسية • القوانين</p>
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full"></div>
          </div>

          {/* CTA Button */}
          <Link 
            to="/state-security-laws"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 group"
          >
            <span>استعرض القوانين</span>
            <ChevronLeft className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform duration-300" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
            الأقسام
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">اختر القسم المناسب لعرض القوانين والبروتوكلات</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-pink-200/50 hover:border-pink-400/50 transform hover:scale-105 hover:-translate-y-2"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
                
                {/* Arrow */}
                <div className="flex items-center gap-2 text-pink-600 font-medium group-hover:gap-4 transition-all duration-300">
                  <span>اقرأ المزيد</span>
                  <ChevronLeft className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-900 via-purple-900 to-pink-900 text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <img 
              src="https://customer-assets.emergentagent.com/job_c486fc1f-6d38-4395-b181-39a9a2989cf0/artifacts/tdjrzc77_image.png" 
              alt="Vienna RP Logo" 
              className="h-16 w-16 rounded-lg shadow-lg"
            />
          </div>
          <p className="text-pink-200 text-lg mb-2">Vienna RP - جميع الحقوق محفوظة © 2024</p>
          <p className="text-pink-300/70">تم التطوير بواسطة فريق Vienna RP</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;