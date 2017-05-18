<?php

date_default_timezone_set('America/New_York');

if ( (isset($_REQUEST['getSiteReadiness']) && $_REQUEST['getSiteReadiness']) ) {


  $readiness_array_new = array();
  $directory = 'txtfiles/';

  $how_many_weeks = 4;

  if (isset($_REQUEST['nweeks']))
    $how_many_weeks = $_REQUEST['nweeks'];

  //echo time();
  
  if (! is_dir($directory)) {
    exit('Invalid diretory path');
  }

  foreach (scandir($directory) as $file) {
    if ('.' === $file) continue;
    if ('..' === $file) continue;

    if (($handle = fopen("txtfiles/" . $file, "r")) !== FALSE) {
      if (strpos($file, 'T2_US') !== false){
	
	$siteinfo = array('site' => str_replace('.txt','',$file), 'data' => array());

	$flag = true;
	while (($data = fgetcsv($handle, 2000, " ")) !== FALSE) {

	  if($flag) { $flag = false; continue; }//deletes first line of csv
	  $num = count($data);

	  if (strtotime($data[0]) > time()-$how_many_weeks*7*24*60*60){
	    $tmp_array = array('date' => $data[0], 'status' => $data[1]);
	    $siteinfo['data'][] = $tmp_array;
	  }
	}
	fclose($handle);
	
	$readiness_array_new[] = $siteinfo;
	
      }    
    }
  }

  echo @json_encode($readiness_array_new);
  
}

?>



