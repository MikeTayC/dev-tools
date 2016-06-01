<?php 
echo 'Generating install script...' . PHP_EOL . PHP_EOL;

$scriptName = !empty($argv[2]) ? $argv[2] : 'install-0.1.0.php';
$scriptFile = fopen($scriptName, 'w') or die("Couldn't open new $scriptName file");

$csvFile = $argv[1];
$rows = array_map('str_getcsv', file($csvFile));
$scriptKeys = array(
  'label',
  'group',
  'type',
  'input',
  'global',
  'required',
  'unique',
  'visible',
  'adminhtml_only',
  'admin_checkout',
  'input_validation',
  'max_text_length',
  'min_text_length',
  'used_for_price_rules',
  'source',
  'backend',
  'frontend',
  'sort_order',
);
$inputKeys = null;
// Grab the main attribute keys header, discard unnecessary header rows
foreach($rows as $row) {
  if (!in_array('name', $row) && !in_array('type', $row)) {
    array_shift($rows);
  } else {
    $inputKeys = array_shift($rows);
    break;
  }
}
// Sanitize attribute keys from input and link with associated index (column identifier)
$attributeKeys = array();
foreach($scriptKeys as $key) {
  $index = array_search($key, $inputKeys);
  if ($index !== false) {
    $attributeKeys[$index] = $key;
  }
}
$nameIndex = array_search('name', $inputKeys);
if ($nameIndex === false) {
  die("Couldn't find 'name' column for attributes");
}
$visibilityIndex = array_search('visible', $inputKeys);
unset($scriptKeys);
unset($inputKeys);

// Begin install script string
$script = '<?php' . PHP_EOL
  . '$installer = Mage::getResourceModel(\'customer/setup\', \'core_setup\');' . PHP_EOL
  . '$installer->startSetup();' . PHP_EOL . PHP_EOL;

// Write $installer->addAttribute() for each row beneath the attribute keys header
foreach($rows as $row) {
  if (empty($row[$nameIndex])) {
    continue;
  }
  $script .= '$installer->addAttribute(\'customer\', \'' . $row[$nameIndex] . '\', array(' . PHP_EOL;
  $validateRules = array();
  foreach($attributeKeys as $index => $attributeKey) {
    if (empty($row[$index])) {
      continue;
    }
    if (in_array($attributeKey, array('input_validation', 'max_text_length', 'min_text_length'))) {
      $validateRules[$attributeKey] = $row[$index];
      continue;
    }
    if (!($row[$index] == 'true' || $row[$index] == 'false' || strpos($row[$index], 'Mage_') === 0)) {
      $row[$index] = '\'' . $row[$index] . '\'';
    }
    $script .= '  \'' . $attributeKey . '\' => ' . $row[$index] . ',' . PHP_EOL;
  }
  $script .= '  \'validate_rules\' => \'' . serialize($validateRules) . '\',' . PHP_EOL;
  $script .= '  \'user_defined\' => true,' . PHP_EOL;
  $script .= '  \'system\' => false,' . PHP_EOL;
  $script .= '));' . PHP_EOL . PHP_EOL;
}

$script .= '// Set used_in_forms on visible attributes' . PHP_EOL;
$script .= '$visibleAttributes = array(' . PHP_EOL;
foreach($rows as $row) {
  if (!empty($row[$visibilityIndex]) && $row[$visibilityIndex] != 'false') {
    $script .= '  \'' . $row[$nameIndex] . '\',' . PHP_EOL;
  }
}
$script .= ');' . PHP_EOL;

$script .= 'foreach($visibleAttributes as $attr) {' . PHP_EOL;
$script .= '  $attribute = Mage::getSingleton(\'eav/config\')->getAttribute(\'customer\', $attr);' . PHP_EOL;
$script .= '  $usedInForms = array(' . PHP_EOL;
$script .= '    \'customer_account_create\',' . PHP_EOL;
$script .= '    \'customer_account_edit\',' . PHP_EOL;
$script .= '    \'checkout_register\'' . PHP_EOL;
$script .= '  );' . PHP_EOL;
$script .= '  if (!empty($attribute[\'adminhtml_only\'])) {' . PHP_EOL;
$script .= '    $usedInForms = array(\'adminhtml_customer\');' . PHP_EOL;
$script .= '  } else {' . PHP_EOL;
$script .= '    $usedInForms[] = \'adminhtml_customer\';' . PHP_EOL;
$script .= '  }' . PHP_EOL;
$script .= '  if (!empty($attribute[\'admin_checkout\'])) {' . PHP_EOL;
$script .= '    $usedInForms[] = \'adminhtml_checkout\';' . PHP_EOL;
$script .= '  }' . PHP_EOL;
$script .= '  $attribute->setData(\'used_in_forms\', $usedInForms)->save();' . PHP_EOL;
$script .= '}' . PHP_EOL . PHP_EOL;

$script .= '$installer->endSetup();' . PHP_EOL;

echo 'Writing to file...' . PHP_EOL . PHP_EOL;

fwrite($scriptFile, $script);
fclose($scriptFile);

echo 'Done!';
