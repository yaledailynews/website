import { Banner } from "@payloadcms/ui/elements/Banner";
import React from "react";

import "./index.scss";

const baseClass = "before-dashboard";

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to the new Yale Daily News CMS!</h4>
      </Banner>
      Please let us know if you have any questions or feedback. You can reach
      Josh at <a href="mailto:josh.chang@yale.edu">josh.chang@yale.edu</a>.
    </div>
  );
};

export default BeforeDashboard;
