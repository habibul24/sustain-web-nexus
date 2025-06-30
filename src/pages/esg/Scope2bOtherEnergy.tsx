
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';

const Scope2bOtherEnergy = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Scope 2b Other Energy Carbon Emission Calculations</h1>
      <Accordion type="single" collapsible defaultValue="info" className="mb-6">
        <AccordionItem value="info">
          <AccordionTrigger className="text-base font-semibold">What are Scope 2b emissions?</AccordionTrigger>
          <AccordionContent>
            <div className="text-gray-700">
              Scope 2b emissions cover other forms of purchased energy beyond electricity, such as steam, heating, cooling, and compressed air that is consumed in your Company's owned or controlled equipment.
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <div className="text-center py-8 text-gray-500">
          This section is under development. Please proceed to the next step.
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button className="bg-green-500 hover:bg-green-600 text-white px-8" onClick={() => navigate('/my-esg/environmental/scope-2-result')}>Next</Button>
      </div>
    </div>
  );
};

export default Scope2bOtherEnergy;
