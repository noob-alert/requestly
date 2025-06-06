import { useState } from "react";
import { Col, Layout, Row, Switch } from "antd";
import HeaderUser from "layouts/DashboardLayout/MenuHeader/HeaderUser";
import { useNavigate } from "react-router-dom";
import { PricingTable } from "../PricingTable";
import { PRICING } from "features/pricing/constants/pricing";
import { SOURCE } from "modules/analytics/events/common/constants";
import { redirectToRules } from "utils/RedirectionUtils";
import { EnterprisePlanCard } from "./components/EnterprisePlanCard/EnterprisePlanCard";
import { CompaniesSection } from "./components/CompaniesSection/CompaniesSection";
import { StatsCard } from "./components/StatsCard/StatsCard";
// import HowToClaimVolumeDiscounts from "./components/HowToClaimVolumeDiscounts";
import OtherWaysToMakePurchase from "./components/OtherWaysToMakePurchase";
// import { CustomerReviews } from "./components/CustomerReviews/CustomerReviews";
import PricingFAQs from "./components/FAQs";
import PricingPageFooter from "./components/PricingPageFooter";
import EnterpriseRequestBanner from "./components/EnterpriseRequestBanner";
import ProductSwitcher from "../ProductSwitcher";
import "./pricingIndexPage.scss";
import { kebabCase } from "lodash";
import { StudentProgram } from "./components/StudentProgram";
import { isSafariBrowser } from "actions/ExtensionActions";

export const PricingIndexPage = () => {
  const navigate = useNavigate();

  const [activeProduct, setActiveProduct] = useState(
    isSafariBrowser() ? PRICING.PRODUCTS.API_CLIENT : PRICING.PRODUCTS.HTTP_RULES
  );
  const [duration, setDuration] = useState(PRICING.DURATION.ANNUALLY);

  return (
    <div className="pricing-page-wrapper">
      <div className="pricing-page-container">
        <Layout.Header className="pricing-navbar">
          <div className="pricing-navbar-content">
            <img
              className="logo"
              src={"/assets/media/common/rq_logo_full.svg"}
              alt="requestly logo"
              onClick={() => redirectToRules(navigate)}
            />
            <HeaderUser />
          </div>
        </Layout.Header>
        <div className="pricing-page-body-wrapper">
          <EnterpriseRequestBanner />
          <div className="pricing-page-body">
            <div className="page-yellow-text">Plans & pricing</div>
            <div className="pricing-page-title">50,000+ Companies Are Using Requestly Today</div>
            <div className="pricing-page-description">
              More than half of Fortune 500 companies already use Requestly
            </div>
            {!isSafariBrowser() && (
              <ProductSwitcher activeProduct={activeProduct} setActiveProduct={setActiveProduct} />
            )}
            <Row justify="center" className="display-row-center w-full mt-24" gutter={24}>
              <Col className="display-row-center plan-duration-switch-container">
                <Switch
                  checked={duration === PRICING.DURATION.ANNUALLY}
                  onChange={(checked) => {
                    setDuration(checked ? PRICING.DURATION.ANNUALLY : PRICING.DURATION.MONTHLY);
                  }}
                />
                <span className="pricing-page-duartion-label">
                  {" "}
                  Annually<span className="success"> (save 20%)</span>
                </span>
              </Col>
            </Row>
            <div className={`pricing-page-table-wrapper ${kebabCase(activeProduct)}`}>
              <PricingTable duration={duration} source={SOURCE.PRICING_PAGE} product={activeProduct} />
            </div>
            <EnterprisePlanCard product={activeProduct} />
            <StudentProgram source={SOURCE.PRICING_PAGE} />
            <CompaniesSection />
            <StatsCard />
            <OtherWaysToMakePurchase />
            {/* <div className="pricing-page-other-actions-container">
              <HowToClaimVolumeDiscounts />
            </div> */}
            {/* <CustomerReviews /> */}
            <PricingFAQs />
          </div>
          <PricingPageFooter />
        </div>
      </div>
    </div>
  );
};
