Country Search Component for Webflow
A customizable country and region search component specifically designed for Webflow integration. This component provides an intuitive search experience with features like keyboard navigation, recent searches, and dynamic filtering.

Country Search Preview

Features
🔍 Instant search with fuzzy matching
⌨️ Full keyboard navigation support
🌍 Countries and regions with flags/icons
🕒 Recent searches for returning users
📱 Fully responsive design
🎨 Customizable styling through Webflow classes
⚡ Fast and lightweight
🔄 IP-based user recognition
Quick Start
1. Add Required Scripts
Add the following code to your Webflow site's <head> section (Settings → Custom Code):

<!-- React and ReactDOM -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Country Search Component -->
<script src="https://cdn.jsdelivr.net/npm/country-search-cdn@latest/dist/country-search.min.js"></script>
2. Add the Container Element
Add a DIV element in your Webflow page where you want the search component to appear. Add the following custom attribute:

Set attribute name to: data-country-search
Example:

<div data-country-search></div>
3. Add Initialization Script
Add the following code to your site's <body> section (Settings → Custom Code):

<script>
document.addEventListener('DOMContentLoaded', function() {
  const countrySearchElements = document.querySelectorAll('[data-country-search]');
  
  countrySearchElements.forEach((element, index) => {
    const options = {
      containerClass: element.dataset.containerClass || '',
      inputClass: element.dataset.inputClass || '',
      resultsContainerClass: element.dataset.resultsContainerClass || '',
      regionItemClass: element.dataset.regionItemClass || '',
      countryItemClass: element.dataset.countryItemClass || ''
    };
    
    window.initializeCountrySearch(`country-search-\${index}`, options);
    element.id = `country-search-\${index}`;
  });
});
</script>
Customization
Using Custom Classes
You can customize the appearance of different components using Webflow custom attributes:

<div 
  data-country-search
  data-container-class="my-container-class"
  data-input-class="my-input-class"
  data-results-container-class="my-results-class"
  data-region-item-class="my-region-class"
  data-country-item-class="my-country-class"
>
</div>
Available Customization Attributes
Attribute	Description
data-container-class	Class for the main container
data-input-class	Class for the search input field
data-results-container-class	Class for the results dropdown container
data-region-item-class	Class for region items in results
data-country-item-class	Class for country items in results
Styling Examples
Add these classes in Webflow's style manager:

/* Custom container styling */
.my-container-class {
  max-width: 600px;
  margin: 0 auto;
}

/* Custom input styling */
.my-input-class {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
}

/* Custom results container styling */
.my-results-class {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Custom region item styling */
.my-region-class {
  padding: 12px 16px;
}

/* Custom country item styling */
.my-country-class {
  padding: 12px 16px;
}
Event Handling
The component automatically handles the following events:

Click outside to close results
Keyboard navigation (up/down arrows)
Enter to select
Escape to close
Ctrl+K / Cmd+K to focus search
Browser Support
The Country Search component supports all modern browsers:

Chrome (latest)
Firefox (latest)
Safari (latest)
Edge (latest)
Troubleshooting
Common Issues and Solutions
Component not appearing:

Verify all scripts are properly added in the Custom Code section
Check if the data-country-search attribute is correctly set
Check browser console for any errors
Styling not applying:

Ensure custom classes are properly defined in Webflow
Check if the data-* attributes are correctly set
Verify class names match exactly
Search not working:

Check internet connection (required for IP detection)
Clear browser cache and reload
Verify no JavaScript errors in console
Getting Help
If you encounter any issues:

Check the browser console for error messages
Verify all installation steps are completed
Try clearing your browser cache
Contact support with specific error details
Performance Optimization
The component is optimized for performance:

Lazy loading of results
Debounced search input
Minimal bundle size
Efficient DOM updates
Security
The component includes several security features:

CORS-compliant requests
XSS protection
Secure local storage handling
Rate-limited API calls
Updates and Maintenance
To update to the latest version:

Replace the CDN URL with the latest version
Clear your Webflow cache
Test the component after updating
License
This project is licensed under the MIT License - see the LICENSE file for details.


This README provides comprehensive documentation for implementing and customizing the Country Search component in Webflow. Users can follow the step-by-step instructions and refer to the troubleshooting section if they encounter any issues.
