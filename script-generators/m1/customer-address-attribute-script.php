<?php 
echo 'Generating install script...' . PHP_EOL . PHP_EOL;

$scriptName = !empty($argv[2]) ? $argv[2] : 'install-0.1.0.php';
$scriptFile = fopen($scriptName, 'w') or die("Couldn't open new $scriptName file");

$csvFile = $argv[1];
$rows = array_map('str_getcsv', file($csvFile));
$scriptKeys = array(
  'label',
  'type',
  'input',
  'required',
  'visible',
  'input_validation',
  'max_text_length',
  'min_text_length',
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
  $script .= '$installer->addAttribute(\'customer_address\', \'' . $row[$nameIndex] . '\', array(' . PHP_EOL;
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
$script .= '  $attribute = Mage::getSingleton(\'eav/config\')->getAttribute(\'customer_address\', $attr);' . PHP_EOL;
$script .= '  if (empty($attribute[\'adminhtml_only\'])) {' . PHP_EOL;
$script .= '    $attribute->setData(\'used_in_forms\',  array(' . PHP_EOL;
$script .= '      \'adminhtml_customer_address\',' . PHP_EOL;
$script .= '      \'customer_address_edit\',' . PHP_EOL;
$script .= '      \'customer_register_address\'' . PHP_EOL;
$script .= '    ));' . PHP_EOL;
$script .= '  } else {' . PHP_EOL;
$script .= '    $attribute->setData(\'used_in_forms\',  array(' . PHP_EOL;
$script .= '      \'adminhtml_customer_address\',' . PHP_EOL;
$script .= '    ));' . PHP_EOL;
$script .= '  }' . PHP_EOL;
$script .= '  $attribute->save();' . PHP_EOL;
$script .= '}' . PHP_EOL . PHP_EOL;

$script .= '$installer->endSetup();' . PHP_EOL;

echo 'Writing to file...' . PHP_EOL . PHP_EOL;

fwrite($scriptFile, $script);
fclose($scriptFile);

echo 'Done!';
