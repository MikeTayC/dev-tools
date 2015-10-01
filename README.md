# developer-tools
Magento module that contains developer tools

### Documentation
The Magento module has yet to be created. The *script-generators* directory contains convenient scripts for generating magento install/upgrade scripts. There are some useful tidbits in *tamper-monkey* for those on Google Chrome.

##### Script Generators
1. *product-attribute-script.php*: script for generating an install script for product attributes. Refer to this [google-doc](https://docs.google.com/a/blueacorn.com/spreadsheets/d/1QwDooHvtmwIXLMFcER9PeKrdV_DRWovvVoA9FOvfuwQ/edit?usp=sharing) for a starting point in creating the csv. The script can be used via the command ``php product-attribute-script.php input_file.csv``. An optional second parameter will customize the name of the output file, which is *install-0.1.0.php* by default.
2. *customer-attribute-script.php*: script for generating an install script for customer attributes. The script can be used in the same way as *product-attribute-script.php*; refer to the "Customer Attributes" tab of the linked google doc.

##### Tamper Monkey Scripts
1. *attask-balance.js*: Detects if you are viewing a task in attask and shows you the budget at the top of the page.
2. *magento-auto-login.js*: Detects if you are on a local (.dev) magento admin panel and automatically logs you in with the username/password defined in the script.


### Future Plans
Right now the only plans in the works are easy-to-use data script builders. Please submit issues with new ideas. The sky is the limit.

### Contributing
Any developer should feel free to contribute to this internal developer-tools module. To contribute, create your own feature branch and send an appropriate pull request to SamTay. If you have an idea but are too lazy to build it out yourself, submit an issue.
