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
  'frontend_class'
);
$inputKeys = null;
foreach($rows as $row) {
  if (!in_array('name', $row) && !in_array('type', $row)) {
    array_shift($rows);
  } else {
    $inputKeys = array_shift($rows);
    break;
  }
}
$attributeKeys = array();
foreach($scriptKeys as $key) {
  $index = array_search($key, $inputKeys);
  $attributeKeys[$index] = $key;
} 
$nameIndex = array_search('name', $inputKeys);
unset($scriptKeys);
unset($inputKeys);


$script = '<?php' . PHP_EOL
  . '$installer = Mage::getResourceModel(\'catalog/setup\', \'catalog_setup\');' . PHP_EOL
  . '$installer->startSetup();' . PHP_EOL . PHP_EOL;

foreach($rows as $row) {
  $script .= '$installer->addAttribute(Mage_Catalog_Model_Product::ENTITY, \'' . $row[$nameIndex] . '\', array(' . PHP_EOL;
  foreach($attributeKeys as $index => $attributeKey) {
    if (!($row[$index] == 'true' || $row[$index] == 'false' || strpos($row[$index], 'Mage_') === 0)) {
      $row[$index] = '\'' . $row[$index] . '\'';
    }
    $script .= '  \'' . $attributeKey . '\' => ' . $row[$index] . ',' . PHP_EOL;
  }
  $script .= '));' . PHP_EOL . PHP_EOL;
}

$script .= '$installer->endSetup();' . PHP_EOL;

echo 'Writing to file...' . PHP_EOL . PHP_EOL;

fwrite($scriptFile, $script);
fclose($scriptFile);

echo 'Done!';
