import React from 'react';

export default function MyDataRequests() {
  return (
    <div className="p-8 min-h-screen bg-muted/50">
      <h1 className="text-2xl font-semibold mb-6">My Data Requests</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Pending Requests (0)</h2>
        <div className="bg-muted flex items-center p-4 rounded-2xl text-muted-foreground">
          <span className="mr-2"><i className="fa fa-info-circle" /></span>
          No pending requests found.
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Accepted Requests (0)</h2>
        <div className="bg-muted flex items-center p-4 rounded-2xl text-muted-foreground">
          <span className="mr-2"><i className="fa fa-info-circle" /></span>
          No accepted requests found.
        </div>
      </div>
    </div>
  );
} 