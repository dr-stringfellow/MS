sites=(T2_FI_HIP T2_UK_SGrid_RALPP T2_FR_GRIF_LLR T2_KR_KNU T2_RU_SINP T2_TH_CUNSTDA T2_IT_Bari T2_US_UCSD T1_RU_JINR T2_RU_IHEP T2_RU_RRC_KI T2_CH_CERN T2_CH_CSCS T2_UA_KIPT T2_PK_NCP T2_FR_IPHC T1_US_FNAL T2_IT_Rome T2_UK_London_Brunel T2_US_Vanderbilt T2_EE_Estonia T2_IN_TIFR T2_CN_Beijing T2_US_Florida T1_DE_KIT T2_US_Wisconsin T2_HU_Budapest T2_DE_RWTH T2_BR_SPRACE T2_BR_UERJ T1_UK_RAL T2_ES_IFCA T2_DE_DESY T2_US_Caltech T2_UK_London_IC T2_US_Nebraska T2_ES_CIEMAT T1_IT_CNAF T2_TR_METU T2_AT_Vienna T2_US_Purdue T2_BE_UCL T2_UK_SGrid_Bristol T2_PT_NCG_Lisbon T1_ES_PIC T2_IT_Legnaro T2_RU_INR T2_RU_JINR T2_IT_Pisa T2_GR_Ioannina T2_MY_UPM_BIRUNI T1_FR_CCIN2P3 T2_FR_GRIF_IRFU T2_FR_CCIN2P3 T2_CH_CERN_HLT T2_PL_Warsaw T2_US_MIT T2_BE_IIHE T2_RU_ITEP T2_PL_Swierk
)

DATE_EXISTING=()

for i in $(ls /home/bmaier/T2/site_readiness/MonitoringScripts/metrics/siteReadiness/../../../MonitoringScripts/output/metrics/siteReadiness/*.txt);do
    
    filename=`basename ${i%.*}`
    date=`echo "${filename:(-10)}"`
    DATE_EXISTING+=($date)

done


for k in "${sites[@]}"; do

    DATE_THERE=()

    while read p; do
	
	date=`echo $p | awk '{print $1}'`
	DATE_THERE+=($date)
	
    done < $k.txt

    #echo ${DATE_THERE[@]}
    echo ${DATE_EXISTING[@]} ${DATE_THERE[@]} | tr ' ' '\n' | sort | uniq -u > tmp.txt
    sed -i '$ d' tmp.txt


    LAST_THERE_DATE=${DATE_THERE[${#DATE_THERE[@]}-1]}
    #echo $LAST_THERE_DATE
    
    day_x=$(date -d $LAST_THERE_DATE +%s)
    
    while read p; do

	day_y=$(date -d $p +%s)
	

	if [ $day_x -le $day_y ];
	then
	    #echo $p
	    status=`grep -nr ${k} /home/bmaier/T2/site_readiness/MonitoringScripts/metrics/siteReadiness/../../../MonitoringScripts/output/metrics/siteReadiness/siteReadiness_${p}.txt | awk '{print $4}'`
	    echo $p $status >> $k.txt
	fi 

    done < tmp.txt




done

