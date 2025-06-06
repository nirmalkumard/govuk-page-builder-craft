
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePageStore } from '../store/pageStore';

const Header = () => {
  const { components } = usePageStore();

  const exportHTML = () => {
    const govukCSS = `
      <link rel="stylesheet" href="https://frontend.design-system.service.gov.uk/frontend/govuk-frontend-4.7.0.min.css">
      <style>
        body { margin: 0; padding: 20px; font-family: "GDS Transport", arial, sans-serif; }
        .govuk-width-container { max-width: 960px; margin: 0 auto; }
      </style>
    `;

    const htmlContent = components.map(component => {
      switch (component.type) {
        case 'button':
          return `<button class="govuk-button" data-module="govuk-button">${component.props.text || 'Button'}</button>`;
        case 'input':
          return `
            <div class="govuk-form-group">
              <label class="govuk-label" for="${component.id}">${component.props.label || 'Label'}</label>
              ${component.props.hint ? `<div class="govuk-hint">${component.props.hint}</div>` : ''}
              <input class="govuk-input" id="${component.id}" name="${component.props.name || component.id}" type="text" ${component.props.required ? 'required' : ''}>
            </div>
          `;
        case 'textarea':
          return `
            <div class="govuk-form-group">
              <label class="govuk-label" for="${component.id}">${component.props.label || 'Label'}</label>
              ${component.props.hint ? `<div class="govuk-hint">${component.props.hint}</div>` : ''}
              <textarea class="govuk-textarea" id="${component.id}" name="${component.props.name || component.id}" rows="5" ${component.props.required ? 'required' : ''}></textarea>
            </div>
          `;
        case 'radios':
          const radioOptions = component.props.options || ['Option 1', 'Option 2'];
          return `
            <div class="govuk-form-group">
              <fieldset class="govuk-fieldset">
                <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">${component.props.label || 'Select an option'}</legend>
                ${component.props.hint ? `<div class="govuk-hint">${component.props.hint}</div>` : ''}
                <div class="govuk-radios" data-module="govuk-radios">
                  ${radioOptions.map((option, index) => `
                    <div class="govuk-radios__item">
                      <input class="govuk-radios__input" id="${component.id}-${index}" name="${component.props.name || component.id}" type="radio" value="${option}">
                      <label class="govuk-label govuk-radios__label" for="${component.id}-${index}">${option}</label>
                    </div>
                  `).join('')}
                </div>
              </fieldset>
            </div>
          `;
        case 'checkboxes':
          const checkboxOptions = component.props.options || ['Option 1', 'Option 2'];
          return `
            <div class="govuk-form-group">
              <fieldset class="govuk-fieldset">
                <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">${component.props.label || 'Select options'}</legend>
                ${component.props.hint ? `<div class="govuk-hint">${component.props.hint}</div>` : ''}
                <div class="govuk-checkboxes" data-module="govuk-checkboxes">
                  ${checkboxOptions.map((option, index) => `
                    <div class="govuk-checkboxes__item">
                      <input class="govuk-checkboxes__input" id="${component.id}-${index}" name="${component.props.name || component.id}" type="checkbox" value="${option}">
                      <label class="govuk-label govuk-checkboxes__label" for="${component.id}-${index}">${option}</label>
                    </div>
                  `).join('')}
                </div>
              </fieldset>
            </div>
          `;
        default:
          return '';
      }
    }).join('\n');

    const fullHTML = `
<!DOCTYPE html>
<html lang="en" class="govuk-template">
<head>
  <meta charset="utf-8">
  <title>GOV.UK Page</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0b0c0c">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${govukCSS}
</head>
<body class="govuk-template__body">
  <script>document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');</script>
  
  <div class="govuk-width-container">
    <main class="govuk-main-wrapper" id="main-content" role="main">
      ${htmlContent}
    </main>
  </div>

  <script src="https://frontend.design-system.service.gov.uk/frontend/govuk-frontend-4.7.0.min.js"></script>
  <script>window.GOVUKFrontend.initAll()</script>
</body>
</html>
    `;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'govuk-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-blue-800 text-white p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">GOV.UK Page Builder</h1>
          <p className="text-blue-100 text-sm">Build accessible government pages</p>
        </div>
        <Button 
          onClick={exportHTML}
          className="bg-white text-blue-800 hover:bg-gray-100"
        >
          <Download className="w-4 h-4 mr-2" />
          Download HTML
        </Button>
      </div>
    </header>
  );
};

export default Header;
