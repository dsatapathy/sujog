import axios from "axios";
import React, { useState } from "react";
import Select from "react-select";
import { ALL_TENANTS_FROM_MDMS } from "../../utils/tanentInfo";
import { ULB_MICROSITES } from "../../utils/ulbMicrosites";
import usePageLocalization from "../../utils/usePageLocalization";
import { connect, useSelector } from "react-redux";

import "./index.css";

const TPA = ({ language }) => {
  const translations = usePageLocalization(language, 'tpa');
  const ulbTranslation = usePageLocalization(language,'ulb')
  const serviceOptions = [
    { value: "WS", label: `${translations.waterSewerageTitle}` },
    { value: "PT", label: `${translations.propertyTaxTitle}` },
    { value: "TL", label: `${translations.tradeLicenseTitle}` },
    { value: "BPA", label: `${translations.bpaTitle}` },
    { value: "MR", label: `${translations.marriageRegistrationTitle}` },
  ];
  const ulbDropdownOptions = ALL_TENANTS_FROM_MDMS.map((each) => ({
    value: each.code,
    label: ulbTranslation[each.code],
  }))
    .sort((a, b) => {
      return a.label > b.label ? 1 : -1;
    });
    const CONSUMER_NO_PLACEHOLDER_MAPPER = {
      PT: translations.propertyId,
      TL: translations.tradeLicenseNumber,
      WS: translations.connectionNo,
      MR: translations.mrNo,
      BPA: "Application Number",
    };
  const [formData, setFormData] = useState({
    tenantId: "",
    businessService: "",
    consumerNo: "",
  });
  const [result, setResult] = useState({
    businessService: "",
    consumerNo: "",
    status: "",
    tenantId: "",
    owner: [],
    address: ''
  });
  const [errMsg, setErrMsg] = useState({
    tenantId: "",
    businessService: "",
    consumerNo: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [serverError, setServerError] = useState(false);
  const handleFormChange = (id, value) => {
    setFormData({
      ...formData,
      [id]: value,
    });
  };
  const searchAction = async () => {
    try {
      const requesrtBody = {
        tenantId: formData["tenantId"]["value"],
        businessService: formData["businessService"]["value"],
        consumerNo: formData["consumerNo"],
      };
      const response = await axios.post(
        "https://sujog.odisha.gov.in/integration-services/consumer/_verification",
        requesrtBody,
        {
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      );
      const consumerInfo = response.data.consumerVerificationInfo;
      const resultObj = {
        businessService: consumerInfo["businessService"],
        consumerNo: consumerInfo["consumerNo"],
        status: consumerInfo["status"],
        tenantId: consumerInfo["tenantId"],
        owner: consumerInfo["owners"] ? [...consumerInfo["owners"]] : [],
        address: consumerInfo["address"],
      };
      setResult({
        ...resultObj,
      });
      setShowResult(true);
      setServerError(false);
    } catch (error) {
      console.log(error);
      setShowResult(false);
      setServerError(true);
    }
  };
  const validateForm = () => {
    const errMsgObj = {
      tenantId: "",
      businessService: "",
      consumerNo: "",
    };
    let hasError = false;
    const isTenantValid = formData["tenantId"] && formData["tenantId"]["value"];
    const isServiceValid =
      formData["businessService"] && formData["businessService"]["value"];
    const isConsumerNoValid = formData["consumerNo"];

    if (!isTenantValid) {
      errMsgObj["tenantId"] = "Provide City.";
      hasError = true;
    }
    if (!isServiceValid) {
      errMsgObj["businessService"] = "Provide Service.";
      hasError = true;
    }
    if (!isConsumerNoValid) {
      if (formData["businessService"] && formData["businessService"]["value"]) {
        errMsgObj["consumerNo"] =
          "Provide " +
          CONSUMER_NO_PLACEHOLDER_MAPPER[formData["businessService"]["value"]] +
          ".";
      }
      hasError = true;
    }
    setErrMsg({
      ...errMsgObj,
    });
    return hasError;
  };
  const handleFormSubmit = async () => {
    const hasError = validateForm();
    if (!hasError) {
      searchAction();
    } else {
      setShowResult(false);
    }
  };
  return (
    <>
      <section class="breadcrumbs">
        <div class="container">
          <div class="d-flex justify-content-between align-items-center">
            <h2>{translations.tpaVerification}</h2>
            <ol>
              <li>
                <a href="/home">{translations.home}</a>
              </li>
              <li>{translations.tpaVerification}</li>
            </ol>
          </div>
        </div>
      </section>

      <div className="tpa-body">
        <div className="tpa-card">
          <div className="tpa-form-sec">
            <div className="tpa-form-item">
              <label>
                {translations.city} <span className="tpa-reqd">*</span>{" "}
              </label>
              <Select
                placeholder={translations.selectCity}
                value={formData["tenantId"]}
                onChange={(value) => handleFormChange("tenantId", value)}
                options={ulbDropdownOptions}
              />
              <div className="tps-err-msg">{errMsg["tenantId"]}</div>
            </div>
            <div className="tpa-form-item">
              <label>
                {translations.service} <span className="tpa-reqd">*</span>{" "}
              </label>
              <Select
                placeholder={translations.selectService}
                value={formData["businessService"]}
                onChange={(value) => handleFormChange("businessService", value)}
                options={serviceOptions}
              />
              <div className="tps-err-msg">{errMsg["businessService"]}</div>
            </div>
            {formData["businessService"] &&
              formData["businessService"]["value"] && (
                <div className="tpa-form-item">
                  <label>
                    {
                      CONSUMER_NO_PLACEHOLDER_MAPPER[
                      formData["businessService"]["value"]
                      ]
                    }
                    <span className="tpa-reqd">*</span>
                  </label>
                  <input
                    className="tpa-form-input"
                    onChange={(e) =>
                      handleFormChange("consumerNo", e.target.value)
                    }
                  />
                  <div className="tps-err-msg">{errMsg["consumerNo"]}</div>
                </div>
              )}
            <div className="tpa-form-item">
              <div className="tpa-server-error">
                {serverError &&
                  "Some error occured at the server end. Kindly try after sometime."}
              </div>
              <button className="tpa-submit-btn" onClick={handleFormSubmit}>
                {translations.search}
              </button>
            </div>
          </div>
          <div className={`${showResult ? "tpa-result-sec" : "rslt-hide"}`}>
            {showResult && (
              <div className="tpa-result-cntr">
                <div className="tpa-result-hdr">{translations.searchREsult}</div>
                <div className="tpa-result-body">
                  {result["consumerNo"] ? (
                    <>
                      <div className="tpa-rslt-item">
                        <label className="tpa-rslt-lbl">{translations.consumerId}</label>
                        <span className="tpa-colon">:</span>
                        <span>{result["consumerNo"]}</span>
                      </div>
                      <div className="tpa-rslt-item">
                        <label className="tpa-rslt-lbl">{translations.status}</label>
                        <span className="tpa-colon">:</span>
                        <span>{result["status"]}</span>
                      </div>
                      <div className="tpa-rslt-item">
                        <label className="tpa-rslt-lbl">{translations.address}</label>
                        <span className="tpa-colon">:</span>
                        <span>{result["address"]}</span>
                      </div>
                      <hr />
                      <div className="tpr-ownr-info-hdr">{translations.ownerInfo}</div>
                      {result["owner"] && result["owner"].length > 0
                        ? result["owner"].map((each, index) => (
                          <div key={`tpr-rslt-key-${index}`}>
                            <div className="tpa-rslt-item">
                              <label className="tpa-rslt-lbl">
                                {translations.ownerName}
                              </label>
                              <span className="tpa-colon">:</span>
                              <span>{each["name"]}</span>
                            </div>
                            <div className="tpa-rslt-item">
                              <label className="tpa-rslt-lbl">{translations.address}</label>
                              <span className="tpa-colon">:</span>
                              <span>{each["address"] || 'NA'}</span>
                            </div>
                            {index + 1 !== result["owner"].length && (
                              <hr className="tpr-divider-owner" />
                            )}
                          </div>
                        ))
                        : translations.noOwnerFound}
                    </>
                  ) : (
                    <div className="tpa-no-data">{translations.noDetailsFound}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  language: state.localization.language,
});

export default connect(mapStateToProps)(TPA);
