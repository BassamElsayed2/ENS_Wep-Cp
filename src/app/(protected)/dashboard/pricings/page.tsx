import PricingsManagement from "@/components/Pricings/PricingsManagement";
import React from "react";

function page() {
  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <PricingsManagement />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
