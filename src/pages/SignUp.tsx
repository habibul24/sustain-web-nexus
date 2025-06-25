
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    companyName: '',
    businessRegistrationNumber: '',
    jobTitle: '',
    phoneNumber: '',
    serviceNeeded: '',
    preferredContact: 'email'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would handle the form submission
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Demo</h1>
          </div>

          <Card className="shadow-xl border-green-200">
            <CardHeader className="bg-green-50 border-b">
              <div className="bg-blue-100 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700 mb-3">
                  You can also schedule a demo directly using my Calendly:
                </p>
                <Button 
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  <a 
                    href="https://calendly.com/tej-greendatabiz/30min?month=2025-06"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    BOOK VIA CALENDLY
                  </a>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Name*
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="surname" className="text-sm font-medium text-gray-700">
                      Surname*
                    </Label>
                    <Input
                      id="surname"
                      type="text"
                      value={formData.surname}
                      onChange={(e) => handleInputChange('surname', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email*
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                      Company Name*
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="businessRegistrationNumber" className="text-sm font-medium text-gray-700">
                    Business Registration Number
                  </Label>
                  <Input
                    id="businessRegistrationNumber"
                    type="text"
                    value={formData.businessRegistrationNumber}
                    onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
                      Job Title*
                    </Label>
                    <Input
                      id="jobTitle"
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                      Phone Number*
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="serviceNeeded" className="text-sm font-medium text-gray-700">
                    What service you need
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('serviceNeeded', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="esg-courses">ESG & Sustainability Courses</SelectItem>
                      <SelectItem value="greendata-software">GreenData Software</SelectItem>
                      <SelectItem value="gap-assessments">ESG & Sustainability Gap Assessments</SelectItem>
                      <SelectItem value="materiality-assessment">ESG & Sustainability Materiality Assessment</SelectItem>
                      <SelectItem value="reporting">ESG & Sustainability Reporting</SelectItem>
                      <SelectItem value="advisory">ESG & Sustainability Advisory</SelectItem>
                      <SelectItem value="analytics">Business Sustainability Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Preferred contact*
                  </Label>
                  <RadioGroup 
                    value={formData.preferredContact}
                    onValueChange={(value) => handleInputChange('preferredContact', value)}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email-contact" />
                      <Label htmlFor="email-contact" className="text-sm">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone-contact" />
                      <Label htmlFor="phone-contact" className="text-sm">Phone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sms" id="sms-contact" />
                      <Label htmlFor="sms-contact" className="text-sm">Sms/Whatsapp</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-3">
                    I warrant that I am/will be the user and/or subscriber of the Contact Number and/or 
                    Email provided. I have read and agreed to the General Terms and Conditions. I consent that 
                    GreenData to contact me using the contact details provided to discuss the product or service 
                    indicated.*
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <Link 
                      to="/sign-in" 
                      className="text-sm text-green-600 hover:text-green-700 underline"
                    >
                      Already have an account?
                    </Link>
                    
                    <Button 
                      type="submit"
                      className="btn-orange-gradient font-semibold px-8 py-3"
                    >
                      Book a Demo
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SignUp;
