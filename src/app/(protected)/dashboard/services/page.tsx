import ServicesManagement from "@/components/Services/ServicesManagement";
import React from "react";

function page() {
  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <ServicesManagement />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
