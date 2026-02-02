import React, { useState } from 'react';
import { Download, Search, Mail, Phone, MapPin, Building2, MoreHorizontal } from 'lucide-react';
import { MOCK_LEADS } from '../../lib/partner-constants';
import { LeadStatus } from '../../lib/partner-types';

const LeadsTable: React.FC = () => {
  const [filter, setFilter] = useState('');

  const filteredLeads = MOCK_LEADS.filter(lead => 
    lead.companyName.toLowerCase().includes(filter.toLowerCase()) ||
    lead.contactName.toLowerCase().includes(filter.toLowerCase()) ||
    lead.email.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusStyle = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-blue-100 text-blue-700';
      case LeadStatus.CONTACTED: return 'bg-yellow-100 text-yellow-700';
      case LeadStatus.QUALIFIED: return 'bg-purple-100 text-purple-700';
      case LeadStatus.CONVERTED: return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in mb-12">
      {/* Header Controls */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-6">
        <h2 className="text-lg font-bold text-gray-900">Generated Leads</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB1919]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#BB1919] text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Info</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Captured</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {lead.contactName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{lead.contactName}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Mail size={10} /> {lead.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-900 flex items-center gap-2">
                     <Building2 size={14} className="text-gray-400" /> {lead.companyName}
                   </div>
                   <div className="text-xs text-gray-500 mt-1 flex flex-col gap-0.5">
                     <span className="flex items-center gap-1"><MapPin size={10} /> {lead.country}</span>
                     <span className="flex items-center gap-1"><Phone size={10} /> {lead.phone}</span>
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.capturedAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-[#BB1919]">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
         <span>Showing {filteredLeads.length} entries</span>
         <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-md bg-white disabled:opacity-50 text-gray-600" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-200 rounded-md bg-white text-gray-600 hover:bg-gray-50">Next</button>
         </div>
      </div>
    </div>
  );
};

export default LeadsTable;
