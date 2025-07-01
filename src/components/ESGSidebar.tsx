import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { supabase } from '../integrations/supabase/client';
import { useAuthContext } from '../contexts/AuthContext';

const linkClass =
  'block px-4 py-2 rounded hover:bg-green-100 text-left w-full text-gray-800 font-medium text-lg';
const triggerClass =
  'w-full text-left px-4 py-2 text-gray-800 font-medium text-lg flex items-center justify-between focus:outline-none focus:ring-0 focus:ring-offset-0 hover:bg-green-100';
const subLinkClass =
  'block px-4 py-2 rounded hover:bg-green-50 text-left w-full text-gray-800 font-normal text-base';

interface OfficeLocation {
  id: string;
  name: string;
  address: string;
}

const ESGSidebar = () => {
  const { user } = useAuthContext();
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([]);

  useEffect(() => {
    if (user) {
      loadOfficeLocations();
    }
  }, [user]);

  const loadOfficeLocations = async () => {
    try {
      const { data: locations, error } = await supabase
        .from('office_locations')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;

      if (locations && locations.length > 0) {
        setOfficeLocations(locations);
      } else {
        // If no office locations, create a default "Main Office" entry
        const { data: newLocation, error: createError } = await supabase
          .from('office_locations')
          .insert({
            user_id: user.id,
            name: 'Main Office',
            address: 'Default Location'
          })
          .select()
          .single();

        if (createError) throw createError;
        
        setOfficeLocations([newLocation]);
      }
    } catch (error) {
      console.error('Error loading office locations:', error);
    }
  };

  return (
    <aside className="w-72 bg-white border-r min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink to="/my-esg" end className={({ isActive }) => isActive ? `${linkClass} bg-green-200` : linkClass}>
              Connecting Software
            </NavLink>
          </li>
          <Accordion type="multiple" className="border-none">
            <AccordionItem value="environmental">
              <AccordionTrigger className={triggerClass}>Environmental</AccordionTrigger>
              <AccordionContent>
                <ul className="pl-2 space-y-1">
                  <Accordion type="single" collapsible className="border-none">
                    <AccordionItem value="scope-1">
                      <AccordionTrigger className={triggerClass + ' text-base font-semibold pl-4'}>Scope 1</AccordionTrigger>
                      <AccordionContent>
                        <ul className="pl-2 space-y-1">
                          <li>
                            <NavLink to="/my-esg/environmental/scope-1/stationary-combustion" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100` : subLinkClass}>
                              1.a) Stationary Combustion
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/my-esg/environmental/scope-1/process-emissions" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100` : subLinkClass}>
                              1.b) Process Emissions
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/my-esg/environmental/scope-1/mobile-combustion" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100` : subLinkClass}>
                              1.c) Mobile Combustion
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/my-esg/environmental/scope-1/refrigerant-emissions" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100` : subLinkClass}>
                              1.d) Refrigerant Emissions
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/my-esg/environmental/scope-1/coming-soon" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100` : subLinkClass}>
                              1.e) Coming Soon
                            </NavLink>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <li>
                    <NavLink to="/my-esg/environmental/scope-1-result" className={({ isActive }) => isActive ? `${linkClass} bg-green-200` : linkClass}>
                      Scope 1 Result
                    </NavLink>
                  </li>
                  <Accordion type="single" collapsible className="border-none">
                    <AccordionItem value="scope-2">
                      <AccordionTrigger className={triggerClass + ' text-base font-semibold pl-4'}>Scope 2</AccordionTrigger>
                      <AccordionContent>
                        <ul className="pl-2 space-y-1">
                          <Accordion type="single" collapsible className="border-none">
                            <AccordionItem value="electricity">
                              <AccordionTrigger className={triggerClass + ' text-sm font-medium pl-6'}>2.a) Electricity</AccordionTrigger>
                              <AccordionContent>
                                <ul className="pl-4 space-y-1">
                                  {officeLocations.map((location) => (
                                    <li key={location.id}>
                                      <NavLink 
                                        to={`/my-esg/environmental/scope-2/electricity/${location.id}`} 
                                        className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100 text-sm pl-8` : `${subLinkClass} text-sm pl-8`}
                                      >
                                        {location.name}
                                      </NavLink>
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <li>
                            <NavLink to="/my-esg/environmental/scope-2/other-energy" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100` : subLinkClass}>
                              2.b) Other Energy
                            </NavLink>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <li>
                    <NavLink to="/my-esg/environmental/scope-2-result" className={({ isActive }) => isActive ? `${linkClass} bg-green-200` : linkClass}>
                      Scope 2 Result
                    </NavLink>
                  </li>
                  <Accordion type="single" collapsible className="border-none">
                    <AccordionItem value="scope-3">
                      <AccordionTrigger className={triggerClass + ' text-base font-semibold pl-4'}>Scope 3</AccordionTrigger>
                      <AccordionContent>
                        <ul className="pl-2 space-y-1">
                          <Accordion type="single" collapsible className="border-none">
                            <AccordionItem value="waste">
                              <AccordionTrigger className={triggerClass + ' text-sm font-medium pl-6'}>3.a) Waste</AccordionTrigger>
                              <AccordionContent>
                                <ul className="pl-4 space-y-1">
                                  <li>
                                    <NavLink to="/my-esg/environmental/scope-3/waste" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100 text-sm pl-8` : `${subLinkClass} text-sm pl-8`}>
                                      Waste
                                    </NavLink>
                                  </li>
                                  <li>
                                    <NavLink to="/my-esg/environmental/scope-3/waste/paper" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100 text-sm pl-8` : `${subLinkClass} text-sm pl-8`}>
                                      Paper
                                    </NavLink>
                                  </li>
                                  <li>
                                    <NavLink to="/my-esg/environmental/scope-3/waste/water" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100 text-sm pl-8` : `${subLinkClass} text-sm pl-8`}>
                                      Water
                                    </NavLink>
                                  </li>
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <li>
                            <NavLink to="/my-esg/environmental/scope-3/capital-goods" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100` : subLinkClass}>
                              3.b) Coming Soon
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/my-esg/environmental/scope-3/fuel-energy" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100` : subLinkClass}>
                              3.c) Coming Soon
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/my-esg/environmental/scope-3/transportation" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100` : subLinkClass}>
                              3.d) Coming Soon
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/my-esg/environmental/scope-3/business-travel" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100` : subLinkClass}>
                              3.f) Coming Soon
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/my-esg/environmental/scope-3/employee-commuting" className={({ isActive }) => isActive ? `${subLinkClass} bg-green-100` : subLinkClass}>
                              3.g) Coming Soon
                            </NavLink>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <li>
                    <NavLink to="/my-esg/environmental/scope-3-result" className={({ isActive }) => isActive ? `${linkClass} bg-green-200` : linkClass}>
                      Scope 3 Result
                    </NavLink>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="social">
              <AccordionTrigger className={triggerClass}>Social</AccordionTrigger>
              <AccordionContent>
                <ul className="pl-2 space-y-1">
                  <li>
                    <NavLink to="/my-esg/social/employee-profile" className={({ isActive }) => isActive ? `${linkClass} bg-green-200` : linkClass}>
                      Employee Profile
                    </NavLink>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="governance">
              <AccordionTrigger className={triggerClass}>Governance</AccordionTrigger>
              <AccordionContent>
                <ul className="pl-2 space-y-1">
                  <li>
                    <NavLink to="/my-esg/governance" end className={({ isActive }) => isActive ? `${linkClass} bg-green-200` : linkClass}>
                      Governance
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-esg/governance/strategy" className={({ isActive }) => isActive ? `${linkClass} bg-green-200` : linkClass}>
                      Strategy
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-esg/governance/risk-assessment" className={({ isActive }) => isActive ? `${linkClass} bg-green-200` : linkClass}>
                      Risk Assessment
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-esg/governance/metrics-targets" className={({ isActive }) => isActive ? `${linkClass} bg-green-200` : linkClass}>
                      Metrics & Targets
                    </NavLink>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ul>
      </nav>
    </aside>
  );
};

export default ESGSidebar;
