import React, { useState } from 'react';
// import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FloatInOnView from '@/components/FloatInOnView';
import { CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #faffda, #b6e36b)' }}>
      <FloatInOnView>
        <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 animate-fade-in">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto animate-fade-in">
              Ready to transform your sustainability practices? Let's discuss how 
              SustainTech can help your organization achieve its environmental goals.
            </p>
          </div>
        </section>
      </FloatInOnView>
      <FloatInOnView>
        <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-primary mb-6">Let's Start the Conversation</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Whether you're just starting your sustainability journey or looking to 
                  optimize existing programs, our team is here to help. Schedule a consultation 
                  to discuss your specific needs and goals.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-2">Free Consultation</h3>
                      <p className="text-gray-600">Get personalized advice on your sustainability strategy</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-2">Custom Demo</h3>
                      <p className="text-gray-600">See our tools in action with your specific use cases</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-2">Implementation Support</h3>
                      <p className="text-gray-600">Full support from planning to deployment and beyond</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Send us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        name="company"
                        placeholder="Company Name"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Textarea
                        name="message"
                        placeholder="Tell us about your sustainability goals and challenges..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full"
                      />
                    </div>
                    <Button type="submit" className="w-full btn-orange-gradient">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FloatInOnView>
      <FloatInOnView>
        <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl font-bold text-primary mb-4">Other Ways to Reach Us</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center animate-fade-in">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-primary">Email Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">hello@greendatabiz.com</p>
                </CardContent>
              </Card>
              
              <Card className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-primary">Call Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">+852 4690 8682</p>
                </CardContent>
              </Card>
              
              <Card className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-primary">Visit Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Mb64, Smart-Space FinTech 2 (Units 401-404), Level 4, Core C,</p>
                  <p className="text-gray-600">Cyberport, 100 Cyberport Rd, Telegraph Bay</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FloatInOnView>
      <Footer />
    </div>
  );
};

export default Contact;
