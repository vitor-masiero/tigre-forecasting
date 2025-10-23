import React from 'react';
import Step1Basic from './Step1Basic';
import Step2DataSelection from './Step2DataSelection';
import Step3Factors from './Step3Factors';
import Step4Review from './Step4Review';

export default function ConfigurationSteps({ 
  currentStep, 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep 
}) {
  return (
    <>
      {currentStep === 1 && (
        <Step1Basic
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
        />
      )}
      {currentStep === 2 && (
        <Step2DataSelection
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {currentStep === 3 && (
        <Step3Factors
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {currentStep === 4 && (
        <Step4Review
          formData={formData}
          prevStep={prevStep}
        />
      )}
    </>
  );
}
