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
  'searchable',
  'filterable',
  'comparable',
  'visible_on_front',
  'visible_in_advanced_search',
  'used_in_product_listing',
  'unique',
  'source',
  'backend',
  'frontend',
  'default',
  'input_renderer',
  'sort_order',
  'used_for_sort_by',
  'position',
  'is_configurable',
  'used_for_promo_rules',
  'filterable_in_search',
  'is_html_allowed_on_front',
  'frontend_class',
  'apply_to'
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
unset($scriptKeys);
unset($inputKeys);

// Begin install script string
$script = '<?php' . PHP_EOL
  . '$installer = Mage::getResourceModel(\'catalog/setup\', \'catalog_setup\');' . PHP_EOL
  . '$installer->startSetup();' . PHP_EOL . PHP_EOL;

// Write $installer->addAttribute() for each row beneath the attribute keys header
foreach($rows as $row) {
  if (empty($row[$nameIndex])) {
    continue;
  }
  $script .= '$installer->addAttribute(Mage_Catalog_Model_Product::ENTITY, \'' . $row[$nameIndex] . '\', array(' . PHP_EOL;
  foreach($attributeKeys as $index => $attributeKey) {
    if (!($row[$index] == 'true' || $row[$index] == 'false' || strpos($row[$index], 'Mage_') === 0)) {
      $row[$index] = '\'' . $row[$index] . '\'';
    }
    $script .= '  \'' . $attributeKey . '\' => ' . $row[$index] . ',' . PHP_EOL;
  }
  $script .= '  \'user_defined\' => true,' . PHP_EOL;
  $script .= '));' . PHP_EOL . PHP_EOL;
}

$script .= '$installer->endSetup();' . PHP_EOL;

echo 'Writing to file...' . PHP_EOL . PHP_EOL;

fwrite($scriptFile, $script);
fclose($scriptFile);

echo 'Done!';
